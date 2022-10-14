const {parse} = require("html5parser");
import {app, BrowserWindow, globalShortcut, clipboard, dialog, Tray, Menu, ipcMain, remote} from "electron";
import * as robot from "robotjs";
import {
    camelCase,
    capitalCase,
    constantCase,
    dotCase,
    headerCase,
    noCase,
    paramCase,
    pascalCase,
    pathCase,
    sentenceCase,
    snakeCase,
} from "change-case";
function getUsefulChildNodes(node) {
    if (!Array.isArray(node.body)) return [];
    return node.body.filter(({type}) => type === 'Tag');
}

function getNodeClass(node) {
    if (!node || !node.attributes) return;
    const target = node.attributes.find(({name}) => name.value === 'className');
    if (!target) return;
    const targetClassName = target.value.value.replace(/\{styles\.(.*)}/, "$1");
    return targetClassName;
    // if (!targetClassName.includes("__"))return paramCase(targetClassName);
    // const [tstart,tend] = targetClassName.split("__");
    // return `${paramCase(tstart)}__${tend}`;
}

function getAllChildChildren(node) {
    const children = getUsefulChildNodes(node);
    return children.reduce((acc, cur) => {
        return acc.concat(getUsefulChildNodes(cur).length ? [cur, ...getAllChildChildren(cur)] : cur);
    }, [])
}

function flat(arr = [], depth = Infinity) {
    if (depth <= 0) return arr;
    return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) && depth > 1 ? flat(cur, depth - 1) : cur), [])
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
    ([node] = getUsefulChildNodes({body: node}));
    const hasClass = getNodeClass(node);
    const usefulTags = getUsefulChildNodes(hasClass ? {body: [node]} : node);
    return usefulTags.reduce((acc, node) => {
        const parentClass = getNodeClass(node);
        let childrenClasses: any[] = [...new Set(flat(getAllChildChildren(node)).map(getNodeClass).filter(Boolean))];
        if (!parentClass) return acc;
        if (!childrenClasses.length) return acc + `.${parentClass}{\n`;
        childrenClasses = childrenClasses.map((clazz) => clazz.includes("__") ? clazz : [clazz]);
        const childrenParent = [[parentClass], ...childrenClasses.filter(Array.isArray)];
        childrenClasses = childrenParent.map(([parentName]) => {
            const targets = childrenClasses.filter((item) => {
                if (Array.isArray(item)) return false;
                return item.includes(parentName)
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
            return acc + (idx ? (hasUnderLine ? `&__${clazzName}{}\n` : `.${scopeName}{\n}\n`) : `.${item}{\n`)
        };
        const totalClassStr = firstClasses.reduce(combineLogic, '')
        const restClassStr = restClasses.reduce((acc, arr) => acc + arr.reduce(combineLogic, '') + '\n}\n', '');
        const fullStr = totalClassStr + restClassStr + '\n}\n';
        return acc + fullStr;
    }, '')
}

export class CssGen {
    constructor() {
        globalShortcut.register('CommandOrControl+1', () => {
            robot.keyTap('c', 'command');
            setTimeout(() => {
                const cssStr = cssGenPlugins(clipboard.readText());
                clipboard.write({text: cssStr});
            }, 300)
        });
    }
}