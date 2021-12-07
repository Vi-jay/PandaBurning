"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const robot = __importStar(require("robotjs"));
const tomato_1 = require("./scripts/tomato");
const pathUtils_1 = __importDefault(require("../pathUtils"));
const { resolve } = require('path');
function createWindow() {
    const win = new electron_1.BrowserWindow({
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
        });
    }
    else {
        win.loadFile(resolve(__dirname, '../render-build/index.html')).then(() => {
        });
    }
}
let tray;
let tomatoPlugin;
electron_1.app.whenReady().then(() => {
    // createWindow();
    tray = new electron_1.Tray(pathUtils_1.default.resolvePath("icons/a.png"));
    tomatoPlugin = new tomato_1.TomatoPlugin(tray);
    const contextMenu = electron_1.Menu.buildFromTemplate([
        { label: '开始番茄', type: 'normal', click: () => tomatoPlugin.startLockTimer() },
        { label: '退出', type: 'normal', click: () => electron_1.app.quit() }
    ]);
    tray.setContextMenu(contextMenu);
    electron_1.globalShortcut.register('CommandOrControl+B', () => {
        robot.keyTap('c', process.platform === "darwin" ? 'command' : "control");
    });
    // 单独唤醒时创建window
    // app.on('activate', () => {
    //     if (BrowserWindow.getAllWindows().length === 0) {
    //         createWindow();
    //     }
    // })
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
