<template>
  <div class="errPage-container">
    <error-a />
    <error-b />
    <h3>请点击右上角bug小图标</h3>
    <aside>
      现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。
      <a
        target="_blank"
        class="link-type"
        href="https://armour.github.io/vue-typescript-admin-docs/guide/advanced/error.html"
      >
        文档介绍
      </a>
    </aside>
    <a href="#">
      <img src="https://wpimg.wallstcn.com/360e4842-4db5-42d0-b078-f9a84a825546.gif">
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ErrorA from './components/ErrorTestA.vue'
import ErrorB from './components/ErrorTestB.vue'

@Component({
  name: 'ErrorLog',
  components: {
    ErrorA,
    ErrorB
  }
})
export default class extends Vue {}
</script>

<style lang="less" scoped>
.errPage-container {
  padding: 30px;
}
</style>
