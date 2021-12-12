"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const update_1 = require("./system/update");
const properties_1 = require("./config/properties");
const test_window_1 = require("./windows/test-window");
//全局引用防止对象被回收
const plugins = {};
let tray = null;
function initPlugins() {
    // tray = new Tray(PathUtils.resolvePath("icon.png"));
    // plugins.tomatoPlugin = new TomatoPlugin(tray);
    test_window_1.createTestWindow();
    // plugins.translatePlugin = new TranslatePlugin();
}
electron_1.app.whenReady().then(() => {
    update_1.initUpdateHandler(plugins);
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
