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
exports.CssGen = void 0;
const { parse, walk } = require("html5parser");
const electron_1 = require("electron");
const robot = __importStar(require("robotjs"));
function cssGenPlugins(html) {
    const ast = parse(html);
    const parents = [];
    function formatChildClass(clazz) {
        return clazz.replace(/.*__(.*)/g, "&__$1");
    }
    function findArr(arr, child) {
        let target;
        while (!target && arr.length) {
            target = arr.find(({ node, children }) => node.body && node.body.includes(child));
            arr = arr.reduce((acc, { children }) => acc.concat(children), []);
        }
        return { arr: target ? target.children : parents, target };
    }
    const arr = [], classes = [];
    walk(ast, {
        enter: (node) => {
            if (!node.attributes)
                return;
            const classAttr = node.attributes.find(({ name }) => name.value === 'class');
            if (!classAttr)
                return;
            const { arr, target } = findArr(parents, node);
            const className = classAttr.value.value;
            arr.push({
                class: target && className.includes("__") ? className.replace(target.class, '&') : className,
                node,
                children: []
            });
            const childArr = classes[classes.length - 1];
            const lastOneIsArr = Array.isArray(classes[classes.length - 1]);
            const isChild = className.includes("__");
            if (lastOneIsArr && isChild)
                return childArr.push(formatChildClass(className));
            if (isChild)
                return classes.push([formatChildClass(className)]);
            classes.push(className);
        }
    });
    const classTxtArr = [];
    classes.forEach((clazz) => {
        const isChild = Array.isArray(clazz);
        if (!isChild) {
            classTxtArr.push(`.${clazz}{`);
            return classTxtArr.push("}");
        }
        clazz.forEach((childClazz) => classTxtArr.splice(classTxtArr.length - 1, 0, `${childClazz}{}`));
    });
    return classTxtArr.join("\n");
}
class CssGen {
    constructor() {
        electron_1.globalShortcut.register('CommandOrControl+1', () => {
            robot.keyTap('c', 'command');
            setTimeout(() => {
                const cssStr = cssGenPlugins(electron_1.clipboard.readText());
                electron_1.clipboard.write({ text: cssStr });
            }, 300);
        });
    }
}
exports.CssGen = CssGen;
