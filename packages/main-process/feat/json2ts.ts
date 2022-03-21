const json2ts = require("json2ts");
import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";
import * as robot from "robotjs";


export class Json2ts {
    constructor() {
        globalShortcut.register('CommandOrControl+2', () => {
            robot.keyTap('c', 'command');
            setTimeout(() => {
                const jsonStr = json2ts.convert(clipboard.readText());
                clipboard.write({text: jsonStr});
            }, 300)
        });
    }
}