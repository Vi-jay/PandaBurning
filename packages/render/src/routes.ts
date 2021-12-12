import Tomato from "@/views/tomato.vue";
import Translate from "@/views/translate.vue";
import Test from "@/views/test.vue";
import * as VueRouter from "vue-router";

const routes = [
    {path: '/', component: Tomato},
    {path: '/translate', component: Translate},
    {path: '/test', component: Test},
]
export const historyRouter = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
});