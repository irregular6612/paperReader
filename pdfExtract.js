// pdfExtract.js
const fs = require('fs');
const pdf = require('pdf-parse');

async function extractDigitalPdfText(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  // data.text에 PDF 내 텍스트가 담긴다
  return data.text || "";
}

module.exports = {
  extractDigitalPdfText
};