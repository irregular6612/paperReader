/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

// preload.js
const { contextBridge, ipcRenderer } = require('electron')
// Renderer 프로세스에 노출할 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  convertPdf: (pdfPath, outputDir) => 
    ipcRenderer.invoke('convert-pdf', { pdfPath, outputDir }),
  selectDirectory: () => 
    ipcRenderer.invoke('select-directory')
})