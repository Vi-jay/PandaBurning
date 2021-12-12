<template>
  <div id="Test">
    <button @click="clickHandle">按钮</button>
    <teleport to="#AppContainer">{{ btnName }}</teleport>
    <teleport to="body"><foot-bar/></teleport>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import FootBar from "@/components/foot-bar.vue";

const btnName = ref("按钮")
function clickHandle() {
  btnName.value = "按钮2"
}
</script>

<style lang="scss" scoped>
#Test {
  height: 100%;
  color: white;
}
</style>