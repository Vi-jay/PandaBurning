"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require('path');
electron_1.ipcMain.on('ondragstart', (event, filepath) => {
    const iconName = 'codeIcon.png';
    event.sender.startDrag({
        file: filepath,
        icon: path.join(__dirname, iconName)
    });
});
