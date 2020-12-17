<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">
        设置
      </h3>

      <div class="drawer-item theme">
        <span>主题色</span>
        <theme-picker @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>显示 Tags-View</span>
        <i-switch
          v-model="showTagsView"
          class="drawer-switch"
        />
      </div>

      <!-- <div class="drawer-item">
        <span>{{ $t('settings.showSidebarLogo') }}</span>
        <i-switch
          v-model="showSidebarLogo"
          class="drawer-switch"
        />
      </div> -->

      <div class="drawer-item">
        <span>固定 Header</span>
        <i-switch
          v-model="fixedHeader"
          class="drawer-switch"
        />
      </div>

      <!-- <div class="drawer-item">
        <span>{{ $t('settings.sidebarTextTheme') }}</span>
        <i-switch
          v-model="sidebarTextTheme"
          class="drawer-switch"
        />
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import ThemePicker from '@/components/ThemePicker/index.vue'
import {
  setfixHeader,
  setshowSiderbarLogo,
  setshowTagViews,
  setTheme
} from '@/utils/storage'

@Component({
  name: 'Settings',
  components: {
    ThemePicker
  }
})
export default class extends Vue {
  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  set fixedHeader(value) {
    SettingsModule.ChangeSetting({ key: 'fixedHeader', value })
    setfixHeader(value)
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  set showTagsView(value) {
    SettingsModule.ChangeSetting({ key: 'showTagsView', value })
    setshowTagViews(value)
  }

  get showSidebarLogo() {
    return SettingsModule.showSidebarLogo
  }

  set showSidebarLogo(value) {
    setshowSiderbarLogo(value)
    SettingsModule.ChangeSetting({ key: 'showSidebarLogo', value })
  }

  get sidebarTextTheme() {
    return SettingsModule.sidebarTextTheme
  }

  set sidebarTextTheme(value) {
    SettingsModule.ChangeSetting({ key: 'sidebarTextTheme', value })
  }

  private themeChange(value: string) {
    setTheme(value)
    SettingsModule.ChangeSetting({ key: 'theme', value })
  }
}
</script>

<style lang="less" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 10px 0;
    &.theme {
      display: flex;
      align-items: center;
      & > span {
        margin-right: 10px;
      }
    }
  }

  .drawer-switch {
    float: right;
  }
}
</style>
