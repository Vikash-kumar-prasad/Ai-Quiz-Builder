import { useState } from "react";
import mammoth from "mammoth";
import "./styles.css";
import { generateQuiz } from "./api.js";
import { extractPdfText } from "./pdfText.js";
import { extractPptxText } from "./pptxText.js";
import SetupScreen from "./components/SetupScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";

// Top-level component: owns all app state and stage transitions, and
// renders whichever screen matches the current stage. Each screen is a
// "dumb" component — it just receives data and callbacks as props.
export default function QuizBuilder() {
  const [stage, setStage] = useState("setup"); // setup | loading | quiz | results | error
  const [mode, setMode] = useState("topic");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]); // {selected, correct}
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canGenerate = mode === "topic" ? topic.trim().length > 2 : notes.trim().length > 20;

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB — pptx/pdf files with embedded images get large fast, even though the actual text is small

  async function handleFileSelected(file) {
    const lower = file.name.toLowerCase();
    const isDocx = lower.endsWith(".docx");
    const isPdf = lower.endsWith(".pdf");
    const isPptx = lower.endsWith(".pptx");
    const isTxt = lower.endsWith(".txt");

    if (!isDocx && !isPdf && !isPptx && !isTxt) {
      setErrorMsg(`"${file.name}" isn't a supported file type. Please upload a .txt, .docx, .pdf, or .pptx.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`"${file.name}" is too large (max 50MB). Try a shorter document or paste the notes directly.`);
      return;
    }

    setFileName(file.name);
    setErrorMsg("");
    try {
      if (isDocx) {
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        setNotes(result.value);
      } else if (isPdf) {
        setNotes(await extractPdfText(file));
      } else if (isPptx) {
        setNotes(await extractPptxText(file));
      } else {
        setNotes(await file.text());
      }
    } catch (err) {
      setFileName("");
      setErrorMsg(
        err.message && (isPdf || isPptx)
          ? err.message
          : "Couldn't read that file. Try a .txt, .docx, .pdf, or .pptx, or paste your notes directly."
      );
    }
  }

  async function handleGenerate() {
    setStage("loading");
    setErrorMsg("");
    try {
      const result = await generateQuiz({ mode, topic, notes, count, difficulty });
      setQuiz(result);
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setRevealed(false);
      setStage("quiz");
    } catch (err) {
      setErrorMsg("Something went wrong generating your quiz. Try again, or simplify your topic/notes.");
      setStage("error");
    }
  }

  function pickOption(i) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const q = quiz.questions[current];
    setAnswers((a) => [...a, { selected: i, correct: i === q.correctIndex }]);
  }

  function next() {
    if (current + 1 < quiz.questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setStage("results");
    }
  }

  function restart() {
    setStage("setup");
    setQuiz(null);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
    setErrorMsg("");
    setFileName("");
  }

  return (
    <div className="board-root">
      {stage === "setup" && (
        <SetupScreen
          mode={mode} setMode={setMode}
          topic={topic} setTopic={setTopic}
          notes={notes} setNotes={setNotes}
          fileName={fileName}
          count={count} setCount={setCount}
          difficulty={difficulty} setDifficulty={setDifficulty}
          errorMsg={errorMsg}
          canGenerate={canGenerate}
          onGenerate={handleGenerate}
          onFileSelected={handleFileSelected}
        />
      )}

      {stage === "loading" && <LoadingScreen />}

      {stage === "error" && (
        <ErrorScreen errorMsg={errorMsg} onBackToSetup={() => setStage("setup")} />
      )}

      {stage === "quiz" && quiz && (
        <QuizScreen
          quiz={quiz}
          current={current}
          selected={selected}
          revealed={revealed}
          onPickOption={pickOption}
          onNext={next}
        />
      )}

      {stage === "results" && quiz && (
        <ResultsScreen quiz={quiz} answers={answers} onRestart={restart} />
      )}
    </div>
  );
}
