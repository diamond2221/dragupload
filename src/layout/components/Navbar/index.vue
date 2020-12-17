<template>
  <div
    class="navbar"
  >
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <header-search class="right-menu-item" />
        <setting class="right-menu-item hover-effect" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull class="right-menu-item hover-effect" />
        <!-- <Tooltip
          :content="$t('navbar.size')"
          placement="bottom"
        >
          <size-select class="right-menu-item hover-effect" />
        </Tooltip> -->
        <!-- <lang-select class="right-menu-item hover-effect" /> -->
      </template>

      <Dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        transfer
        transfer-class-name="sh-slider-dropdown"
      >
        <div class="avatar-wrapper">
          <img
            src="../../../assets/head.jpg"
            class="user-avatar"
          >
          <Icon type="md-arrow-dropdown" />
        </div>
        <DropdownMenu
          slot="list"
        >
          <a href="javascript:void(0);">
            <DropdownItem>
              {{ userInfo ? userInfo.realName : '' }}
            </DropdownItem>
          </a>

          <!-- <router-link to="/profile/">
            <DropdownItem>
              {{ $t('navbar.profile') }}
            </DropdownItem>
          </router-link>
          <router-link to="/">
            <DropdownItem>
              {{ $t('navbar.dashboard') }}
            </DropdownItem>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/armour/vue-typescript-admin-template/"
          >
            <DropdownItem>
              {{ $t('navbar.github') }}
            </DropdownItem>
          </a>
          <a
            target="_blank"
            href="https://armour.github.io/vue-typescript-admin-docs/"
          >
            <DropdownItem>Docs</DropdownItem>
          </a> -->

          <DropdownItem
            divided
            @click.native="openChangePasswordModal"
          >
            <span style="display:block;">
              修改密码
            </span>
          </DropdownItem>
          <DropdownItem
            divided
            @click.native="logout"
          >
            <span style="display:block;">
              退出登录
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import Setting from '@/components/Setting/index.vue'
import { toAccountSystem } from '@/utils'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    ErrorLog,
    Hamburger,
    HeaderSearch,
    Screenfull,
    Setting
  }
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  get userInfo() {
    return UserModule.allUserInfo
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private openChangePasswordModal() {
    UserModule.setChangePwdModalStatus(true)
  }

  private async logout() {
    await UserModule.setLogout()
    toAccountSystem()
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 55px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // position: fixed;
  z-index: 2;
  right: 0;
  // width: 100%;

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 55px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .ivu-icon-md-arrow-dropdown {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
