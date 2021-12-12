<template>
  <div id="AppContainer">
    <router-view/>
    <button @click="checkSoftwareUpdate">检查更新</button>
    <p>{{ tips }}</p>
    <p>{{ downloadPercent }}</p>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";

const {ipcRenderer} = require("electron");
const background = ref(process.platform === "darwin" ? "transparent" : "black");
const tips = ref("");
const downloadPercent = ref("");

function checkSoftwareUpdate() {
  ipcRenderer.send("checkForUpdate");
}

onMounted(() => {
  const router = useRouter();
  ipcRenderer.on("router", (event, routerName) => router.replace(routerName));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") window.close();
  });
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
onUnmounted(() => {
  ipcRenderer.removeAllListeners("router");
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
#AppContainer {
  height: 100%;
  overflow-y: auto;
  color: white;
  background: v-bind(background);
}
</style>
