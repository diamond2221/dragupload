<template>
  <div class="order-list-container">
    <upload-image
      v-model="logo"
      :type="3"
      :max="8"
      :width="320"
      :height="180"
    />
  </div>
</template>

<script src="./index.ts" lang='ts'></script>

<style lang="less" scoped>
@import "./index.less";
</style>
