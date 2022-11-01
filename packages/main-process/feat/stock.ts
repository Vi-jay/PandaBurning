import {app, BrowserWindow, dialog, ipcMain, ipcRenderer, Menu, MenuItem, powerMonitor, shell, Tray} from "electron";
import * as robot from "robotjs";
import {resolve} from "path";
import {IS_DEV, TOMATO__SEC} from "../config/properties";
import {execSync} from "child_process"
import axios from "axios";
import {createTestWindow} from "../windows/test-window";

export class StockPlugin {
    timer: any = null;
    win!: BrowserWindow ;

    constructor(tray) {
        this.win = createTestWindow();
        this.initTray(tray);
    }

    initTray(tray: Tray) {
        // this.updateStock(tray);
        tray["extraMenus"] = [
            new MenuItem({label: '开始股票', type: 'normal',click:()=>this.updateStock(tray)}),
            new MenuItem({label: '关闭股票', type: 'normal',click:()=> {
                    clearInterval(this.timer);
                    tray.setTitle("");
                }}),
        ];
    }

    updateStock(tray: Tray) {
        this.win.show();
        let config = {sign: '1', signTime: '2'};
        ipcMain.once("updateStock",  (event, args) =>{
            config= args;
            fn();
            this.win.hide();
            this.timer = setInterval(fn, 1500)
        })
        const fn = async () => {
            const res = await axios.get("https://app-api.yangjibao.com/index_data", {
                headers: {
                    "Request-Sign":config.sign,
                    "Request-Time":config.signTime,
                    "User-Agent": "YJB/1.3.2 (com.xiaoduotou.yjb; build:146; iOS 15.0.2) Alamofire/5.5.0 iPhone11,8",
                    "Authorization": "ios:977f41bf-b895-4e46-bbc8-99914fb97d0f",
                }
            });
            const [shangzhen] = res.data.data;
            const ansiColor = +shangzhen.dir>0?'31':'32';
            tray.setTitle(`\u001b[${ansiColor}m ${shangzhen.name}:  ${shangzhen.dir>0?'+':''}${shangzhen.dir}%\u001b[${ansiColor}m`);
        };


    }
}
