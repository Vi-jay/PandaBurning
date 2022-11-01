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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomatoPlugin = void 0;
const electron_1 = require("electron");
const robot = __importStar(require("robotjs"));
const path_1 = require("path");
const properties_1 = require("../config/properties");
const child_process_1 = require("child_process");
class TomatoPlugin {
    constructor(tray) {
        this.resetTimer = null;
        this.intervalTimer = null;
        this.leftSec = properties_1.TOMATO__SEC;
        this.tray = tray;
        this.initTray(tray);
        this.setupTomatoWindow();
        electron_1.powerMonitor.on("unlock-screen", () => this.startLockTimer());
    }
    closeTomatoWindow() {
        const tomatoWin = this.tomatoWin;
        this.tomatoWin = null;
        tomatoWin && tomatoWin.close();
    }
    setupTomatoWindow(position = { x: 0, y: 0 }) {
        let tomatoWin = this.tomatoWin;
        if (tomatoWin) {
            tomatoWin.restore();
            return tomatoWin.show();
        }
        const windowSize = {
            width: properties_1.IS_DEV ? 1000 : 160,
            height: properties_1.IS_DEV ? 500 : 220
        };
        this.tomatoWin = tomatoWin = new electron_1.BrowserWindow({
            titleBarStyle: "hidden",
            center: true,
            show: false,
            frame: false,
            ...windowSize,
            vibrancy: 'hud',
            useContentSize: true,
            autoHideMenuBar: process.env.MODE !== 'development',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                contextIsolation: false,
                nodeIntegrationInWorker: true,
                nativeWindowOpen: false
            }
        });
        tomatoWin.setSkipTaskbar(true);
        tomatoWin.setWindowButtonVisibility && tomatoWin.setWindowButtonVisibility(false);
        //禁止关闭窗口 关闭时自动隐藏 始终保持只有一个番茄窗口
        tomatoWin.on('close', event => {
            // if (!this.tomatoWin) return;
            tomatoWin.isVisible() && event.preventDefault();
            tomatoWin.hide();
        });
        if (process.env.NODE_ENV === 'development') {
            //开发阶段允许热更新时重启客户端 command+q的情况 允许关闭窗口 因为这里是开发阶段 如果一直不关闭窗口 无法进行更新
            electron_1.app.on("before-quit", () => {
                this.tray.destroy();
                this.closeTomatoWindow();
            });
            // @ts-ignore
            tomatoWin.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => {
                tomatoWin.webContents.openDevTools();
            });
        }
        else {
            if (process.platform === "darwin")
                electron_1.app.dock.hide();
            tomatoWin.loadFile(path_1.resolve(__dirname, '../../render-build/index.html')).then(() => 1);
        }
    }
    initTray(tray) {
        let eventBoundPosition;
        const resetTomato = (...args) => {
            this.startLockTimer();
            this.setupTomatoWindow(eventBoundPosition);
        };
        const contextMenu = electron_1.Menu.buildFromTemplate([
            { label: '开始番茄', type: 'normal', click: resetTomato },
            { label: '重置番茄', type: 'normal', click: resetTomato },
            {
                label: '退出', type: 'normal', click: () => {
                    this.closeTomatoWindow();
                    electron_1.app.quit();
                }
            }
        ]);
        setTimeout(() => tray["extraMenus"].forEach((item) => contextMenu.append(item)), 1000);
        tray.on("click", (e, bound) => {
            eventBoundPosition = bound;
            tray.setContextMenu(null); //单击时只显示窗口 不显示菜单
            this.setupTomatoWindow(bound);
        });
        tray.on("right-click", (e, bound) => {
            eventBoundPosition = bound;
            tray.popUpContextMenu(contextMenu);
        });
    }
    startLockTimer() {
        const tomatoWin = this.tomatoWin;
        clearTimeout(this.resetTimer);
        clearInterval(this.intervalTimer);
        tomatoWin.webContents.send("tomato", "stop");
        let curSec = 0;
        this.resetTimer = setTimeout(() => {
            clearInterval(this.intervalTimer);
            //lock computer
            if (process.platform === "darwin") {
                robot.keyTap('q', ['command', "control"]);
            }
            else {
                //睡眠 rundll32.exe powrprof.dll,SetSuspendState 0,1,0
                child_process_1.execSync("rundll32.exe user32.dll, LockWorkStation");
            }
            setTimeout(() => robot.keyTap('escape'), 500);
        }, 1000 * properties_1.TOMATO__SEC);
        this.intervalTimer = setInterval(() => this.leftSec = properties_1.TOMATO__SEC - curSec++, 1000);
        tomatoWin.webContents.send("tomato", "start", properties_1.TOMATO__SEC);
    }
}
exports.TomatoPlugin = TomatoPlugin;
