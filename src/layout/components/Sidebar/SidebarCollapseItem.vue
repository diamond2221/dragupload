<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}]"
  >
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <Tooltip
          :key="`drop-menu-${theOnlyOneChild.path}`"
          transfer-class-name="sh-slider-tooltip"
          transfer
          :content="theOnlyOneChild.meta.headtitle"
          placement="right"
        >
          <svg-icon
            v-if="theOnlyOneChild.meta.icon"
            :name="theOnlyOneChild.meta.icon"
            :class="theOnlyOneChild.meta.icon"
          />
        </Tooltip>
      </sidebar-item-link>
    </template>
    <Dropdown
      v-else
      placement="right-start"
      transfer
      transfer-class-name="sh-slider-dropdown"
      :class="{
        'sh-menu-dropdown-active': isSelectRoute(item)
      }"
    >
      <svg-icon
        v-if="item.meta && item.meta.icon"
        :name="item.meta.icon"
        :class="item.meta.icon"
      />
      <DropdownMenu slot="list">
        <template v-for="child in item.children">
          <sidebar-item-link
            v-if="!child.meta || !child.meta.hidden"
            :key="child.path"
            :to="resolvePath(child.path)"
          >
            <DropdownItem
              class="nest-menu"
              :class="[false ? 'simple-mode' : 'full-mode', {'first-level': false}]"
              :selected="resolvePath(child.path) === activeName"
            >
              <svg-icon
                v-if="child.meta.icon"
                :name="child.meta.icon"
                :class="child.meta.icon"
              />
              {{ child.meta.headtitle }}
            </DropdownItem>
          </sidebar-item-link>
        </template>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'
import SidebarItem from './SidebarItem.vue'

@Component({
  // Set 'name' here to prevent uglifyjs from causing recursive component not work
  name: 'SidebarCommapseItem',
  components: {
    SidebarItemLink,
    SidebarItem
  }
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig;
  @Prop({ default: false }) private isCollapse!: boolean;
  @Prop({ default: true }) private isFirstLevel!: boolean;
  @Prop({ default: '' }) private basePath!: string;
  @Prop({ default: '' }) private readonly activeName!: string;

  get alwaysShowRootMenu() {
    if (this.item.meta && this.item.meta.alwaysShow) {
      return true
    }
    return false
  }

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false
        } else {
          return true
        }
      })
      return showingChildren.length
    }
    return 0
  }

  get theOnlyOneChild() {
    if (this.showingChildNumber > 1) {
      return null
    }
    if (this.item.children) {
      for (const child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child
        }
      }
    }
    // If there is no children, return itself with path removed,
    // because this.basePath already conatins item's path information
    return { ...this.item, path: '' }
  }

  private resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }

  private isSelectRoute(route: RouteConfig) {
    const { activeName } = this
    const dealRoutePaths = (route.children || []).map((v) =>
      this.resolvePath(v.path)
    )
    return dealRoutePaths.includes(activeName)
  }
}
</script>

<style lang="less">
@import "../../../styles/_variables.less";

.simple-mode {
  .router-link-active,
  .sh-menu-dropdown-active {
    color: @subMenuActiveText !important;;
    .ivu-tooltip,
    &.ivu-dropdown {
      background: var(--menuActiveBackground);
    }
  }
  .ivu-tooltip,
  .ivu-dropdown {
    padding: 14px 0;
    width: 100%;
    cursor: pointer;
  }
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import "../../../styles/_variables.less";
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
.ivu-dropdown-item-selected,
.ivu-dropdown-item-selected:hover {
  color: @menuActiveText;
}
.ivu-dropdown-item-selected,
.ivu-dropdown-item.ivu-dropdown-item-selected:hover {
  background-color: var(--menuActiveBackground);
}
</style>
