import {onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";

const {ipcRenderer} = require("electron");
export function useWindowsRouter() {
    onMounted(() => {
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") window.close();
        });
        const router = useRouter();
        ipcRenderer.on("router", (event, routerName) => {
            router.replace(routerName);
        });
    });
    onUnmounted(() => {
        ipcRenderer.removeAllListeners("router");
    })
}