const plist = require('plist');
import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";
import * as robot from "robotjs";

export class VueFileGen {
    constructor() {
        globalShortcut.register('CommandOrControl+3', () => {
            robot.keyTap('c', 'command');
            setTimeout(() => {
                console.log(plist.parse(clipboard.read('NSFilenamesPboardType'))[0]);
                //    TODO
                // 获取选中文件路径，直接弹出表单，按不同需求自动生成组件，例如弹窗，小模块等等
                // Electron获取复制文件的绝对路径，然后根据文件名在指定目录创建文件，并导入到当前文件
                // 表单需要的字段 组件路径：（输入一次后 下次保存默认）  类型：默认/弹窗/其他...   文件名称：  模块名：默认生成大写的文件名
                // 组件路径失去焦点时校验是否存在该目录 显示提示信息 如果不存在会递归创建目录
                // 根据文件名导入到当前文件中
            }, 300)
        });
    }
}