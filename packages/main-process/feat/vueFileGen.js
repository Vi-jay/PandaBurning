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
exports.VueFileGen = void 0;
const plist = require('plist');
const electron_1 = require("electron");
const robot = __importStar(require("robotjs"));
class VueFileGen {
    constructor() {
        electron_1.globalShortcut.register('CommandOrControl+3', () => {
            robot.keyTap('c', 'command');
            setTimeout(() => {
                console.log(plist.parse(electron_1.clipboard.read('NSFilenamesPboardType'))[0]);
                //    TODO
                // 获取选中文件路径，直接弹出表单，按不同需求自动生成组件，例如弹窗，小模块等等
                // Electron获取复制文件的绝对路径，然后根据文件名在指定目录创建文件，并导入到当前文件
                // 表单需要的字段 组件路径：（输入一次后 下次保存默认）  类型：默认/弹窗/其他...   文件名称：  模块名：默认生成大写的文件名
                // 组件路径失去焦点时校验是否存在该目录 显示提示信息 如果不存在会递归创建目录
                // 根据文件名导入到当前文件中
            }, 300);
        });
    }
}
exports.VueFileGen = VueFileGen;
