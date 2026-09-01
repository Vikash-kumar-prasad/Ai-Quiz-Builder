const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// Sends the user's quiz request to our backend (never calls the AI provider
// directly — the backend owns the API key). Throws on any failure so callers
// can catch it and show an error state.
export async function generateQuiz({ mode, topic, notes, count, difficulty }) {
  const response = await fetch(`${BACKEND_URL}/api/generate-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, topic, notes, count, difficulty }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Quiz generation failed.");
  }
  if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("Server did not return valid questions.");
  }
  return data;
}
