import {app, BrowserWindow, dialog, ipcMain, ipcRenderer, Menu, powerMonitor, shell, Tray} from "electron";
import * as robot from "robotjs";
import {resolve} from "path";
import {IS_DEV, TOMATO__SEC} from "../config";
import {execSync} from "child_process"

export class TomatoPlugin {
    tray!: Tray;
    resetTimer: any = null;
    intervalTimer: any = null;
    leftSec: number = TOMATO__SEC;
    tomatoWin: BrowserWindow;
    constructor(tray) {
        this.tray = tray;
        this.initTray(tray);
        this.setupTomatoWindow();
        powerMonitor.on("unlock-screen", () => this.startLockTimer())
    }
    closeTomatoWindow() {
        const tomatoWin = this.tomatoWin;
        this.tomatoWin = null;
        tomatoWin && tomatoWin.close()
    }
    setupTomatoWindow(position: { x: number, y: number } = {x: 0, y: 0}): void {
        let tomatoWin = this.tomatoWin;
        if (tomatoWin) {
            tomatoWin.restore()
            return tomatoWin.show();
        }
        const windowSize = {
            width: IS_DEV ? 1000 : 160,
            height: IS_DEV ? 500 : 220
        };
        this.tomatoWin = tomatoWin = new BrowserWindow({
            titleBarStyle: "hidden",
            center: true,
            show: false,
            frame: false,
            ...windowSize,
            vibrancy: 'hud',  // 'light', 'medium-light' etc
            useContentSize: true,
            autoHideMenuBar: process.env.MODE !== 'development',
            webPreferences: {
                preload: resolve(__dirname, '../../preload/index.ts'),
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
            // IS_DEV || event.preventDefault(); //阻止command+q关闭窗口
            tomatoWin.hide();
        })
        if (process.env.NODE_ENV === 'development') {
            //开发阶段允许热更新时重启客户端 command+q的情况 允许关闭窗口 因为这里是开发阶段 如果一直不关闭窗口 无法进行更新
            app.on("before-quit", () => {
                this.tray.destroy();
                this.closeTomatoWindow();
            });
            // @ts-ignore
            tomatoWin.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => {
                tomatoWin.webContents.openDevTools()
            });
        } else {
            if (process.platform === "darwin") app.dock.hide();
            tomatoWin.loadFile(resolve(__dirname, '../../render-build/index.html')).then(() => 1);
        }
    }
    initTray(tray: Tray) {
        let eventBoundPosition;
        const resetTomato = (...args) => {
            this.startLockTimer();
            this.setupTomatoWindow(eventBoundPosition);
        }
        const contextMenu = Menu.buildFromTemplate([
            {label: '开始番茄', type: 'normal', click: resetTomato},
            {label: '重置番茄', type: 'normal', click: resetTomato},
            {
                label: '退出', type: 'normal', click: () => {
                    this.closeTomatoWindow();
                    app.quit();
                }
            }
        ]);
        tray.on("click", (e, bound) => {
            eventBoundPosition = bound;
            tray.setContextMenu(null);//单击时只显示窗口 不显示菜单
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
                robot.keyTap('q', ['command', "control"])
            } else {
                //睡眠 rundll32.exe powrprof.dll,SetSuspendState 0,1,0
                execSync("rundll32.exe user32.dll, LockWorkStation");
            }
            setTimeout(() => robot.keyTap('escape'), 500);
        }, 1000 * TOMATO__SEC);
        this.intervalTimer = setInterval(() => this.leftSec = TOMATO__SEC - curSec++, 1000);
        tomatoWin.webContents.send("tomato", "start", TOMATO__SEC);
    }
}
