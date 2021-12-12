<template>
  <div id="Translate">
    {{translateText}}
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted, getCurrentInstance, onUnmounted, onUpdated} from "vue";
const {ipcRenderer} = require("electron");
const translateText = ref("");
onMounted(() => {
  ipcRenderer.on("translate", (event, eventName, text) => {
    if (eventName === "show") {
      translateText.value= text;
    }
  });
});
onUnmounted(() => {
  ipcRenderer.removeAllListeners("translate");
})
</script>

<style lang="scss" scoped>
@import "../assets/common";
#Translate {
  color: white;
  height: 100%;
  @include flex-center;
}
</style>