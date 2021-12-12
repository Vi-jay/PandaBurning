<template>
  <div id="AppContainer">
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";

const background = ref(window["ipcRenderer"].isMac ? "transparent" : "black");
console.log(background.value)
onMounted(() => {
  const router = useRouter();
  window["ipcRenderer"].on("router", (event, routerName) => {
    router.replace(routerName);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") window.close();
  });
});
onUnmounted(() => {
  window["ipcRenderer"].removeAllListeners("router");
})
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
