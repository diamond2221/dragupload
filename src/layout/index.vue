<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />

    <sidebar class="sidebar-container" />
    <div
      :class="{hasTagsView: showTagsView}"
      class="main-container"
    >
      <div :class="{'fixed-header': fixedHeader}">
        <navbar />
        <tags-view v-if="showTagsView" />
      </div>
      <app-main />
    </div>

    <sh-change-password-modal />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType, AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import RightPanel from '@/components/RightPanel/index.vue'
import ResizeMixin from './mixin/resize'
import variables from '@/styles/_variables.less'
import ShChangePasswordModal from '@/components/change_password/index.vue'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    'sh-change-password-modal': ShChangePasswordModal
  }
})
export default class extends mixins(ResizeMixin) {
  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
    }
  }

  get showTagsView() {
    return SettingsModule.showTagsView
  }

  get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  @Watch('fixedHeader', { immediate: true })
  fixedHeaderChange(v: boolean) {
    document.body.style.overflow = v ? 'hidden' : 'visible'
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }

  get size() {
    return AppModule.size
  }

  @Watch('size', { immediate: true })
  sizeChange(v: string) {
    const classs = [...document.body.classList]
    const dealClasss = classs.filter((v) => !v.includes('app-size-'))
    document.body.className = ''
    const setFontSize = (size: 'large' | 'default' | 'small') => {
      const allSize = {
        large: variables.largeSize,
        default: variables.defaultSize,
        small: variables.smallSize
      }
      return allSize[size]
    }
    document.body.style.fontSize = setFontSize(v as any)
    dealClasss.push(`app-size-${v}`)
    document.body.className = dealClasss.join(' ')
  }

  async created() {
    // if (!DistrictModule.allDistricted) {
    //   await DistrictModule.fetchAllDistricts()
    // }
  }
}
</script>

<style lang="less" scoped>
@import "../styles/_variables.less";
@import "../styles/_mixins.less";
.app-wrapper {
  .clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: @sideBarWidth;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: @sideBarWidth !important;
  // height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - @sideBarWidth);
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }

  .fixed-header {
    width: calc(100% - 54px);
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: @sideBarWidth !important;
    top: 0;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-@sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
