<template>
  <div
    ref="rightPanel"
    :class="{show: show}"
    class="rightPanel-container"
  >
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="close-btn-wrap">
        <Icon
          type="md-close"
          @click="show = false"
        />
      </div>
      <!-- <div
        class="handle-button"
        :style="{'top': buttonTop+'px','background-color': theme}"
        @click="show=!show"
      >
        <Icon
          v-if="!show"
          type="md-settings"
        />
        <Icon
          v-else
          type="md-close"
        />
      </div> -->
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import { addClass, removeClass } from '@/utils'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'RightPanel'
})
export default class extends Vue {
  @Prop({ default: false }) private clickNotClose!: boolean;
  @Prop({ default: 250 }) private buttonTop!: number;
  @Model('change', { type: Boolean }) private readonly value!: boolean;
  private show = false;

  @Watch('value')
  valueChange(v: boolean) {
    this.show = v
  }

  get theme() {
    return SettingsModule.theme
  }

  @Watch('show')
  private onShowChange(value: boolean) {
    if (value && !this.clickNotClose) {
      setTimeout(() => {
        this.addEventClick()
      }, 200)
    }
    if (value) {
      addClass(document.body, 'showRightPanel')
    } else {
      removeClass(document.body, 'showRightPanel')
    }
    this.$emit('change', value)
  }

  mounted() {
    this.insertToBody()
  }

  beforeDestroy() {
    const elx = this.$refs.rightPanel as Element
    elx.remove()
  }

  private addEventClick() {
    window.addEventListener('click', this.closeSidebar)
  }

  private closeSidebar(ev: MouseEvent) {
    const parent = (ev.target as HTMLElement).closest('.rightPanel')
    if (!parent) {
      this.show = false
      window.removeEventListener('click', this.closeSidebar)
    }
  }

  private insertToBody() {
    const elx = this.$refs.rightPanel as Element
    const body = document.querySelector('body')
    if (body) {
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style lang="less">
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="less" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.close-btn-wrap {
  text-align: right;
  padding-right: 10px;
  i {
    font-size: 24px;
    line-height: 24px;
    cursor: pointer;
  pointer-events: auto;
  }
}
</style>
