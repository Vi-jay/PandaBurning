"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUpdateHandler = void 0;
const electron_updater_1 = require("electron-updater");
const properties_1 = require("../config/properties");
const electron_1 = require("electron");
function initUpdateHandler(plugins) {
    const message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    electron_updater_1.autoUpdater.setFeedURL(properties_1.UPLOAD_URL);
    electron_updater_1.autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error);
    });
    electron_updater_1.autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking);
    });
    electron_updater_1.autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva);
    });
    electron_updater_1.autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva);
    });
    // 更新下载进度事件
    electron_updater_1.autoUpdater.on('download-progress', function (progressObj) {
        electron_1.BrowserWindow.getAllWindows()[0].webContents.send('downloadProgress', progressObj);
    });
    electron_updater_1.autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        // ipcMain.on('isUpdateNow', (e, arg) => {
        electron_1.BrowserWindow.getAllWindows()[0].webContents.send('message', "开始安装");
        plugins.tomatoPlugin.closeTomatoWindow();
        //some code here to handle event`
        electron_updater_1.autoUpdater.quitAndInstall();
        // })
    });
    electron_1.ipcMain.on("checkForUpdate", () => {
        //执行自动更新检查
        electron_updater_1.autoUpdater.checkForUpdates();
    });
}
exports.initUpdateHandler = initUpdateHandler;
// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    // console.log(text);
    electron_1.BrowserWindow.getAllWindows()[0].webContents.send('message', text);
}
