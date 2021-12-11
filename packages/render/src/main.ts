import {createApp} from 'vue'
import App from './App.vue'
import Vant from "vant";
import "vant/lib/index.css"
import "@/assets/theme.css"
import Tomato from "@/components/tomato.vue";
import Translate from "@/components/translate.vue";
import * as VueRouter from "vue-router"

const routes = [
    {path: '/', component: Tomato},
    {path: '/translate', component: Translate},
]
 const historyRouter = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
});
createApp(App).use(historyRouter).use(Vant).mount('#app')
