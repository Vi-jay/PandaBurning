import {createApp} from 'vue'
import App from './App.vue'
import Vant from "vant";
import "vant/lib/index.css"
import "@/assets/theme.css"
import {historyRouter} from "@/routes";
createApp(App).use(historyRouter).use(Vant).mount('#app')
