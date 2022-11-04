import { resolve } from 'path';
import {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  dialog,
  Tray,
  Menu,
  ipcMain,
  remote,
} from 'electron';
import { IS_DEV } from '../config/properties';

export function createTomatoWindow(
  position: { x: number; y: number } = { x: 0, y: 0 },
) {
  let tomatoWin = this.tomatoWin;
  if (tomatoWin) {
    tomatoWin.restore();
    return tomatoWin.show();
  }
  const windowSize = {
    width: IS_DEV ? 1000 : 160,
    height: IS_DEV ? 500 : 220,
  };
  this.tomatoWin = tomatoWin = new BrowserWindow({
    titleBarStyle: 'hidden',
    center: true,
    show: false,
    frame: false,
    ...windowSize,
    vibrancy: 'hud', // 'light', 'medium-light' etc
    useContentSize: true,
    autoHideMenuBar: process.env.MODE !== 'development',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nativeWindowOpen: false,
    },
  });
  tomatoWin.setSkipTaskbar(true);
  tomatoWin.setWindowButtonVisibility &&
    tomatoWin.setWindowButtonVisibility(false);
  //禁止关闭窗口 关闭时自动隐藏 始终保持只有一个番茄窗口
  tomatoWin.on('close', (event) => {
    // if (!this.tomatoWin) return;
    tomatoWin.isVisible() && event.preventDefault();
    tomatoWin.hide();
  });
  if (process.env.NODE_ENV === 'development') {
    //开发阶段允许热更新时重启客户端 command+q的情况 允许关闭窗口 因为这里是开发阶段 如果一直不关闭窗口 无法进行更新
    app.on('before-quit', () => {
      this.tray.destroy();
      this.closeTomatoWindow();
    });
    // @ts-ignore
    tomatoWin.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => {
      tomatoWin.webContents.openDevTools();
    });
  } else {
    if (process.platform === 'darwin') app.dock.hide();
    tomatoWin
      .loadFile(resolve(__dirname, '../../render-build/index.html'))
      .then(() => 1);
  }
  return tomatoWin;
}
