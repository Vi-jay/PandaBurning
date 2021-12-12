"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.ipcMain.on('open-information-dialog', (event) => {
    const options = {
        type: 'info',
        title: 'Information',
        message: "This is an information dialog. Isn't it nice?",
        buttons: ['Yes', 'No']
    };
    // dialog.showMessageBox(options as any, (index) => {
    //   event.sender.send('information-dialog-selection', index)
    // })
});
