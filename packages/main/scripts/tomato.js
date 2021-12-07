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
function showMsgBox(msg) {
    electron_1.dialog.showMessageBoxSync({ message: msg });
}
class TomatoPlugin {
    constructor(tray) {
        this.timer = null;
        this.intervalTimer = null;
        this.tray = tray;
        electron_1.powerMonitor.on("unlock-screen", () => {
            this.startLockTimer();
        });
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
            }, 500);
        }, 1000 * TOTAL_SEC);
        this.intervalTimer = setInterval(() => {
            const leftSec = TOTAL_SEC - curSec++;
            const contextMenu = electron_1.Menu.buildFromTemplate([
                { label: `剩余:${leftSec}秒`, type: 'normal' },
                { label: '退出', type: 'normal', click: () => electron_1.app.quit() }
            ]);
            this.tray.setContextMenu(contextMenu);
        }, 1000);
    }
}
exports.TomatoPlugin = TomatoPlugin;
