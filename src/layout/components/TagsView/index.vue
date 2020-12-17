<template>
  <div class="tags-view-wrap">
    <div
      id="tags-view-container"
      class="tags-view-container"
    >
      <div class="btn-con left-btn">
        <Button
          type="text"
          @click="handleScroll(240)"
        >
          <Icon
            :size="18"
            type="ios-arrow-back"
          />
        </Button>
      </div>
      <div class="btn-con right-btn">
        <Button
          type="text"
          @click="handleScroll(-240)"
        >
          <Icon
            :size="18"
            type="ios-arrow-forward"
          />
        </Button>
      </div>

      <scroll-pane
        ref="scrollPane"
        class="tags-view-wrapper"
        @on-scroll="closeMenu"
      >
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag, $event)"
        >
          {{ tag.meta.headtitle }}
          <Icon
            v-if="!isAffix(tag)"
            type="md-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </scroll-pane>
      <!-- </scroll-pane> -->
    </div>
    <ul
      v-show="visible"
      :style="{left: left+'px', top: top+'px'}"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        刷新
      </li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      >
        关闭
      </li>
      <li @click="closeOthersTags">
        关闭其他
      </li>
      <li @click="closeAllTags(selectedTag)">
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'
import { TagsViewModule, ITagView } from '@/store/modules/tags-view'
import ScrollPane from './ScrollPane.vue'
import { setViewTags } from '@/utils/storage'

@Component({
  name: 'TagsView',
  components: {
    ScrollPane
  }
})
export default class extends Vue {
  private visible = false;
  private top = 0;
  private left = 0;
  private selectedTag: ITagView = {};
  private affixTags: ITagView[] = [];

  @Watch('visitedViews')
  private visitedViewsChange(v: ITagView[]) {
    setViewTags(v)
  }

  get visitedViews() {
    return TagsViewModule.visitedViews
  }

  get routes() {
    return PermissionModule.routes
  }

  @Watch('$route')
  private onRouteChange() {
    this.addTags()
    this.moveToCurrentTag()
  }

  @Watch('visible')
  private onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  mounted() {
    this.initTags()
    this.addTags()
  }

  private isActive(route: ITagView) {
    return route.path === this.$route.path
  }

  private isAffix(tag: ITagView) {
    return tag.meta && tag.meta.affix
  }

  private filterAffixTags(routes: RouteConfig[], basePath = '/') {
    let tags: ITagView[] = []
    routes.forEach((route) => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const childTags = this.filterAffixTags(route.children, route.path)
        if (childTags.length >= 1) {
          tags = [...tags, ...childTags]
        }
      }
    })
    return tags
  }

  private initTags() {
    this.affixTags = this.filterAffixTags(this.routes)
    for (const tag of this.affixTags) {
      // Must have tag name
      if (tag.name) {
        TagsViewModule.addVisitedView(tag)
      }
    }
  }

  private addTags() {
    const { name } = this.$route
    if (name) {
      TagsViewModule.addView(this.$route)
    }
    return false
  }

  private moveToCurrentTag() {
    const tags = this.$refs.tag as any[] // TODO: better typescript support for router-link
    this.$nextTick(() => {
      for (const tag of tags) {
        if ((tag.to as ITagView).path === this.$route.path) {
          this.scrollPane && this.scrollPane.moveToTarget(tag as any)
          // When query is different then update
          if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
            TagsViewModule.updateVisitedView(this.$route)
          }
          break
        }
      }
    })
  }

  private refreshSelectedTag(view: ITagView) {
    const { visitedViews } = this
    if (visitedViews.filter((v) => v.name === view.name).length === 1) {
      TagsViewModule.delCachedView(view)
    }
    const { fullPath } = view
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  }

  private get willColseTag() {
    return TagsViewModule.willColseTag
  }

  @Watch('willColseTag')
  willColseTagChange(view: ITagView | null) {
    if (view) {
      this.closeSelectedTag(view)
    }
    TagsViewModule.setWillColseTag(null)
  }

  private closeSelectedTag(view: ITagView) {
    const { visitedViews } = this
    if (visitedViews.filter((v) => v.name === view.name).length === 1) {
      TagsViewModule.delView(view)
    } else {
      TagsViewModule.delVistedView(view)
    }
    if (this.isActive(view)) {
      this.toLastView(TagsViewModule.visitedViews, view)
    }
  }

  private closeOthersTags() {
    if (
      this.selectedTag.fullPath !== this.$route.path &&
      this.selectedTag.fullPath !== undefined
    ) {
      this.$router.push(this.selectedTag.fullPath)
    }
    TagsViewModule.delOthersViews(this.selectedTag)
    this.moveToCurrentTag()
  }

  private closeAllTags(view: ITagView) {
    TagsViewModule.delAllViews()
    if (this.affixTags.some((tag) => tag.path === this.$route.path)) {
      return
    }
    this.toLastView(TagsViewModule.visitedViews, view)
    this.handleScroll(0)
  }

  private toLastView(visitedViews: ITagView[], view: ITagView) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView !== undefined && latestView.fullPath !== undefined) {
      this.$router.push(latestView.fullPath)
    } else {
      // Default redirect to the home page if there is no tags-view, adjust it if you want
      if (view.name === 'Dashboard') {
        // to reload home page
        this.$router.replace({ path: '/redirect' + view.fullPath })
      } else {
        this.$router.push('/')
      }
    }
  }

  private openMenu(tag: ITagView, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetTop = this.$el.getBoundingClientRect().top // container margin top
    const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 5 // 15: margin right
    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }
    this.top = e.clientY - offsetTop
    this.visible = true
    this.selectedTag = tag
  }

  private closeMenu() {
    this.visible = false
  }

  @Ref('scrollPane') private scrollPane!: ScrollPane | null;
  private handleScroll(number: number) {
    this.scrollPane && this.scrollPane.handleScroll(number)
  }
}
</script>

<style lang="less">
.tags-view-wrapper {
  .tags-view-item {
    .ivu-icon-md-close {
      vertical-align: -1px;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      text-align: center;
      margin-right: -3px;

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import "../../../styles/_variables.less";
.tags-view-wrap {
  position: relative;

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 0 1px 4px rgba(128, 128, 128, 0.3);
    &:hover {
      border-color: #eee;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    }
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
.tags-view-container {
  padding: 0;
  height: 40px;
  width: 100%;
  background: #f0f0f0;
  position: relative;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid #d8dce5;
  overflow: hidden;

  // position: fixed;
  // top: 55px;
  // z-index: 3;

  .btn-con {
    position: absolute;
    top: 0px;
    height: 100%;
    background: #fff;
    padding-top: 3px;
    z-index: 10;
    button {
      padding: 6px 4px;
      line-height: 14px;
      text-align: center;
    }
    &.left-btn {
      left: 0px;
    }
    &.right-btn {
      right: 0px;
      // border-right: 1px solid #f0f0f0;
    }
  }

  .tags-view-wrapper {
    white-space: nowrap;
    height: 100%;
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 8px;

      &:first-of-type {
        margin-left: 36px;
      }

      &:last-of-type {
        margin-right: 36px;
      }

      &.active {
        background-color: @mainDarkBgColor;
        color: #fff;
        border-color: @mainDarkBgColor;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
