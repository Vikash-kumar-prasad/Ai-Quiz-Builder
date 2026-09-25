# AI Quiz Builder — Smart Assessments Powered by AI

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Node.js_/_Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Groq](https://img.shields.io/badge/Groq_Cloud-Inference-F05A28?logo=fastapi&logoColor=white)](https://groq.com/)

A modern full-stack web application that creates interactive, curriculum-grade quizzes from topics or study documents using Groq's high-speed inference.

## Project Structure

```
ai-quiz-builder/
├── backend/    # Express server — holds API key, proxies Groq, validates questions
└── frontend/   # Vite + React SPA — modern dark SaaS assessment UI
```

## Quick Start

### 1. Get a Groq API Key
Obtain a free API key at [console.groq.com](https://console.groq.com).

### 2. Run the Backend
```bash
cd backend
npm install
cp .env.example .env
```

Set your API key in `backend/.env`:
```
GROQ_API_KEY=gsk_...
PORT=3001
```

Start the backend:
```bash
npm run dev
```

### 3. Run the Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Features & Highlights
- **Topic & Document Support**: Ingest free-form topics or upload `.pdf`, `.docx`, `.pptx`, and `.txt` files parsed 100% in-browser.
- **Configurable Quizzes**: Customizable question counts (3–15), difficulty levels, and optional per-question countdown timer.
- **Interactive Quiz Flow**: Keyboard navigation (`A–D` or `1–4` to pick, `Enter` to advance), real-time progress bar, and immediate pedagogical explanations.
- **Review & Analytics**: Accuracy percentage, performance evaluation badge, filterable review list (*All*, *Missed*, *Correct*), and **"Retry Missed Questions"** mode.
- **Performance Optimized**: Lazy-loaded document parsers keep the initial bundle light (~53 kB gzipped).
