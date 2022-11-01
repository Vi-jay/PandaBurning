import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";
import {TomatoPlugin} from "./feat/tomato";
import PathUtils from "./utils/pathUtils";
import {initUpdateHandler} from "./system/update";
import {IS_DEV} from "./config/properties";
import {CssGen} from "./feat/cssGen";
import {Json2ts} from "./feat/json2ts";
import {VueFileGen} from "./feat/vueFileGen";
import {StockPlugin} from "./feat/stock";


//全局引用防止对象被回收
const plugins: Record<string, any> = {};
let tray = null as Tray;

function initPlugins() {
    tray = new Tray(PathUtils.resolvePath("icon.png"));
    plugins.tomatoPlugin = new TomatoPlugin(tray);
    plugins.stockPlugin = new StockPlugin(tray);
    plugins.cssGenPlugin = new CssGen();
    plugins.json2tsPlugin = new Json2ts();
    // plugins.vueFileGenPlugin = new VueFileGen();
}

app.whenReady().then(() => {
    // initUpdateHandler(plugins);
    initPlugins();
})
app.on('will-quit', function () {
    globalShortcut.unregisterAll();
});
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// });
