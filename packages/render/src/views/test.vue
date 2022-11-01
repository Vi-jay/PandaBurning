<template>
  <div id="Test">
    <van-form @submit="onSubmit">
      <van-field
          v-model="sign"
          name="sign"
          label="sign"
          placeholder="sign"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="signTime"
          type="password"
          name="signTime"
          label="signTime"
          placeholder="signTime"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import {ref, unref} from "vue";
import FootBar from "@/components/foot-bar.vue";

const sign = ref("");
const signTime = ref("");
const {ipcRenderer} = require("electron");

function onSubmit() {
  ipcRenderer.send("updateStock",{sign:unref(sign),signTime:unref(signTime)})
}
</script>

<style lang="scss" >
#Test {
  height: 100%;
  overflow-y: auto;

}
:root{
  --van-text-color:#000;
}
</style>