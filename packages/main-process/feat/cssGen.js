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
const { parse } = require("html5parser");
const electron_1 = require("electron");
const robot = __importStar(require("robotjs"));
function getUsefulChildNodes(node) {
    if (!Array.isArray(node.body))
        return [];
    return node.body.filter(({ type }) => type === 'Tag');
}
function getNodeClass(node) {
    if (!node.attributes)
        return;
    const target = node.attributes.find(({ name }) => name.value === 'class');
    if (!target)
        return;
    return target.value.value;
}
function getAllChildChildren(node) {
    const children = getUsefulChildNodes(node);
    return children.reduce((acc, cur) => {
        return acc.concat(getUsefulChildNodes(cur).length ? [cur, ...getAllChildChildren(cur)] : cur);
    }, []);
}
function flat(arr = [], depth = Infinity) {
    if (depth <= 0)
        return arr;
    return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) && depth > 1 ? flat(cur, depth - 1) : cur), []);
}
/***
 * 把每个父节点和其子节点所有class提取出来 放到一起
 * 然后遍历子节点 是否有__
 * 如果有
 *      并且 前半段与父节点一致 则 拼接&__放入父节点下
 *      否则 找到与前半段一致的类名 拼接&__放入该类名下
 * 如果没有 则[该class]（用于方便其子类追加）直接放入父节点下
 * 最后将length为1的class抹平
 * 递归拼接
 */
function cssGenPlugins(html) {
    let node = parse(html);
    ([node] = getUsefulChildNodes({ body: node }));
    const hasClass = getNodeClass(node);
    const usefulTags = getUsefulChildNodes(hasClass ? { body: [node] } : node);
    return usefulTags.reduce((acc, node) => {
        const parentClass = getNodeClass(node);
        let childrenClasses = [...new Set(flat(getAllChildChildren(node)).map(getNodeClass).filter(Boolean))];
        if (!parentClass)
            return acc;
        if (!childrenClasses.length)
            return acc + `.${parentClass}{\n`;
        childrenClasses = childrenClasses.map((clazz) => clazz.includes("__") ? clazz : [clazz]);
        const childrenParent = [[parentClass], ...childrenClasses.filter(Array.isArray)];
        childrenClasses = childrenParent.map(([parentName]) => {
            const targets = childrenClasses.filter((item) => {
                if (Array.isArray(item))
                    return false;
                return item.includes(parentName);
            });
            return [parentName, ...targets];
        }).filter(Boolean);
        let [firstClasses, ...restClasses] = childrenClasses;
        firstClasses = flat(firstClasses.concat(restClasses.filter((x) => x.length === 1)));
        restClasses = restClasses.filter((x) => x.length > 1);
        const combineLogic = (acc, item, idx) => {
            let [scopeName, clazzName] = item.split("__");
            const hasUnderLine = !!clazzName;
            clazzName = idx ? (clazzName || scopeName) : item;
            return acc + (idx ? (hasUnderLine ? `&__${clazzName}{}\n` : `.${scopeName}{\n}\n`) : `.${item}{\n`);
        };
        const totalClassStr = firstClasses.reduce(combineLogic, '');
        const restClassStr = restClasses.reduce((acc, arr) => acc + arr.reduce(combineLogic, '') + '\n}\n', '');
        const fullStr = totalClassStr + restClassStr + '\n}\n';
        return acc + fullStr;
    }, '');
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
