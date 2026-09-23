const generateAIResponse = async (req, res) => {
  try {
    const {
      message,
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
    const parsedPoints = Array.isArray(learningPoints)
      ? learningPoints
      : typeof learningPoints === "string" && learningPoints
      ? [learningPoints]
      : [];

    let actionInstruction = "";

    switch (action) {
      case "explain":
        actionInstruction =
          "Action: Explain Simply. Explain the current lesson concept in simple, beginner-friendly language. Break down complex terms step by step.";
        break;

      case "example":
        actionInstruction =
          "Action: Give Example. Give a practical, realistic example based strictly on the current topic and explain each part step by step.";
        break;

      case "code":
        actionInstruction =
          "Action: Give Code. Provide clean, correct, and well-commented programming code related to this topic. Explain how the code works step by step.";
        break;

      case "quiz":
        actionInstruction =
          "Action: Quiz Me. Ask exactly ONE quiz question about the current topic to test the student's understanding. Provide multiple choices (A, B, C, D) or ask a conceptual question, and wait for their answer.";
        break;

      default:
        actionInstruction =
          "Action: Direct Answer. Answer the student's question clearly, accurately, and educationally.";
    }

    const hasLessonContext = Boolean(lessonContent && lessonContent.trim());

    const prompt = `
You are AELORIA AI, the intelligent, encouraging learning companion for the AELORIA programming and technology learning platform (Tagline: Learn. Practice. Build.).

Current Learning Context:
- Course: ${course || "General Learning"}
- Subject: ${subject || "Programming & Technology"}
- Topic: ${topic || "General Discussion"}

Lesson Content:
${hasLessonContext ? lessonContent.trim() : "No course lesson content was provided. The student is asking a general programming question."}

Key Learning Points:
${
  parsedPoints.length > 0
    ? parsedPoints.map((point) => `- ${point}`).join("\n")
    : "No specific learning points provided."
}

Special Instruction:
${actionInstruction}

Core AELORIA AI Rules:
1. Use the provided current lesson content as your primary context whenever it is available.
2. Prefer the provided learning points when explaining the topic.
3. Keep all answers beginner-friendly and explain step-by-step.
4. Do not invent course-specific facts, lessons, or requirements not present in the lesson content.
5. If the information requested is not present in the provided lesson content, clearly and politely state that it is outside the provided lesson context, then provide an accurate general programming explanation.
6. Provide clean, readable code with syntax conventions when code is helpful or requested.
7. Keep explanations educational, concise, and focused.
8. Do not give unrelated or off-topic information.
9. For quiz mode, ask exactly one question at a time.
10. Encourage the student to practice what they learn.

Student Question:
${cleanMessage}
`;

    let response;
    try {
      response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          prompt,
          stream: false,
        }),
      });
    } catch (networkError) {
      console.error("Ollama Network Error:", networkError.message);
      return res.status(503).json({
        success: false,
        message:
          "AELORIA AI could not connect to the local AI model. Make sure Ollama is running.",
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama Response Error:", response.status, errorText);

      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          message:
            "Local AI model 'llama3.2' was not found in Ollama. Run 'ollama pull llama3.2' to install it.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "AELORIA AI could not connect to the local AI model. Make sure Ollama is running.",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: "AELORIA AI response generated successfully.",
      data: {
        response:
          data.response ||
          "Sorry, I could not generate a response right now. Please try again.",
        action,
        subject,
        topic,
        course,
      },
    });
  } catch (error) {
    console.error("AELORIA AI Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "AELORIA AI could not process your request.",
    });
  }
};

module.exports = {
  generateAIResponse,
};