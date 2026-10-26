const { validateAllSnippets } = require("../utils/pythonValidator");

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 90000;

/**
 * Removes stray rendering or UI artifacts from AI responses.
 */
const cleanResponseArtifacts = (text) => {
  if (!text) return "";
  return text
    .replace(/(?:PYTHON|JAVASCRIPT|JAVA|C\+\+|C)?\s*Copy\s*Code/gi, "")
    .replace(/\r\n/g, "\n");
};

/**
 * Builds a contextual system prompt for AELORIA AI with strict technical accuracy rules.
 */
const buildSystemPrompt = ({
  course = "",
  subject = "",
  topic = "",
  lessonContent = "",
  learningPoints = [],
  action = "answer",
}) => {
  let contextSection = "";
  const hasCourseInfo = Boolean(course || subject || topic);
  const hasLessonContent = Boolean(lessonContent && lessonContent.trim());
  const pointsList = Array.isArray(learningPoints)
    ? learningPoints
    : typeof learningPoints === "string" && learningPoints
      ? [learningPoints]
      : [];

  if (hasCourseInfo || hasLessonContent || pointsList.length > 0) {
    contextSection = `
Active Learning Context:
- Course: ${course || "Programming & Technology"}
- Subject: ${subject || "Computer Science"}
- Topic: ${topic || "General"}
${hasLessonContent ? `Lesson Reference Material:\n${lessonContent.trim()}` : ""}
${pointsList.length > 0 ? `Key Learning Points:\n${pointsList.map((p) => `- ${p}`).join("\n")}` : ""}
`;
  }

  let actionDirective = "";
  switch (action) {
    case "explain":
      actionDirective =
        "Explain the concept simply in beginner-friendly language using an intuitive real-world analogy.";
      break;
    case "example":
      actionDirective =
        "Provide practical, clean, and realistic examples. Break down and explain each key component step-by-step.";
      break;
    case "code":
      actionDirective =
        "Provide clean, well-commented, and runnable code with a concise step-by-step explanation. Always specify the programming language tag in fenced code blocks (e.g. ```python).";
      break;
    case "quiz":
      actionDirective =
        "Ask exactly ONE quiz question (multiple choice with options A, B, C, D) about the topic to test student understanding, and provide the correct answer with an explanation.";
      break;
    default:
      actionDirective =
        "Answer the student's question directly, accurately, educationally, and concisely.";
  }

  return `You are AELORIA AI, an expert, rigorous programming mentor and educational tutor for the AELORIA learning platform (Tagline: Learn. Practice. Build.).

MANDATORY TECHNICAL ACCURACY & GROUND TRUTH RULES:
1. Strict Standard Library APIs:
   - Stick strictly to genuine, documented standard library methods and signatures.
   - NEVER invent non-existent methods, parameters, or attributes.
   - Specifically in Python: Python lists, dictionaries, and sets DO NOT have a 'deep' parameter. Calling list.copy(deep=True) is INVALID syntax and raises TypeError. In Python, deep copies MUST be created using 'import copy; copy.deepcopy(x)'.
2. Shallow vs Deep Copy Semantics:
   - A shallow copy (e.g., x.copy(), x[:], copy.copy(x)) duplicates only the outer container. It stores REFERENCES to the same inner/nested objects.
   - If a nested object is mutable (like a nested list or dict), mutating that nested object through the shallow copy (e.g., shallow[0].append(...) or shallow[0][0] = ...) MUTATES THAT SAME NESTED OBJECT IN THE ORIGINAL LIST AS WELL.
   - A deep copy (copy.deepcopy(x)) recursively duplicates all nested objects, creating completely independent data structures where nested mutations NEVER affect the original.
3. Code & Output Consistency:
   - Mentally trace every code snippet line by line before providing explanations.
   - Ensure that your step-by-step explanation, output comments (# Output: ...), and code examples are 100% consistent with real Python runtime behavior.
4. Clean Markdown Code Blocks:
   - Always wrap code in fenced code blocks with language tags (e.g. \`\`\`python).
   - Format expected output as comments within the code (# Output: ...) or in plain text blocks (\`\`\`text), not as executable python blocks.
   - Do NOT emit UI artifacts such as "PYTHONCopy Code" or "Copy Code" in your text.
5. Code Debugging & Fixing:
   - When a student provides broken code, identify the exact syntax or logic error, explain why it occurred, and provide the tested, corrected code.
6. Follow-Up Questions:
   - Use the conversation history to resolve contextual references accurately (e.g. "Explain the second one in more detail").
7. Context Integration:
   - When active lesson reference material is provided, relate to it when relevant, but answer general and out-of-lesson programming questions directly and authoritatively.

${contextSection}
Special Mode: ${actionDirective}`;
};

