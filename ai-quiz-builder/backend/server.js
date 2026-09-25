import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GROQ_API_KEY;
const MODEL = "openai/gpt-oss-120b"; // Groq's recommended replacement for the retired llama-3.3-70b-versatile

if (!API_KEY) {
  console.warn(
    "WARNING: GROQ_API_KEY is not set. Copy .env.example to .env and add your key."
  );
}

function buildSystemPrompt(count, difficulty) {
  return `You are a quiz-writing assistant. Output ONLY raw JSON, no markdown fences, no preamble, no commentary. The JSON must match exactly this shape:
{"title": string, "questions": [{"question": string, "options": [string, string, string, string], "correctIndex": number, "explanation": string}]}
Rules:
- Produce exactly ${count} questions.
- Difficulty: ${difficulty}.
- Each question has exactly 4 options, only one correct.
- correctIndex is 0-based.
- explanation is 1-2 sentences, teaches why the answer is correct.
- title is a short (max 6 word) name for this quiz.
- Do not wrap the JSON in backticks or add any text outside the JSON object.`;
}

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { mode, topic, notes, count, difficulty } = req.body || {};

    if (!API_KEY) {
      return res.status(500).json({ error: "Server is missing GROQ_API_KEY." });
    }
    if (!mode || (mode === "topic" && !topic) || (mode === "notes" && !notes)) {
      return res.status(400).json({ error: "Missing topic or notes." });
    }

    const safeCount = Math.min(Math.max(Number(count) || 5, 3), 15);
    const safeDifficulty = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";

    const source =
      mode === "topic"
        ? `Topic: ${topic}`
        : `Source notes (base every question strictly on this content):\n"""\n${String(notes).slice(0, 12000)}\n"""`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(safeCount, safeDifficulty) },
          { role: "user", content: source },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return res.status(502).json({ error: "Quiz generation failed upstream." });
    }

    const data = await response.json();
    const text = (data.choices?.[0]?.message?.content || "").trim();

    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("Failed to parse model output as JSON:", clean);
      return res.status(502).json({ error: "Model returned malformed quiz data." });
    }

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return res.status(502).json({ error: "Model did not return valid questions." });
    }

    // Strict validation and sanitization of questions structure
    const validQuestions = parsed.questions
      .filter((q) => {
        return (
          q &&
          typeof q.question === "string" &&
          q.question.trim().length > 0 &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.every((opt) => typeof opt === "string" && opt.trim().length > 0) &&
          typeof q.correctIndex === "number" &&
          Number.isInteger(q.correctIndex) &&
          q.correctIndex >= 0 &&
          q.correctIndex <= 3
        );
      })
      .map((q) => ({
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctIndex: q.correctIndex,
        explanation: (q.explanation || "Correct answer based on the source concept.").trim(),
      }));

    if (validQuestions.length === 0) {
      return res.status(502).json({ error: "No valid assessment items could be extracted from AI response." });
    }

    res.json({
      title: (parsed.title || "Assessment Quiz").trim(),
      questions: validQuestions,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`AI Quiz Builder backend running on http://localhost:${PORT}`);
});
