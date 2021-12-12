import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";
import {TomatoPlugin} from "./scripts/tomato";
import PathUtils from "./pathUtils";
import {IS_DEV, UPLOAD_URL} from "./config";
import {autoUpdater} from "electron-updater"

function updateHandle() {
    let message = {
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
        ipcMain.on('isUpdateNow', (e, arg) => {
            console.log(arguments);
            console.log("开始更新");
            //some code here to handle event
            autoUpdater.quitAndInstall();
        })
        // mainWindow.webContents.send('isUpdateNow')
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

//全局引用防止对象被回收
const plugins: Record<string, any> = {};
let tray = null as Tray;

function initPlugins() {
    tray = new Tray(PathUtils.resolvePath("icon.png"));
    plugins.tomatoPlugin = new TomatoPlugin(tray);
    // plugins.translatePlugin = new TranslatePlugin();
}

app.whenReady().then(() => {
    updateHandle();
    IS_DEV || dialog.showMessageBoxSync({message: "Control+E:将选中文字替换成英文。Control+W:将选中文字翻译成中文。Control+T:将英文词法润色（转换比较慢，作用不大）。右键右下角番茄图标开启番茄时钟，40分钟后自动锁屏，再次解锁屏幕时开启下一次倒计时。左键点击番茄图标显示倒计时，ESC键退出窗口"});
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
