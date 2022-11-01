"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const tomato_1 = require("./feat/tomato");
const pathUtils_1 = __importDefault(require("./utils/pathUtils"));
const cssGen_1 = require("./feat/cssGen");
const json2ts_1 = require("./feat/json2ts");
const stock_1 = require("./feat/stock");
//全局引用防止对象被回收
const plugins = {};
let tray = null;
function initPlugins() {
    tray = new electron_1.Tray(pathUtils_1.default.resolvePath("icon.png"));
    plugins.tomatoPlugin = new tomato_1.TomatoPlugin(tray);
    plugins.stockPlugin = new stock_1.StockPlugin(tray);
    plugins.cssGenPlugin = new cssGen_1.CssGen();
    plugins.json2tsPlugin = new json2ts_1.Json2ts();
    // plugins.vueFileGenPlugin = new VueFileGen();
}
electron_1.app.whenReady().then(() => {
    // initUpdateHandler(plugins);
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
