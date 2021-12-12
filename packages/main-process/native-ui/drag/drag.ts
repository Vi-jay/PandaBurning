import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";
const path = require('path')

ipcMain.on('ondragstart', (event, filepath) => {
  const iconName = 'codeIcon.png'
  event.sender.startDrag({
    file: filepath,
    icon: path.join(__dirname, iconName)
  })
})
