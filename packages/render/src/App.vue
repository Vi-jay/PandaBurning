<template>
  <div id="AppContainer">
    <router-view/>
<!--    <button @click="checkSoftwareUpdate">检查更新</button>-->
  </div>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useUpdate} from "@/hooks/app-update";
import {useWindowsRouter} from "@/hooks/windows-router";

const {ipcRenderer} = require("electron");
const background = ref(process.platform === "darwin" ? "transparent" : "black");
const {checkSoftwareUpdate, tips, downloadPercent} = useUpdate();
useWindowsRouter();
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
