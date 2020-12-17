<template>
  <transition :name="transitionName">
    <div
      v-show="visible"
      :style="customStyle"
      class="back-to-ceiling"
      @click="backToTop"
    >
      <svg-icon
        name="back-top"
        class="backTopIcon"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import { SettingsModule } from '@/store/modules/settings'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'BackToTop'
})
export default class extends Vue {
  @Prop({ default: 400 }) private visibilityHeight!: number;
  @Prop({ default: 'fade' }) private transitionName!: string;
  @Prop({ default: 0 }) private backPosition!: number;
  @Prop({
    default: () => {
      return {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px',
        background: '#e7eaf1'
      }
    }
  })
  private customStyle!: object;

  private visible = false;
  private isMoving = false;
  private interval?: number;

  private get isFixedHeader() {
    return SettingsModule.fixedHeader
  }

  private appMain: HTMLDivElement | null = null;
  mounted() {
    this.$nextTick(() => {
      const appMain = document.querySelector<HTMLDivElement>(
        '.app-main#app-main'
      )
      this.appMain = appMain
      window.addEventListener('scroll', this.handleScroll)
      appMain && appMain.addEventListener('scroll', this.handleScroll)
    })
  }

  beforeDestroy() {
    const { appMain } = this
    window.removeEventListener('scroll', this.handleScroll)
    appMain && appMain.removeEventListener('scroll', this.handleScroll)
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  private handleScroll() {
    const { appMain, isFixedHeader } = this
    const scrollTop =
      isFixedHeader && appMain ? appMain.scrollTop : window.pageYOffset
    this.visible = scrollTop > this.visibilityHeight
  }

  private backToTop() {
    const { isFixedHeader, appMain } = this
    if (this.isMoving) return
    const start =
      isFixedHeader && appMain ? appMain.scrollTop : window.pageYOffset
    let i = 0
    this.isMoving = true
    const interval = setInterval(() => {
      const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
      if (next <= this.backPosition) {
        console.log(next, appMain)
        if (isFixedHeader && appMain) {
          appMain.scrollTo(0, this.backPosition)
        } else {
          window.scrollTo(0, this.backPosition)
        }
        clearInterval(interval)
        this.isMoving = false
      } else {
        if (isFixedHeader && appMain) {
          appMain.scrollTo(0, next)
        } else {
          window.scrollTo(0, next)
        }
      }
      i++
    }, 16.7)
  }

  private easeInOutQuad(t: number, b: number, c: number, d: number) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b
    return (-c / 2) * (--t * (t - 2) - 1) + b
  }
}
</script>

<style lang="less" scoped>
.back-to-ceiling {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;

  :hover {
    background: #d5dbe7;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.back-to-ceiling .backTopIcon {
  fill: #9aaabf;
  background: none;
}
</style>
