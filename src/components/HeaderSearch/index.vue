<template>
  <div
    id="header-search"
    :class="{'show': show}"
    class="header-search"
  >
    <svg-icon
      class="search-icon"
      name="search"
      @click.stop="click"
    />
    <Select
      ref="headerSearchSelect"
      v-model="search"
      placeholder="搜索页面"
      filterable
      :remote-method="querySearch"
      class="header-search-select"
      transfer
      @on-change="change"
    >
      <Option
        v-for="item in options"
        :key="item.path"
        :value="item.path"
        :label="item.meta.title.join(' > ')"
      >
        {{ item.meta.title.join(' > ') }}
      </Option>
    </Select>

    <!-- <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.meta.title.join(' > ')"
      />
    </el-select> -->
  </div>
</template>

<script lang="ts">
import path from 'path'
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import { Component, Vue, Watch, Ref } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'HeaderSearch'
})
export default class extends Vue {
  private search = '';
  private show = false;
  private options: RouteConfig[] = [];
  private searchPool: RouteConfig[] = [];
  private fuse?: Fuse<RouteConfig>;

  @Ref('headerSearchSelect') private headerSearchSelect!: {
    $el: HTMLDivElement
  };

  get routes() {
    return PermissionModule.routes
  }

  @Watch('routes')
  private onRoutesChange() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  @Watch('searchPool', { immediate: true })
  private onSearchPoolChange(value: RouteConfig[]) {
    this.initFuse(value)
  }

  @Watch('show')
  private onShowChange(value: boolean) {
    const closeWrap = (e: MouseEvent) => {
      if (
        e.target &&
        this.headerSearchSelect &&
        this.headerSearchSelect.$el.contains(e.target as HTMLDivElement)
      ) {
        return
      }
      this.close()
    }
    if (value) {
      document.body.addEventListener('click', closeWrap)
    } else {
      document.body.removeEventListener('click', closeWrap)
    }
  }

  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  private click() {
    this.show = !this.show
    if (this.show) {
      // this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
    }
  }

  private close() {
    // this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
    this.options = []
    this.show = false
  }

  private change(route: string /* RouteConfig */) {
    this.$router.push(route)
    this.search = ''
    this.options = []
    this.$nextTick(() => {
      this.show = false
    })
  }

  private initFuse(list: RouteConfig[]) {
    const fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'meta.title',
          weight: 0.7
        },
        {
          name: 'path',
          weight: 0.3
        }
      ]
    })
    this.fuse = fuse
  }

  // Filter out the routes that can be displayed in the sidebar
  // And generate the internationalized title
  private generateRoutes(
    routes: RouteConfig[],
    basePath = '/',
    prefixTitle: string[] = []
  ) {
    let res: RouteConfig[] = []

    for (const router of routes) {
      // skip hidden router
      if (router.meta && router.meta.hidden) {
        continue
      }

      const data: RouteConfig = {
        path: path.resolve(basePath, router.path),
        meta: {
          title: [...prefixTitle]
        }
      }

      if (router.meta && router.meta.title) {
        // generate internationalized title
        data.meta.title = [...data.meta.title, router.meta.headerTitle]
        if (router.redirect !== 'noRedirect') {
          // only push the routes with title
          // special case: need to exclude parent router without redirect
          res.push(data)
        }
      }

      // recursive child routes
      if (router.children) {
        const tempRoutes = this.generateRoutes(
          router.children,
          data.path,
          data.meta.title
        )
        if (tempRoutes.length >= 1) {
          res = [...res, ...tempRoutes]
        }
      }
    }
    return res
  }

  private querySearch(query: string) {
    if (query !== '') {
      if (this.fuse) {
        this.options = this.fuse.search(query).map((result) => result.item)
      }
    } else {
      this.options = []
    }
  }
}
</script>

<style lang="less" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
