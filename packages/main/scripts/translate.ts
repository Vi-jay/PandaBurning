import {app, BrowserWindow, clipboard, dialog, globalShortcut, ipcRenderer, powerMonitor, screen} from "electron";
import * as robot from "robotjs";
import puppeteer from "puppeteer-extra";
import {Browser, Page} from "puppeteer";
import * as qs from "qs"
import {IS_DEV, TOMATO__SEC} from "../config";
import {resolve} from "path";

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());
/***
 * todo UI select language interface
 * 显示选择内容的翻译 弹窗
 */
let translatePage!: Page;
let reverseTranslatePage!: Page;
let botPage!: Page;
let botUrl!: string;
let browser!: Browser;

export class TranslatePlugin {
    translateWin!: BrowserWindow;
    constructor() {
        this.initPuppeteer();
        this.setupTranslateWindow();
    }
    setupTranslateWindow(): void {
        let translateWin = this.translateWin;
        if (translateWin) {
            const {x, y} = screen.getCursorScreenPoint();
            const offsetX = translateWin.getSize()[0] / 2;
            translateWin.setPosition(x - offsetX, y)
            translateWin.restore()
            return translateWin.show();
        }
        const windowSize = {
            width: 100,
            height: 50
        };
        this.translateWin = translateWin = new BrowserWindow({
            titleBarStyle: "hidden",
            center: true,
            show: false,
            frame: false,
            useContentSize: true,
            ...windowSize,
            vibrancy: 'hud',  // 'light', 'medium-light' etc
            autoHideMenuBar: process.env.MODE !== 'development',
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                contextIsolation: false,
                nodeIntegrationInWorker: true,
                nativeWindowOpen: false
            }
        });
        translateWin.setSkipTaskbar(true);
        translateWin.setWindowButtonVisibility && translateWin.setWindowButtonVisibility(false);
        //禁止关闭窗口 关闭时自动隐藏 始终保持只有一个番茄窗口
        translateWin.on('close', event => {
            translateWin.isVisible() && event.preventDefault();
            translateWin.hide();
        })
        if (process.env.NODE_ENV === 'development') {
            //开发阶段允许热更新时重启客户端 command+q的情况 允许关闭窗口 因为这里是开发阶段 如果一直不关闭窗口 无法进行更新
            app.on("before-quit", () => this.closeTranslateWindow());
            // @ts-ignore
            translateWin.loadURL(process.env.VITE_DEV_SERVER_URL).then(() => {
                // translateWin.webContents.openDevTools();
                translateWin.webContents.send("router", "translate");
            });
        } else {
            if (process.platform === "darwin") app.dock.hide();
            translateWin.loadFile(resolve(__dirname, '../../render-build/index.html')).then(() => {
                translateWin.webContents.send("router", "translate");
            });
        }
    }
    closeTranslateWindow() {
        const translateWin = this.translateWin;
        this.translateWin = null;
        translateWin.close()
    }
    async initPuppeteer() {
        browser = await puppeteer.launch({headless: true});
        await this.initPages();
        this.setupShortcut();
        powerMonitor.on("unlock-screen", async () => {
            await Promise.all([
                translatePage.close(),
                botPage.close()
            ]);
            return this.initPages();
        })
    }
    async initPages() {
        translatePage = await browser.newPage();
        reverseTranslatePage = await browser.newPage();
        botPage = await browser.newPage();
        const zh2EnUrl = `https://translate.google.cn/?sl=zh-CN&tl=en&op=translate`;
        const en2ZhUrl = `https://translate.google.cn/?sl=en&tl=zh-CN&op=translate`;
        translatePage.goto(zh2EnUrl).catch(() => 1);
        reverseTranslatePage.goto(en2ZhUrl).catch(() => 1);
        await botPage.setRequestInterception(true);
        botPage.on('request', (interceptedRequest) => {
            if (["image"].some((str) => interceptedRequest.resourceType() === str)) return interceptedRequest.abort();
            return interceptedRequest.continue();
        })
        const pGetUri = () => botUrl;
        botPage.goto("https://quillbot.com/");
        botPage.exposeFunction('pGetUri', pGetUri);
    }
    setupShortcut() {
        const pasteHandle = () => robot.keyTap('v', process.platform === "darwin" ? 'command' : "control");
        const copyHandle = () => robot.keyTap('c', process.platform === "darwin" ? 'command' : "control");
        //翻译快捷键
        globalShortcut.register('CommandOrControl+E', async () => {
            copyHandle();
            await translatePage.waitForTimeout(80);
            const rawText = clipboard.readText();
            if (!rawText) return;
            const inputSelector = "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.UnxENd > span > span > div > textarea";
            const inputHandle = await translatePage.$(inputSelector);
            if (!inputHandle) return pasteHandle();
            await inputHandle.click({clickCount: 3});
            await inputHandle.press('Backspace');
            await inputHandle.type(rawText, {delay: 1});
            const selector = "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.P6w8m.BDJ8fb > div.dePhmb > div > div.J0lOec > span.VIiyi > span > span";
            await translatePage.waitForSelector(selector, {timeout: 5000});
            const text = await translatePage.$eval(selector, (el) => el.innerHTML);
            await inputHandle.focus();
            await translatePage.evaluate(() => document.execCommand('selectall', false, null));
            await translatePage.keyboard.press('Backspace');
            clipboard.writeText(text);
            pasteHandle();
        });
        globalShortcut.register('CommandOrControl+W', async () => {
            copyHandle();
            await reverseTranslatePage.waitForTimeout(80);
            const rawText = clipboard.readText();
            if (!rawText) return;
            const inputSelector = "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.UnxENd > span > span > div > textarea";
            const inputHandle = await reverseTranslatePage.$(inputSelector);
            if (!inputHandle) return pasteHandle();
            await inputHandle.click({clickCount: 3});
            await inputHandle.press('Backspace');
            await inputHandle.type(rawText, {delay: 1});
            const selector = "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.P6w8m.BDJ8fb > div.dePhmb > div > div.J0lOec > span.VIiyi > span > span";
            await reverseTranslatePage.waitForSelector(selector, {timeout: 5000});
            const text = await reverseTranslatePage.$eval(selector, (el) => el.innerHTML);
            await inputHandle.focus();
            await reverseTranslatePage.evaluate(() => document.execCommand('selectall', false, null));
            await reverseTranslatePage.keyboard.press('Backspace');
            //    write2Window
            this.translateWin.setSize(text.length * 18 + 8, 50);
            this.setupTranslateWindow();
            this.translateWin.webContents.send("translate", "show", text);
        });
        //词法润色快捷键
        globalShortcut.register('CommandOrControl+T', async () => {
            copyHandle();
            await translatePage.waitForTimeout(80);
            const rawText = clipboard.readText();
            if (!rawText) return;
            const params = {
                text: rawText,
                strength: 1,
                autoflip: false,
                wikify: false,
                fthresh: -1,
                inputLang: "en",
                quoteIndex: -1,
            };
            botUrl = `https://rest.quillbot.com/api/paraphraser/single-paraphrase/0?${qs.stringify(params)}`;
            const botRes: any = await Promise.race(
                [botPage.evaluate(() => {
                    return new Promise((resolve, reject) => {
                        window["pGetUri"]().then((uri) => {
                            fetch(uri, {
                                "headers": {
                                    "accept": "application/json, text/plain, */*",
                                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
                                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-site",
                                    "useridtoken": "undefined"
                                },
                                "referrer": "https://quillbot.com/",
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "body": null,
                                "method": "GET",
                                "mode": "cors",
                                "credentials": "include"
                            }).then((res) => {
                                res.json().then(resolve)
                            }).catch(reject)
                        })
                    })
                }), botPage.waitForTimeout(15000)]
            );
            if (botRes?.data[0]) clipboard.writeText(botRes.data[0].paras_1[0].alt);
            pasteHandle();
        });
    }
}
