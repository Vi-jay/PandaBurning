<template>
  <div id="Translate">
    {{translateText}}
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted, getCurrentInstance, onUnmounted, onUpdated} from "vue";
import {Ref} from "@vue/reactivity";
import {CountDownInstance} from "vant";
const translateText = ref("");
onMounted(() => {
  window["ipcRenderer"].on("translate", (event, eventName, text) => {
    if (eventName === "show") {
      translateText.value= text;
      console.log(text)
    }
  });
});
onUnmounted(() => {
  window["ipcRenderer"].removeAllListeners("translate");
})
</script>

<style lang="scss" scoped>
@import "../assets/common.scss";
#Translate {
  color: white;
  height: 100%;
  @include flex-center;
}
</style>