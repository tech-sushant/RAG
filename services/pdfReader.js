import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

function cleanText(text) {
  return text
    .replace(/\n(?=\S)/g, ' ')   
    .replace(/[ ]{2,}/g, ' ')  
    .replace(/\n{2,}/g, '\n\n')
    .trim();
}

export async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const pages = data.text.split(/\f/).map((text, index) => ({
    page: index + 1,
    text: cleanText(text),
  })).filter(p => p.text);

  return pages;
}
