"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var robot = require("robotjs");
var tomato_1 = require("./scripts/tomato");
var pathUtils_1 = require("../pathUtils");
var resolve = require('path').resolve;
function createWindow() {
    var win = new electron_1.BrowserWindow({
        center: true,
        width: 1366,
        height: 800,
        minHeight: 768,
        minWidth: 1366,
        useContentSize: true,
        // autoHideMenuBar: process.env.MODE !== 'development',
        webPreferences: {
            preload: resolve(__dirname, '../preload/index.ts'),
            // devTools: process.env.MODE === 'development',
            webSecurity: true,
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            nativeWindowOpen: false
        }
    });
    win.setAspectRatio(1366 / 800);
    if (process.env.NODE_ENV === 'development') {
        // @ts-ignore
        win.loadURL(process.env.VITE_DEV_SERVER_URL).then(function () {
            win.webContents.openDevTools();
        });
    }
    else {
        win.loadFile(resolve(__dirname, '../render-build/index.html')).then(function () {
        });
    }
}
var tray;
var tomatoPlugin;
electron_1.app.whenReady().then(function () {
    // createWindow();
    tray = new electron_1.Tray(pathUtils_1["default"].resolvePath("icons/icon.png"));
    tomatoPlugin = new tomato_1.TomatoPlugin(tray);
    var contextMenu = electron_1.Menu.buildFromTemplate([
        { label: '开始番茄', type: 'normal', click: function () { return tomatoPlugin.startLockTimer(); } },
        { label: '退出', type: 'normal', click: function () { return electron_1.app.quit(); } }
    ]);
    tray.setContextMenu(contextMenu);
    electron_1.globalShortcut.register('CommandOrControl+B', function () {
        robot.keyTap('c', process.platform === "darwin" ? 'command' : "control");
    });
    // 单独唤醒时创建window
    // app.on('activate', () => {
    //     if (BrowserWindow.getAllWindows().length === 0) {
    //         createWindow();
    //     }
    // })
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
