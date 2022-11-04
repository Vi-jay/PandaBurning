"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const electron_1 = require("electron");
let appIcon = null;
electron_1.ipcMain.on('put-in-tray', (event) => {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, iconName);
    appIcon = new electron_1.Tray(iconPath);
    const contextMenu = electron_1.Menu.buildFromTemplate([{
            label: 'Remove',
            click: () => {
                event.sender.send('tray-removed');
            }
        }]);
    appIcon.setToolTip('Electron Demo in the tray.');
    appIcon.setContextMenu(contextMenu);
});
electron_1.ipcMain.on('remove-tray', () => {
    appIcon.destroy();
});
electron_1.app.on('window-all-closed', () => {
    if (appIcon)
        appIcon.destroy();
});
