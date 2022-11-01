"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockPlugin = void 0;
const electron_1 = require("electron");
const axios_1 = __importDefault(require("axios"));
const test_window_1 = require("../windows/test-window");
class StockPlugin {
    constructor(tray) {
        this.timer = null;
        this.win = test_window_1.createTestWindow();
        this.initTray(tray);
    }
    initTray(tray) {
        // this.updateStock(tray);
        tray["extraMenus"] = [
            new electron_1.MenuItem({ label: '开始股票', type: 'normal', click: () => this.updateStock(tray) }),
            new electron_1.MenuItem({ label: '关闭股票', type: 'normal', click: () => {
                    clearInterval(this.timer);
                    tray.setTitle("");
                } }),
        ];
    }
    updateStock(tray) {
        this.win.show();
        let config = { sign: '1', signTime: '2' };
        electron_1.ipcMain.once("updateStock", (event, args) => {
            config = args;
            fn();
            this.win.hide();
            this.timer = setInterval(fn, 1500);
        });
        const fn = async () => {
            const res = await axios_1.default.get("https://app-api.yangjibao.com/index_data", {
                headers: {
                    "Request-Sign": config.sign,
                    "Request-Time": config.signTime,
                    "User-Agent": "YJB/1.3.2 (com.xiaoduotou.yjb; build:146; iOS 15.0.2) Alamofire/5.5.0 iPhone11,8",
                    "Authorization": "ios:977f41bf-b895-4e46-bbc8-99914fb97d0f",
                }
            });
            const [shangzhen] = res.data.data;
            const ansiColor = +shangzhen.dir > 0 ? '31' : '32';
            tray.setTitle(`\u001b[${ansiColor}m ${shangzhen.name}:  ${shangzhen.dir > 0 ? '+' : ''}${shangzhen.dir}%\u001b[${ansiColor}m`);
        };
    }
}
exports.StockPlugin = StockPlugin;
