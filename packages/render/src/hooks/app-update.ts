import {onMounted, ref} from "vue";

const {ipcRenderer} = require("electron");
export function useUpdate() {
    const tips = ref("");
    const downloadPercent = ref("");
    onMounted(() => {

        ipcRenderer.on("message", (event, text) => {
            tips.value = text;
        });
        //注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
        ipcRenderer.on("downloadProgress", (event, progressObj) => {
            downloadPercent.value = progressObj.percent || 0;
        });
        ipcRenderer.on("isUpdateNow", () => {
            ipcRenderer.send("isUpdateNow");
        });
    });
    return {
        tips,
        downloadPercent,
        checkSoftwareUpdate() {
            ipcRenderer.send("checkForUpdate");
        }
    }
}
