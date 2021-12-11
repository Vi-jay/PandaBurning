import {app, BrowserWindow, globalShortcut, clipboard, Tray, Menu} from "electron";
import {TomatoPlugin} from "./scripts/tomato";
import PathUtils from "./pathUtils";
import {TranslatePlugin} from "./scripts/translate";
//全局引用防止对象被回收
const plugins: Record<string, any> = {};
let tray = null as Tray;
function initPlugins() {
    tray = new Tray(PathUtils.resolvePath("icon.png"));
    plugins.tomatoPlugin = new TomatoPlugin(tray);
    plugins.translatePlugin = new TranslatePlugin();
}
app.whenReady().then(() => {
    initPlugins();
})
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// });
