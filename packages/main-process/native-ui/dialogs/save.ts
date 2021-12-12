import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";

// ipcMain.on('save-dialog', (event) => {
//   const options = {
//     title: 'Save an Image',
//     filters: [
//       { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
//     ]
//   }
//   dialog.showSaveDialog(options, (filename) => {
//     event.sender.send('saved-file', filename)
//   })
// })
