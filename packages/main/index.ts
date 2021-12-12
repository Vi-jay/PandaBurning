import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu} from "electron";
import {TomatoPlugin} from "./scripts/tomato";
import PathUtils from "./pathUtils";
import {IS_DEV} from "./config";
import path from "path";
//全局引用防止对象被回收
const plugins: Record<string, any> = {};
let tray = null as Tray;
function initPlugins() {
    tray = new Tray(PathUtils.resolvePath("icon.png"));
    plugins.tomatoPlugin = new TomatoPlugin(tray);
    // plugins.translatePlugin = new TranslatePlugin();
}
app.whenReady().then(() => {
    IS_DEV || dialog.showMessageBoxSync({message: "Control+E:将选中文字替换成英文。Control+W:将选中文字翻译成中文。Control+T:将英文词法润色（转换比较慢，作用不大）。右键右下角番茄图标开启番茄时钟，40分钟后自动锁屏，再次解锁屏幕时开启下一次倒计时。左键点击番茄图标显示倒计时，ESC键退出窗口"});
    console.log(123);
    initPlugins();
})
app.on('will-quit', function () {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
});
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// });
