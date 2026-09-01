import JSZip from "jszip";

// .pptx files are actually zip archives — each slide's text lives in
// ppt/slides/slideN.xml as a series of <a:t> (text run) elements. This
// unzips the file and walks every slide in order, entirely in the browser.
export async function extractPptxText(file) {
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error("Couldn't find any slides in this file. Make sure it's a valid .pptx.");
  }

  const parser = new DOMParser();
  let text = "";

  for (const slidePath of slideFiles) {
    const xml = await zip.files[slidePath].async("string");
    const doc = parser.parseFromString(xml, "application/xml");
    const textNodes = doc.getElementsByTagName("a:t");
    const slideText = Array.from(textNodes)
      .map((node) => node.textContent)
      .join(" ")
      .trim();
    if (slideText) {
      text += slideText + "\n";
    }
  }

  const trimmed = text.trim();
  if (trimmed.length < 20) {
    throw new Error(
      "This PowerPoint doesn't seem to have much readable text on its slides (it may be mostly images). Try pasting the notes directly instead."
    );
  }
  return trimmed;
}
