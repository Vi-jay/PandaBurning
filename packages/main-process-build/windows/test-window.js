"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestWindow = void 0;
const path_1 = require("path");
const electron_1 = require("electron");
function createTestWindow() {
    const curWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 700,
        titleBarStyle: "hidden",
        center: true,
        show: true,
        frame: false,
        useContentSize: true,
        vibrancy: 'hud',
        autoHideMenuBar: process.env.MODE !== 'development',
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            nativeWindowOpen: false
        }
    });
    curWindow.setSkipTaskbar(true);
    curWindow.setWindowButtonVisibility && curWindow.setWindowButtonVisibility(false);
    //禁止关闭窗口 关闭时自动隐藏 始终保持只有一个番茄窗口
    curWindow.on('close', event => {
        curWindow.isVisible() && event.preventDefault();
        // curWindow.hide();
    });
    const nav2Page = () => curWindow.webContents.send("router", "test");
    if (process.env.NODE_ENV === 'development') {
        // @ts-ignore
        curWindow.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => {
            curWindow.webContents.openDevTools();
            nav2Page();
        });
    }
    else {
        if (process.platform === "darwin")
            electron_1.app.dock.hide();
        curWindow.loadFile(path_1.resolve(__dirname, '../../render-build/index.html')).then(() => {
            nav2Page();
        });
    }
}
exports.createTestWindow = createTestWindow;
