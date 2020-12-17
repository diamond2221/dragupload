<template>
  <!-- <div class="sh-color-predefine">
    <div class="sh-color-predefine__colors">
      <div
        v-for="item in themes"
        :key="item"
        class="sh-color-predefine__color-selector"
        @click="theme = item"
      >
        <div :style="{'background-color': item}" />
      </div>
    </div>
  </div> -->
  <ColorPicker
    v-model="theme"
    size="small"
    :colors="themes"
  />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { Message } from 'view-design'

@Component({
  name: 'ThemePicker'
})
export default class extends Vue {
  private chalk = ''; // The content of theme-chalk css
  private theme = '';
  private themes = [
    '#0079FE',
    '#304156',
    '#212121',
    '#11A983',
    '#13C2C2',
    '#6959CD',
    '#F5222D'
  ];

  get defaultTheme() {
    return SettingsModule.theme
  }

  @Watch('defaultTheme', { immediate: true })
  private onDefaultThemeChange(value: string) {
    this.theme = value
    this.setTheme(value)
  }

  @Watch('theme')
  private async onThemeChange(value: string) {
    if (!value) return
    this.setTheme(value)

    this.$emit('change', value)
    Message.success({
      content: '主题切换成功'
    })
  }

  private setTheme(value: string) {
    const themeCluster = this.getThemeCluster(value.replace('#', ''))
    document.documentElement.style.setProperty('--menuActiveBackground', themeCluster[10])
    document.documentElement.style.setProperty('--primary-shadow-color', themeCluster[10])
    document.documentElement.style.setProperty('--primary-color', themeCluster[2])
    document.documentElement.style.setProperty('--main-color', `#${themeCluster[0]}`)
  }

  private getThemeCluster(theme: string) {
    const tintColor = (color: string, tint: number) => {
      let red = parseInt(color.slice(0, 2), 16)
      let green = parseInt(color.slice(2, 4), 16)
      let blue = parseInt(color.slice(4, 6), 16)
      if (tint === 0) {
        // when primary color is in its rgb space
        return [red, green, blue].join(',')
      } else {
        red += Math.round(tint * (255 - red))
        green += Math.round(tint * (255 - green))
        blue += Math.round(tint * (255 - blue))
        return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
      }
    }

    const shadeColor = (color: string, shade: number) => {
      let red = parseInt(color.slice(0, 2), 16)
      let green = parseInt(color.slice(2, 4), 16)
      let blue = parseInt(color.slice(4, 6), 16)
      red = Math.round((1 - shade) * red)
      green = Math.round((1 - shade) * green)
      blue = Math.round((1 - shade) * blue)
      return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
    }

    const clusters = [theme]
    for (let i = 0; i <= 9; i++) {
      clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
    }
    clusters.push(shadeColor(theme, 0.1))
    return clusters
  }
}
</script>

<style lang="less">
.sh-color-predefine {
  display: flex;
  font-size: 12px;
  margin-top: 8px;
  .sh-color-predefine__colors {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: space-between;
    .sh-color-predefine__color-selector {
      margin-right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      div {
        display: flex;
        height: 100%;
        border-radius: 3px;
      }
    }
  }
}
</style>
