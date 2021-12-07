import PathUtils from "../pathUtils";

import {app, BrowserWindow, globalShortcut, clipboard, Tray, Menu} from "electron";
import * as robot from "robotjs";
import * as path from "path";
import {TomatoPlugin} from "./scripts/tomato";

const {resolve} = require('path');
function createWindow(): void {
    const win = new BrowserWindow({
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
        win.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => {
            win.webContents.openDevTools();
        })
    } else {
        win.loadFile(resolve(__dirname, '../render-build/index.html')).then(() => {
        });
    }
}
let tray;
let tomatoPlugin;
app.whenReady().then(() => {
    // createWindow();
    tray = new Tray(PathUtils.resolvePath( "icons/icon.png"));
    tomatoPlugin = new TomatoPlugin(tray);
    const contextMenu = Menu.buildFromTemplate([
        {label: '开始番茄', type: 'normal', click: ()=>tomatoPlugin.startLockTimer()},
        {label: '退出', type: 'normal', click: () => app.quit()}
    ]);
    tray.setContextMenu(contextMenu);
    globalShortcut.register('CommandOrControl+B', () => {
        robot.keyTap('c', 'command');
    });
    // 单独唤醒时创建window
    // app.on('activate', () => {
    //     if (BrowserWindow.getAllWindows().length === 0) {
    //         createWindow();
    //     }
    // })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});