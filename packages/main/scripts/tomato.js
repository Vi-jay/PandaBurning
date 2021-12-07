"use strict";
exports.__esModule = true;
exports.TomatoPlugin = void 0;
var electron_1 = require("electron");
var robot = require("robotjs");
function showMsgBox(msg) {
    electron_1.dialog.showMessageBoxSync({ message: msg });
}
var TomatoPlugin = /** @class */ (function () {
    function TomatoPlugin(tray) {
        var _this = this;
        this.timer = null;
        this.intervalTimer = null;
        this.tray = tray;
        electron_1.powerMonitor.on("unlock-screen", function () {
            _this.startLockTimer();
        });
    }
    TomatoPlugin.prototype.startLockTimer = function () {
        var _this = this;
        clearTimeout(this.timer);
        clearInterval(this.intervalTimer);
        showMsgBox("开始一个新番茄");
        var TOTAL_SEC = 2500;
        var curSec = 0;
        this.timer = setTimeout(function () {
            robot.keyTap('q', ['command', "control"]);
            clearInterval(_this.intervalTimer);
            setTimeout(function () {
                robot.keyTap('escape');
            }, 500);
        }, 1000 * TOTAL_SEC);
        this.intervalTimer = setInterval(function () {
            var leftSec = TOTAL_SEC - curSec++;
            var contextMenu = electron_1.Menu.buildFromTemplate([
                { label: "\u5269\u4F59:" + leftSec + "\u79D2", type: 'normal' },
                { label: '退出', type: 'normal', click: function () { return electron_1.app.quit(); } }
            ]);
            _this.tray.setContextMenu(contextMenu);
        }, 1000);
    };
    return TomatoPlugin;
}());
exports.TomatoPlugin = TomatoPlugin;
