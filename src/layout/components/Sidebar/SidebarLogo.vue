<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="isCollapse"
        key="collapse"
        :class="{'collapse': isCollapse}"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          class="sidebar-logo"
          :src="logoB"
          alt="运联上和"
        >
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          class="sidebar-logo"
          :src="logoA"
          alt="运联上和"
        >
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import settings from '@/settings'
import { AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'SidebarLogo'
})
export default class extends Vue {
  @Prop({ required: true }) private collapse!: boolean;

  private title = settings.title;

  get isCollapse() {
    return !AppModule.sidebar.opened
  }

  get logoA() {
    return SettingsModule.logoA
  }

  get logoB() {
    return SettingsModule.logoB
  }
}
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  text-align: center;
  overflow: hidden;
  &:after {
    content: "";
    display: block;
    width: 1px;
    height: 100%;
    background: #dcdee2;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
  }

  & .sidebar-logo-link {
    line-height: 55px;
    height: 55px;
    width: 210px;
    display: inline-block;
    transition: none;
    &.collapse {
      width: 55px;
      .sidebar-logo {
        width: 55px;
      }
    }

    .sidebar-logo {
      display: block;
      height: 100%;
      margin: 0 auto;
      width: 210px;
      max-width: 210px;
      object-fit: contain;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
}
</style>
