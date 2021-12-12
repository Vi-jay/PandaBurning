<template>
  <div id="Tomato">
    <van-count-down ref="countDown" :time="tomatoSec"/>
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted, getCurrentInstance, onUnmounted, onUpdated} from "vue";
import {Ref} from "@vue/reactivity";
import {CountDownInstance} from "vant";
const tomatoSec = ref(0);
const countDown: Ref<CountDownInstance> = ref(null);
// onMounted(() => {
//   window["ipcRenderer"].on("tomato", (event, eventName, totalSec) => {
//     if (eventName === "start") {
//       tomatoSec.value = totalSec * 1000;
//       return countDown.value.start();
//     }
//     tomatoSec.value = 0;
//     countDown.value.reset();
//   });
// });
// onUnmounted(() => {
//   window["ipcRenderer"].removeAllListeners("tomato");
// })
</script>

<style lang="scss" scoped>
@import "../assets/common";
#Tomato {
  color: white;
  height: 100%;
  @include flex-center;
  --van-count-down-font-size: 30px;
}
</style>
