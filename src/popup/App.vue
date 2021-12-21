<template>
  <div class="popup">
    <div class="popup-title">
      <img :src="logo" alt="" />
      <p style="text-align: center">lychee upload</p>
    </div>
    <router-view />
  </div>
</template>

<script>
// get static files by chrome.runtime.getURL
const logo = chrome.runtime.getURL('assets/logo.png')
export default {
  name: 'App',
  setup() {
    function goToOptions() {
      // go to options page
      chrome.runtime.openOptionsPage()
    }
    return { logo, goToOptions }
  }
}
</script>

<style lang="less">
.popup {
  width: 350px;
  padding: 0 25px;
  box-sizing: border-box;
  .popup-title {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 22px;
    }
    p {
      margin-left: 5px;
    }
  }
}
.el-message {
  --el-message-min-width: 300px;
  --el-message-padding: 10px;
  top: 10px !important;
}
</style>
