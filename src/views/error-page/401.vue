<template>
  <div class="errPage-container">
    <Button
      icon="ios-arrow-back"
      class="back-btn"
      @click="back"
    >
      返回
    </Button>
    <Row>
      <iv-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          Oops!
        </h1>

        <h2>你没有权限去该页面</h2>
        <h6>如有不满请联系你领导</h6>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <router-link to="/dashboard">
              回首页
            </router-link>
          </li>
          <li class="link-type">
            <a
              target="_blank"
              href="https://www.shanghe.link"
            >去上和官网看看</a>
          </li>
          <li>
            <a
              href="#"
              @click.prevent="dialogVisible=true"
            >点我看图</a>
          </li>
        </ul>
      </iv-col>
      <iv-col :span="12">
        <img
          :src="errGif"
          class="some-gif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        >
      </iv-col>
    </Row>
    <Modal
      v-model="dialogVisible"
      title="随便看"
    >
      <img
        :src="ewizardClap"
        class="some-img"
      >
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import errGif from '@/assets/401-images/401.gif'

@Component({
  name: 'Page401'
})
export default class extends Vue {
  private errGif = errGif + '?' + +new Date()
  private ewizardClap = 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646'
  private dialogVisible = false

  private back() {
    if (this.$route.query.noGoBack) {
      this.$router.push({ path: '/dashboard' })
    } else {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;

}
.back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }

  .some-gif {
    margin: 0 auto;
    display: block;
  }

  .some-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }

  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }

  .list-unstyled {
    font-size: 14px;

    li {
      padding-bottom: 5px;
    }

    a {
      color: #008489;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
