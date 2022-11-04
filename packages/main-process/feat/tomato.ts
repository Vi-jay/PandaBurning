import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  ipcRenderer,
  Menu,
  powerMonitor,
  shell,
  Tray,
} from 'electron';
import * as robot from 'robotjs';
import { resolve } from 'path';
import { IS_DEV, TOMATO__SEC } from '../config/properties';
import { execSync } from 'child_process';
import { createTomatoWindow } from '../windows/create-tomato-window';

export class TomatoPlugin {
  tray!: Tray;
  resetTimer: any = null;
  intervalTimer: any = null;
  leftSec: number = TOMATO__SEC;
  tomatoWin: BrowserWindow;

  constructor(tray) {
    this.tray = tray;
    this.initTray(tray);
    this.setupTomatoWindow();
    powerMonitor.on('unlock-screen', () => this.startLockTimer());
  }

  closeTomatoWindow() {
    const tomatoWin = this.tomatoWin;
    this.tomatoWin = null;
    tomatoWin && tomatoWin.close();
  }

  setupTomatoWindow(position: { x: number; y: number } = { x: 0, y: 0 }): void {
    if (this.tomatoWin) {
      this.tomatoWin.restore();
      return this.tomatoWin.show();
    }
    this.tomatoWin = createTomatoWindow(position);
  }

  initTray(tray: Tray) {
    let eventBoundPosition;
    const resetTomato = (...args) => {
      this.startLockTimer();
      this.setupTomatoWindow(eventBoundPosition);
    };
    const contextMenu = Menu.buildFromTemplate([
      { label: '开始番茄', type: 'normal', click: resetTomato },
      { label: '重置番茄', type: 'normal', click: resetTomato },
      {
        label: '退出',
        type: 'normal',
        click: () => {
          this.closeTomatoWindow();
          app.quit();
        },
      },
    ]);
    //注入stock的菜单 todo 需要优雅调整
    setTimeout(
      () => tray['extraMenus'].forEach((item) => contextMenu.append(item)),
      1000,
    );
    tray.on('click', (e, bound) => {
      eventBoundPosition = bound;
      tray.setContextMenu(null); //单击时只显示窗口 不显示菜单
      this.setupTomatoWindow(bound);
    });
    tray.on('right-click', (e, bound) => {
      eventBoundPosition = bound;
      tray.popUpContextMenu(contextMenu);
    });
  }

  startLockTimer() {
    const tomatoWin = this.tomatoWin;
    clearTimeout(this.resetTimer);
    clearInterval(this.intervalTimer);
    tomatoWin.webContents.send('tomato', 'stop');
    let curSec = 0;
    this.resetTimer = setTimeout(() => {
      clearInterval(this.intervalTimer);
      //lock computer
      if (process.platform === 'darwin') {
        robot.keyTap('q', ['command', 'control']);
      } else {
        //睡眠 rundll32.exe powrprof.dll,SetSuspendState 0,1,0
        execSync('rundll32.exe user32.dll, LockWorkStation');
      }
      setTimeout(() => robot.keyTap('escape'), 500);
    }, 1000 * TOMATO__SEC);
    this.intervalTimer = setInterval(
      () => (this.leftSec = TOMATO__SEC - curSec++),
      1000,
    );
    tomatoWin.webContents.send('tomato', 'start', TOMATO__SEC);
  }
}