/**
 * Controller to generate AI responses using the local AI provider (Ollama),
 * with code extraction, isolated sandbox validation, and auto-correction.
 */
const generateAIResponse = async (req, res) => {
  try {
    const {
      message,
      history = [],
      subject = "",
      topic = "",
      course = "",
      lessonContent = "",
      learningPoints = [],
      action = "answer",
    } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your question.",
      });
    }

    const cleanMessage = message.trim();
    const systemPrompt = buildSystemPrompt({
      course,
      subject,
      topic,
      lessonContent,
      learningPoints,
      action,
    });

    // Format conversation history for multi-turn chat
    const formattedHistory = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-10)) {
        const role =
          turn.role === "assistant" || turn.type === "ai"
            ? "assistant"
            : turn.role === "user" || turn.type === "user"
              ? "user"
              : null;
        const content = turn.content || turn.message;
        if (role && content && typeof content === "string") {
          formattedHistory.push({ role, content: content.trim() });
        }
      }
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: cleanMessage },
    ];

    let aiResponseText = "";
    let providerError = null;

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages,
          stream: false,
        }),
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `AI Provider returned status ${response.status}: ${errorText || response.statusText}`
        );
      }

      const data = await response.json();
      aiResponseText = data?.message?.content || data?.response || "";
    } catch (networkOrTimeoutError) {
      providerError = networkOrTimeoutError;
      console.error(
        `[AELORIA AI] Provider call failed (${OLLAMA_BASE_URL}):`,
        networkOrTimeoutError.message
      );
    }

    // If the real AI provider failed, return an honest, clear error message.
    if (!aiResponseText) {
      const isTimeout =
        providerError?.name === "TimeoutError" ||
        providerError?.message?.includes("timed out");

      return res.status(503).json({
        success: false,
        message: isTimeout
          ? "AELORIA AI took longer than expected to generate a response. Please try again."
          : `AELORIA AI could not connect to the local AI model (${OLLAMA_MODEL}). Please verify Ollama is running.`,
      });
    }

    // 1. Sanitize any unwanted UI or formatting artifacts
    aiResponseText = cleanResponseArtifacts(aiResponseText);

    // 2. Validate extracted Python snippets in isolated sandbox
    try {
      const validation = await validateAllSnippets(aiResponseText);

      // If any snippet failed validation (e.g. invalid syntax or TypeError),
      // perform a fast auto-correction turn with the AI provider
      if (validation.hasCode && !validation.allValid) {
        const failedResult = validation.results.find((r) => !r.isValid);
        if (failedResult && failedResult.error) {
          console.warn(
            "[AELORIA AI] Code validation failed in generated response:",
            failedResult.error
          );

          const correctionPrompt = [
            ...messages,
            { role: "assistant", content: aiResponseText },
            {
              role: "user",
              content: `A Python code snippet in your previous response produced an execution error during verification:\n\`\`\`\n${failedResult.error}\n\`\`\`\nPlease provide a corrected response with 100% valid Python code (note: list.copy() takes no keyword arguments; use copy.deepcopy() for deep copies).`,
            },
          ];

          const corrRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: OLLAMA_MODEL,
              messages: correctionPrompt,
              stream: false,
            }),
            signal: AbortSignal.timeout(AI_TIMEOUT_MS),
          });

          if (corrRes.ok) {
            const corrData = await corrRes.json();
            const correctedText = corrData?.message?.content;
            if (correctedText) {
              aiResponseText = cleanResponseArtifacts(correctedText);
            }
          }
        }
      }
    } catch (valErr) {
      console.warn("[AELORIA AI] Code validation check skipped:", valErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "AELORIA AI response generated successfully.",
      data: {
        response: aiResponseText,
        action,
        subject,
        topic,
        course,
      },
    });
  } catch (error) {
    console.error("AELORIA AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "AELORIA AI encountered an unexpected error processing your request.",
    });
  }
};

module.exports = {
  generateAIResponse,
};