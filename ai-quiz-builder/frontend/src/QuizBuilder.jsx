import { useState } from "react";
import "./styles.css";
import { generateQuiz } from "./api.js";
import SetupScreen from "./components/SetupScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";

export default function QuizBuilder() {
  const [stage, setStage] = useState("setup"); // setup | loading | quiz | results | error
  const [mode, setMode] = useState("topic");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [timerSeconds, setTimerSeconds] = useState(0); // 0 = untimed
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]); // {selected, correct}
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canGenerate = mode === "topic" ? topic.trim().length > 2 : notes.trim().length > 20;

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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
      // Dynamic imports: Keep the initial bundle lightweight
      if (isDocx) {
        const mammoth = (await import("mammoth")).default;
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        setNotes(result.value);
      } else if (isPdf) {
        const { extractPdfText } = await import("./pdfText.js");
        setNotes(await extractPdfText(file));
      } else if (isPptx) {
        const { extractPptxText } = await import("./pptxText.js");
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

  function handleClearFile() {
    setFileName("");
    setNotes("");
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
      setErrorMsg(err.message || "Something went wrong generating your quiz. Try again or simplify your input.");
      setStage("error");
    }
  }

  function pickOption(i) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const q = quiz.questions[current];
    const isCorrect = i === q.correctIndex;
    setAnswers((a) => [...a, { selected: i, correct: isCorrect }]);
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

  function retryMissed() {
    if (!quiz || !answers) return;
    const missedQuestions = quiz.questions.filter((_, idx) => answers[idx] && !answers[idx].correct);
    if (missedQuestions.length === 0) return;

    setQuiz({
      ...quiz,
      title: `${quiz.title} (Practice Missed)`,
      questions: missedQuestions,
    });
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setRevealed(false);
    setStage("quiz");
  }

  return (
    <div className="board-root">
      {stage === "setup" && (
        <SetupScreen
          mode={mode}
          setMode={setMode}
          topic={topic}
          setTopic={setTopic}
          notes={notes}
          setNotes={setNotes}
          fileName={fileName}
          onClearFile={handleClearFile}
          count={count}
          setCount={setCount}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          timerSeconds={timerSeconds}
          setTimerSeconds={setTimerSeconds}
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
          timerSeconds={timerSeconds}
          onPickOption={pickOption}
          onNext={next}
        />
      )}

      {stage === "results" && quiz && (
        <ResultsScreen
          quiz={quiz}
          answers={answers}
          onRestart={restart}
          onRetryMissed={retryMissed}
        />
      )}
    </div>
  );
}
