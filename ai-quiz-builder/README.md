# AI Quiz Builder

A web app that generates quizzes from a topic or your own notes, using Groq.

## Project structure

```
ai-quiz-builder/
  backend/    Express server — holds your API key, calls Groq, returns quiz JSON
  frontend/   Vite + React app — the chalkboard UI you've been using
```

## 1. Get an API key

Sign up / log in at https://console.groq.com and create an API key from
the API Keys page. It's free — no credit card required, with a daily
free-usage allowance that refreshes each day.

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and paste your key in place of `your_key_here`:

```
GROQ_API_KEY=gsk_...
PORT=3001
```

Then start it:

```bash
npm run dev
```

You should see: `AI Quiz Builder backend running on http://localhost:3001`

## 3. Run the frontend

In a **new terminal tab** (leave the backend running):

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`. Open that in
your browser — the app will call your backend at `localhost:3001`, which
calls Groq on its behalf.

## How it works

1. You submit a topic or notes in the browser.
2. The frontend sends that to your **backend** (`POST /api/generate-quiz`) —
   not directly to Groq.
3. The backend attaches your API key (which never leaves the server) and
   calls Groq's API (`openai/gpt-oss-120b`), asking for quiz questions as
   structured JSON.
4. The backend returns the parsed quiz JSON to the frontend, which renders
   the quiz-taking UI.

This is the standard pattern for any app that uses a paid or rate-limited
API: the key lives on a server you control, never in code that runs in
someone's browser.

## Notes

- `.txt`, `.docx`, `.pdf`, and `.pptx` note uploads are all parsed in the
  browser (PDFs need a real text layer, and PowerPoint files need actual
  text on the slides — scanned/image-only content isn't supported without OCR).
- There's no database yet, so quizzes aren't saved between page reloads —
  that's a good next step once this is running.
- For a real deployment, you'd host `backend/` somewhere like Render or
  Railway, and `frontend/` (after `npm run build`) somewhere like Vercel or
  Netlify.
