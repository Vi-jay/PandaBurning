<template>
  <router-view/>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";

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

<style>
#app {
  height: 100%;
  background: black;
}
</style>
