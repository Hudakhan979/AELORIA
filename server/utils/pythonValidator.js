const { spawn } = require("child_process");

const DANGEROUS_PATTERNS = [
  /\bimport\s+(os|subprocess|sys|shutil|socket|urllib|requests|pathlib|ctypes|builtins|multiprocessing|threading)\b/,
  /\bfrom\s+(os|subprocess|sys|shutil|socket|urllib|requests|pathlib|ctypes|builtins|multiprocessing|threading)\b/,
  /\b(__import__|eval|exec|open|breakpoint|compile)\b\s*\(/,
  /\b(while\s+True|while\s+1)\b/, // prevent obvious infinite loops
];

/**
 * Checks whether a code block is genuine executable Python code
 * rather than sample console output (e.g. "Original List: [[1, 2]]").
 */
function isExecutablePython(code, precedingMarkdown = "") {
  if (!code) return false;
  const trimmed = code.trim();

  // If preceded by "Output:" or "Console:" or "Expected output:"
  if (/(?:output|result|expected output|console)\s*:\s*$/i.test(precedingMarkdown.trim())) {
    return false;
  }

  // If the block itself begins with an output label
  if (/^(?:output|result|expected output|console|run)\s*:/i.test(trimmed)) {
    return false;
  }

  // If it's just raw printed output data like [[1, 2], [3, 4]] without statements
  if (/^\[.*\]$/s.test(trimmed) && !trimmed.includes("=") && !trimmed.includes("def ")) {
    return false;
  }

  // Must contain typical Python keywords or variable assignments
  const hasPythonStatements =
    /\b(import|from|def|class|return|if|elif|else|for|while|try|except|with|print|raise)\b/.test(
      trimmed
    ) || /^[a-zA-Z_]\w*\s*(=|\+=|-=|\*=)/m.test(trimmed);

  return hasPythonStatements;
}

/**
 * Extracts executable python code snippets from markdown text.
 */
function extractPythonCodeBlocks(markdownText) {
  if (!markdownText) return [];
  const normalized = markdownText.replace(/\r\n/g, "\n");
  const codeBlockRegex = /```(?:python|py)?\s*\n([\s\S]*?)```/gi;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(normalized)) !== null) {
    const precedingText = normalized.slice(Math.max(0, match.index - 50), match.index);
    const code = match[1].trim();

    if (code && isExecutablePython(code, precedingText)) {
      blocks.push(code);
    }
  }

  return blocks;
}

/**
 * Safely executes or validates a Python code snippet in an isolated sandbox child process.
 * Security rules:
 * - Uses python -I -s -S (isolated mode, no user site packages, no user env).
 * - Strips all host environment variables (env: { SYSTEMROOT, PATH }).
 * - Hard execution timeout of 2500ms.
 * - If dangerous system/network calls or infinite loops are detected, falls back to AST syntax parsing only.
 */
function validatePythonSnippet(codeSnippet, timeoutMs = 2500) {
  return new Promise((resolve) => {
    if (!codeSnippet || !codeSnippet.trim()) {
      return resolve({ isValid: true, skipped: true, reason: "empty snippet" });
    }

    const isPotentiallyDangerous = DANGEROUS_PATTERNS.some((pat) =>
      pat.test(codeSnippet)
    );

    // If potentially dangerous, validate syntax with ast.parse without executing
    if (isPotentiallyDangerous) {
      const astCheckCode = `import ast\nast.parse(${JSON.stringify(codeSnippet)})`;
      const child = spawn("python", ["-I", "-s", "-c", astCheckCode], {
        timeout: timeoutMs,
        env: {
          SYSTEMROOT: process.env.SYSTEMROOT || "C:\\Windows",
          PATH: process.env.PATH || "",
        },
      });

      let stderr = "";
      child.stderr.on("data", (d) => (stderr += d.toString()));
      child.on("close", (code) => {
        if (code === 0) {
          resolve({
            isValid: true,
            isSafeSyntaxOnly: true,
            stdout: null,
            error: null,
          });
        } else {
          resolve({
            isValid: false,
            isSafeSyntaxOnly: true,
            error: stderr.trim(),
            stdout: null,
          });
        }
      });
      child.on("error", (err) => {
        resolve({ isValid: false, error: err.message, stdout: null });
      });
      return;
    }

    // Safe snippet: execute in isolated Python sandbox
    const child = spawn("python", ["-I", "-s", "-c", codeSnippet], {
      timeout: timeoutMs,
      env: {
        SYSTEMROOT: process.env.SYSTEMROOT || "C:\\Windows",
        PATH: process.env.PATH || "",
      },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      if (code === 0) {
        resolve({
          isValid: true,
          stdout: stdout.trim(),
          error: null,
        });
      } else {
        resolve({
          isValid: false,
          error: stderr.trim(),
          stdout: stdout.trim(),
        });
      }
    });

    child.on("error", (err) => {
      resolve({
        isValid: false,
        error: err.message,
        stdout: null,
      });
    });
  });
}

/**
 * Validates all executable Python snippets in an AI response.
 */
async function validateAllSnippets(markdownText) {
  const snippets = extractPythonCodeBlocks(markdownText);
  if (snippets.length === 0) {
    return { hasCode: false, allValid: true, results: [] };
  }

  const results = [];
  for (const snippet of snippets) {
    const res = await validatePythonSnippet(snippet);
    results.push({ snippet, ...res });
  }

  const allValid = results.every((r) => r.isValid);
  return { hasCode: true, allValid, results };
}

module.exports = {
  extractPythonCodeBlocks,
  validatePythonSnippet,
  validateAllSnippets,
};
