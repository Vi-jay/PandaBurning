<template>
  <div id="AppContainer">
    <router-view/>
    <button @click="checkSoftwareUpdate">检查更新</button>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";

const {ipcRenderer} = window.require("electron");
// const background = ref(window["ipcRenderer"].isMac ? "transparent" : "black");
const background = ref(1 ? "transparent" : "black");
console.log(ipcRenderer.send)
// function checkSoftwareUpdate() {
//   ipcRenderer.send("checkForUpdate");
// }
// onMounted(() => {
//   // const router = useRouter();
//   // window["ipcRenderer"].on("router", (event, routerName) => {
//   //   router.replace(routerName);
//   // });
//   // window.addEventListener("keydown", (event) => {
//   //   if (event.key === "Escape") window.close();
//   // });
//   ipcRenderer.on("message", (event, text) => {
//     console.log(arguments);
//     this.tips = text;
//   });
//   //注意：“downloadProgress”事件可能存在无法触发的问题，只需要限制一下下载网速就好了
//   ipcRenderer.on("downloadProgress", (event, progressObj) => {
//     console.log(progressObj);
//     this.downloadPercent = progressObj.percent || 0;
//   });
//   ipcRenderer.on("isUpdateNow", () => {
//     ipcRenderer.send("isUpdateNow");
//   });
// });
// onUnmounted(() => {
//   window["ipcRenderer"].removeAllListeners("router");
// })
</script>

<style lang="scss">
#app {
  height: 100%;
}
#AppContainer {
  height: 100%;
  background: v-bind(background);
}
</style>
