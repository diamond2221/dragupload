<template>
  <Breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <BreadcrumbItem
      v-for="(item, index) in breadcrumbs"
      :key="item.path"
    >
      <span
        v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
        class="no-redirect"
      >{{ item.meta.headtitle }}</span>
      <a
        v-else
        @click.prevent="handleLink(item)"
      >{{ item.meta.headtitle }}</a>
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script lang="ts">
import { compile } from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'

@Component({
  name: 'ShBreadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = []

  @Watch('$route')
  private onRouteChange(route: Route) {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  created() {
    this.getBreadcrumb()
  }

  private getBreadcrumb() {
    let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
    const first = matched[0]
    if (!this.isDashboard(first)) {
      matched = [{ path: '/dashboard', meta: { title: 'dashboard' } } as RouteRecord].concat(matched)
    }
    this.breadcrumbs = matched.filter((item) => {
      return item.meta && item.meta.title && item.meta.breadcrumb !== false
    })
  }

  private isDashboard(route: RouteRecord) {
    const name = route && route.name
    if (!name) {
      return false
    }
    return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
  }

  private pathCompile(path: string) {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    const { params } = this.$route
    const toPath = compile(path)
    return toPath(params)
  }

  private handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect).catch(err => {
        // Throw Error "NavigationDuplicated"
        // https://github.com/vuejs/vue-router/issues/2872#issuecomment-522341874
        console.warn(err)
      })
      return
    }
    this.$router.push(this.pathCompile(path)).catch(err => {
      // Throw Error "NavigationDuplicated"
      // https://github.com/vuejs/vue-router/issues/2872#issuecomment-522341874
      console.warn(err)
    })
  }
}
</script>

<style lang="less" scoped>

.app-breadcrumb.ivu-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
a {
  font-weight: 400 !important;
}
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
