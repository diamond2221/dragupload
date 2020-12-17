<template>
  <div class="dashboard-container">
    <div class="wrapping">
      <div class="left-top-img" />
      <div class="texts">
        <div class="left-h1">
          <div class="text">
            Welcome~
          </div>
        </div>
        <div class="left-text">
          欢迎使用拖拽上传
        </div>
        <div class="bottom-text">
          <a
            href="https://www.shanghe.link"
            target="_blank"
          >上和官网</a>
        </div>
      </div>
      <img
        class="right-bg"
        src="../../assets/bg/welcome.png"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Dashboard'
})
export default class extends Vue {
  get roles() {
    return UserModule.roles
  }
}
</script>

<style lang="less" scoped>
.wrapping {
  position: absolute;
  left: 15px;
  top: 15px;
  right: 0;
  bottom: 0;
  .left-top-img {
    width: 476px;
    height: 299px;
    background: url("../../assets/bg/left_sj.png")
      center center no-repeat;
    background-size: contain;
    position: absolute;
    left: 150px;
    top: 0;
  }
  .texts {
    position: relative;
    top: 180px;
    display: inline-block;
    z-index: 2;
    .left-h1 {
      display: flex;
      align-items: center;
      line-height: 56px;
      color: #333;
      font-weight: bold;
      font-size: 40px;
      .text {
        margin-right: 10px;
      }
      .logo {
        width: 36px;
        height: 32px;
        position: relative;
        top: 4px;
      }
    }
    .left-text {
      color: #333;
      font-size: 26px;
      line-height: 37px;
      margin-top: 30px;
    }
    .bottom-text {
      margin-top: 10px;
      color: #999999;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .right-bg {
    height: 90%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
