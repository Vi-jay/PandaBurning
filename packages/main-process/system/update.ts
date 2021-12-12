import {autoUpdater} from "electron-updater";
import {UPLOAD_URL} from "../config/properties";
import {BrowserWindow, ipcMain} from "electron"

export function initUpdateHandler(plugins) {
    const message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    autoUpdater.setFeedURL(UPLOAD_URL);
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });
    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        BrowserWindow.getAllWindows()[0].webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        // ipcMain.on('isUpdateNow', (e, arg) => {
        BrowserWindow.getAllWindows()[0].webContents.send('message', "开始安装");
        plugins.tomatoPlugin.closeTomatoWindow();
        //some code here to handle event`
        autoUpdater.quitAndInstall();
        // })
    });
    ipcMain.on("checkForUpdate", () => {
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    // console.log(text);
    BrowserWindow.getAllWindows()[0].webContents.send('message', text)
}
