/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// renderer.js
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const convertBtn = document.getElementById('convertBtn');
const statusDiv = document.getElementById('status');
const outputDirInput = document.getElementById('outputDir');

let selectedPdfPath = null;

// ========== 드래그 앤 드롭 이벤트 ==========
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = 'blue';
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#aaa';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#aaa';

  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    selectedPdfPath = file.path;
    statusDiv.innerText = `Selected PDF: ${selectedPdfPath}`;
  } else {
    statusDiv.innerText = 'Please drop a PDF file.';
  }
});

// ========== 파일 선택 버튼 ==========
selectBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedPdfPath = file.path;
    statusDiv.innerText = `Selected PDF: ${selectedPdfPath}`;
  } else {
    statusDiv.innerText = 'Please select a PDF file.';
  }
});

// ========== 변환 버튼 ==========
convertBtn.addEventListener('click', async () => {
  if (!selectedPdfPath) {
    statusDiv.innerText = 'No PDF selected.';
    return;
  }

  const outputDir = outputDirInput.value.trim() || null;
  statusDiv.innerText = 'Converting... This may take a while.';

  try {
    // electronAPI는 preload.js에서 contextBridge로 노출한 객체
    const result = await window.electronAPI.convertPdf(selectedPdfPath, outputDir);
    if (result.success) {
      statusDiv.innerText = `Conversion complete! Saved at: ${result.savedTxtPath}`;
    } else {
      statusDiv.innerText = `Error: ${result.error}`;
    }
  } catch (err) {
    console.error(err);
    statusDiv.innerText = 'An error occurred during conversion.';
  }
});