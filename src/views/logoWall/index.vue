<template>
  <div class="order-list-container">
    <div class="img-wrap">
      <upload-image
        v-model="images"
        :type="3"
        :max="8"
        :width="240"
        :height="135"
      />
    </div>
    <div class="video-wrap">
      <upload-video
        v-model="videos"
        :type="3"
        :max="8"
        :width="240"
        :height="135"
        :on-before-upload="onBeforeUpload"
      />
    </div>
  </div>
</template>

<script src="./index.ts" lang='ts'></script>

<style lang="less" scoped>
@import "./index.less";
</style>
