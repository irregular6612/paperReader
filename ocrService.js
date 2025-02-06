// ocrService.js
import fs from 'fs';
import path from 'path';
import tesseract from 'node-tesseract-ocr';
import { extractDigitalPdfText } from './pdfExtract.js';

async function pdfToTextOrOcr(pdfPath) {
  // 1) pdf-parse로 디지털 텍스트 추출 시도
  const digitalText = await extractDigitalPdfText(pdfPath);

  // 2) 만약 텍스트가 어느 정도 있다면(예: 공백 제외 50자 이상)
  //    디지털 PDF라고 판단하고 그대로 사용
  if (digitalText.replace(/\s/g, "").length > 50) {
    return digitalText;
  }
  /* 
  // 3) 텍스트가 거의 없으면 스캔본일 가능성이 높으므로 OCR 수행
  const pdfConvert = await import('pdf-img-convert');
  const images = await pdfConvert.default(pdfPath, { scale: 2 });
  let fullText = "";

  for (let i = 0; i < images.length; i++) {
    const imageBuffer = images[i];
    const tempFileName = `temp_page_${i}.png`;
    fs.writeFileSync(tempFileName, imageBuffer);

    const config = {
      lang: 'eng', // 필요 언어
      oem: 1,
      psm: 3
    };
    const text = await tesseract.recognize(tempFileName, config);

    fullText += text + "\n";
    fs.unlinkSync(tempFileName);
  }
  */
  const fullText = "";
  return fullText;
}

// txt로 저장
async function convertPdfAndSave(pdfPath, outputDir) {
  const outputFolder = outputDir || process.cwd();
  const baseName = path.parse(pdfPath).name;
  const txtPath = path.join(outputFolder, `${baseName}.txt`);

  const finalText = await pdfToTextOrOcr(pdfPath);
  fs.writeFileSync(txtPath, finalText, 'utf8');
  return txtPath;
}

export { convertPdfAndSave };