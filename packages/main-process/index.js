"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const tomato_1 = require("./feat/tomato");
const pathUtils_1 = __importDefault(require("./utils/pathUtils"));
const translate_1 = require("./feat/translate");
const properties_1 = require("./config/properties");
//全局引用防止对象被回收
const plugins = {};
let tray = null;
function initPlugins() {
    tray = new electron_1.Tray(pathUtils_1.default.resolvePath("icon.png"));
    plugins.tomatoPlugin = new tomato_1.TomatoPlugin(tray);
    plugins.translatePlugin = new translate_1.TranslatePlugin();
}
electron_1.app.whenReady().then(() => {
    // initUpdateHandler(plugins);
    properties_1.IS_DEV || electron_1.dialog.showMessageBoxSync({ message: "Control+E:将选中文字替换成英文。Control+W:将选中文字翻译成中文。Control+T:将英文词法润色（转换比较慢，作用不大）。右键右下角番茄图标开启番茄时钟，40分钟后自动锁屏，再次解锁屏幕时开启下一次倒计时。左键点击番茄图标显示倒计时，ESC键退出窗口" });
    initPlugins();
});
electron_1.app.on('will-quit', function () {
    electron_1.globalShortcut.unregisterAll();
});
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// });
