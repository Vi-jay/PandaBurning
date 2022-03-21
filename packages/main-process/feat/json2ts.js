"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Json2ts = void 0;
const json2ts = require("json2ts");
const electron_1 = require("electron");
const robot = __importStar(require("robotjs"));
class Json2ts {
    constructor() {
        electron_1.globalShortcut.register('CommandOrControl+2', () => {
            robot.keyTap('c', 'command');
            setTimeout(() => {
                const jsonStr = json2ts.convert(electron_1.clipboard.readText());
                electron_1.clipboard.write({ text: jsonStr });
            }, 300);
        });
    }
}
exports.Json2ts = Json2ts;
