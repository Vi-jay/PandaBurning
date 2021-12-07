import {app, dialog, Menu, powerMonitor, Tray} from "electron";
import * as robot from "robotjs";

function showMsgBox(msg) {
    dialog.showMessageBoxSync({message: msg});
}

export class TomatoPlugin {
    timer: any = null;
    intervalTimer: any = null;
    tray!: Tray;
    constructor(tray) {
        this.tray = tray;
        powerMonitor.on("unlock-screen", () => {
            this.startLockTimer();
        })
    }
    startLockTimer() {
        clearTimeout(this.timer);
        clearInterval(this.intervalTimer);
        showMsgBox("开始一个新番茄");
        const TOTAL_SEC = 2500;
        let curSec = 0;
        this.timer = setTimeout(() => {
            robot.keyTap('q', ['command', "control"]);
            clearInterval(this.intervalTimer);
            setTimeout(() => {
                robot.keyTap('escape');
            }, 500)
        }, 1000 * TOTAL_SEC);
        this.intervalTimer = setInterval(() => {
            const leftSec = TOTAL_SEC - curSec++;
            const contextMenu = Menu.buildFromTemplate([
                {label: `剩余:${leftSec}秒`, type: 'normal'},
                {label: '退出', type: 'normal', click: () => app.quit()}
            ]);
            this.tray.setContextMenu(contextMenu)
        }, 1000)
    }
}
