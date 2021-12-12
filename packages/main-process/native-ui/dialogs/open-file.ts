import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";

// ipcMain.on('open-file-dialog', (event) => {
//   dialog.showOpenDialog({
//     properties: ['openFile', 'openDirectory']
//   }, (files) => {
//     if (files) {
//       event.sender.send('selected-directory', files)
//     }
//   })
// })
