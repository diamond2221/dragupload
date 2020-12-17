<template>
  <div
    v-if="!disabled"
    :id="id"
    ref="editorRef"
    class="editorRef"
  />
  <div
    v-else
    :id="id"
    ref="editorRef"
    class="editorRef__disabled"
    :style="{height: `${height}px`}"
  />
</template>

<script src="./index.ts" lang="ts"></script>

<style lang="less" scoped>
@import "./index.less";
</style>
