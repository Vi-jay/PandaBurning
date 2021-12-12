import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";

ipcMain.on('open-error-dialog', (event) => {
  dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
})
