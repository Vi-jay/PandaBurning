"use strict";
exports.__esModule = true;
var path = require("path");
var PathUtils = /** @class */ (function () {
    function PathUtils() {
    }
    // 将startPath作为标准路径，静态资源的路径和项目中使用到的路径全部由startPath起始
    PathUtils.startPath = path.join(__dirname, '..');
    PathUtils.resolvePath = function (dirPath) {
        return path.join(PathUtils.startPath, dirPath || '.');
    };
    return PathUtils;
}());
exports["default"] = PathUtils;
