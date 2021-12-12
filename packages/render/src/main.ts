import {createApp} from 'vue'
import App from './App.vue'
import Vant from "vant";
import "vant/lib/index.css"
import "@/assets/theme.css"
import {historyRouter} from "@/routes";
import {app} from "electron";

if (!window["ipcRenderer"]) window["ipcRenderer"] = {};
createApp(App).use(historyRouter).use(Vant).mount('#app')
