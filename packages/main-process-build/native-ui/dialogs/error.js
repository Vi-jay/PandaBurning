"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.ipcMain.on('open-error-dialog', (event) => {
    electron_1.dialog.showErrorBox('An Error Message', 'Demonstrating an error message.');
});
