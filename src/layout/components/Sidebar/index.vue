<template>
  <Sider
    v-model="isCollapse"
    :collapsed-width="50"
    class="left-sider"
    :width="isCollapse ? 'auto' : 'auto'"
    :style="{overflow: 'hidden'}"
    :class="{'has-logo': showLogo}"
  >
    <sidebar-logo
      v-if="showLogo"
      class="sider-logo-wrap"
      :collapse="isCollapse"
    />
    <Menu
      ref="menuEl"
      :active-name="activeMenu"
      :open-names="openNames"
      theme="light"
      class="sh-scrollbar-hide"
      @on-open-change="menuOpenChange"
    >
      <!-- @on-open-change="menuOpenChange"
        @on-select="menuSelect" -->
      <template v-for="route in routes">
        <template v-if="isCollapse">
          <sidebar-collapse-item
            :key="route.path"
            :item="route"
            :base-path="route.path"
            :is-collapse="isCollapse"
            :active-name="activeMenu"
          />
        </template>
        <template v-else>
          <sidebar-item
            :key="route.path"
            :item="route"
            :base-path="route.path"
            :is-collapse="isCollapse"
          />
        </template>
      </template>
    </Menu>
  </Sider>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import { AppModule, DeviceType } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import SidebarItem from './SidebarItem.vue'
import SidebarCollapseItem from './SidebarCollapseItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import variables from '../../../styles/_variables.less'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem,
    SidebarCollapseItem,
    SidebarLogo
  }
})
export default class extends Vue {
  get mobile() {
    return this.device === DeviceType.Mobile
  }

  get device() {
    return AppModule.device
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get routes() {
    return PermissionModule.routes
  }

  get showLogo() {
    return SettingsModule.showSidebarLogo
  }

  get variables() {
    return variables
  }

  get activeMenu() {
    const route = this.$route
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  }

  get isCollapse() {
    return !this.sidebar.opened
  }

  @Ref('menuEl') private menuEl!: any;
  @Watch('isCollapse')
  isCollapseChange(v: boolean) {
    if (v) {
      this.setOpenNames(this.activeMenu)
    }
    this.$nextTick(() => {
      if (this.menuEl) {
        this.menuEl.updateActiveName()
        setTimeout(() => {
          this.menuEl.updateOpened()
        }, 0)
      }
    })
  }

  @Watch('openNames')
  openNamesChange() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.menuEl) {
          this.menuEl.updateOpened()
        }
      }, 80)
    })
  }

  private openNames: string[] = [];
  public menuOpenChange(openNames: string[]) {
    this.openNames = openNames
  }

  @Watch('$route', { immediate: true })
  public routeChange() {
    if (this.isCollapse) {
      this.setOpenNames(this.activeMenu, this.ready)
    } else {
      if (!this.ready) {
        this.setOpenNames(this.activeMenu, this.ready)
      }
      // this.menuSelect(v.meta.menuText);
    }
    this.ready = true
  }

  private ready = false;
  private setOpenNames(activeMenu: string, old = false) {
    const newOpenNames = [`/${activeMenu.split('/')[1]}`]
    if (old) {
      this.openNames = [
        ...this.openNames,
        ...(newOpenNames || this.getAllNames(activeMenu))
      ]
    } else {
      this.openNames = newOpenNames || this.getAllNames(activeMenu)
    }
  }

  private getAllNames(activeMenu: string) {
    const arr = activeMenu.split('/').filter((v) => !!v)
    return arr
      .map((v, i) => {
        let s = ''
        for (let index = 0; index <= i; index++) {
          s += '/' + arr[index]
        }
        return s
      })
      .slice(0, -1)
  }
}
</script>

<style lang="less">
.sidebar-container {
  box-shadow: 2px 0 8px 0 #1d23291f;
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }
}
</style>

<style lang="less" scoped>
// .has-logo {
// }
&.has-logo {
  .ivu-menu {
    height: calc(100% - 55px);
  }
}
.ivu-menu {
  border: none;
  height: 100%;
  width: 100% !important;
  overflow-y: auto;
  &::after {
    display: none;
  }
  /deep/ a {
    color: unset;
  }
}
.ivu-layout-sider {
  background-color: #fff;
}
</style>
