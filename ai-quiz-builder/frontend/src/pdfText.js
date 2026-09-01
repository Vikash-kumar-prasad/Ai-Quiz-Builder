import * as pdfjsLib from "pdfjs-dist";
// Vite's ?url import gives us the built worker file's URL so pdf.js can
// run parsing off the main thread. This is the standard way to wire up
// pdf.js in a Vite project.
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

// Extracts plain text from a PDF file entirely in the browser (no server
// round-trip). Throws if the file can't be parsed, or if it looks like a
// scanned/image-only PDF with no real text layer.
export async function extractPdfText(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  const trimmed = text.trim();
  if (trimmed.length < 20) {
    throw new Error(
      "This PDF doesn't seem to have selectable text (it may be a scanned image). Try pasting the notes directly instead."
    );
  }
  return trimmed;
}
