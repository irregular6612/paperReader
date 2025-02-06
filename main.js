// main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { convertPdfAndSave } from './ocrService.js';

const __dirname = path.resolve();

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      // Renderer에서 Node.js API를 직접 쓰지 않고,
      // preload.js 통해서만 IPC를 사용하게 하는 보안 설정
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

// 모든 창이 닫히면 앱 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Renderer -> Main으로 오는 IPC
ipcMain.handle('convert-pdf', async (event, { pdfPath, outputDir }) => {
  try {
    const savedTxtPath = await convertPdfAndSave(pdfPath, outputDir);
    return { success: true, savedTxtPath };
  } catch (err) {
    return { success: false, error: err.message || String(err) };
  }
});