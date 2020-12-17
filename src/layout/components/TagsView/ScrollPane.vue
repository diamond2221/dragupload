<template>
  <div
    ref="scrollContainer"
    class="scroll-body-wrap"
    @DOMMouseScroll.prevent="handlescroll"
    @mousewheel.prevent="handlescroll"
  >
    <div
      ref="scrollBody"
      class="scroll-body"
      :style="{left: tagBodyLeft + 'px'}"
    >
      <transition-group name="taglist-moving-animation">
        <slot />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'

@Component({
  name: 'ScrollPane'
})
export default class extends Vue {
  private tagBodyLeft = 0;
  private rightOffset = 40;
  private outerPadding = 4;
  @Ref('scrollContainer') private scrollContainer!: HTMLDivElement | null;
  @Ref('scrollBody') private scrollBody!: HTMLDivElement | null;

  private handlescroll(e: any) {
    var type = e.type
    let delta = 0
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
      delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40
    }
    this.handleScroll(delta)
    this.$emit('on-scroll')
  }

  public handleScroll(offset: number) {
    const { scrollContainer, scrollBody } = this
    if (!scrollContainer || !scrollBody) return
    const outerWidth = scrollContainer.offsetWidth
    const bodyWidth = scrollBody.offsetWidth
    if (offset > 0) {
      this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
    } else {
      if (outerWidth < bodyWidth) {
        if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
          this.tagBodyLeft = this.tagBodyLeft + 0
        } else {
          this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
        }
      } else {
        this.tagBodyLeft = 0
      }
    }
  }

  get scrollWrapper() {
    return this.scrollBody as HTMLDivElement
  }

  public moveToTarget(currentTag: Vue) {
    const { scrollContainer: container, scrollBody: scrollWrapper } = this
    if (!container) return
    if (!scrollWrapper) return
    const containerWidth = container.offsetWidth
    const bodyWidth = scrollWrapper.scrollWidth
    const tagList = this.$parent.$refs.tag as any[]
    let firstTag = null
    let lastTag = null

    if (tagList.length > 0) {
      firstTag = tagList[0]
      lastTag = tagList[tagList.length - 1]
    }

    const currentTagEl = currentTag.$el as HTMLDivElement
    if (firstTag === currentTag) {
      this.tagBodyLeft = 0
    } else if (lastTag === currentTag) {
      this.tagBodyLeft = 0
    } else {
      if (bodyWidth < containerWidth) {
        this.tagBodyLeft = 0
      } else if (currentTagEl.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = currentTagEl.offsetLeft + this.outerPadding
      } else if (
        currentTagEl.offsetLeft > -this.tagBodyLeft &&
        currentTagEl.offsetLeft + currentTagEl.offsetWidth <
          -this.tagBodyLeft + containerWidth
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          containerWidth -
            currentTagEl.offsetWidth -
            currentTagEl.offsetLeft -
            this.outerPadding
        )
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          currentTagEl.offsetLeft -
          (containerWidth - this.outerPadding - currentTagEl.offsetWidth)
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
.scroll-body-wrap {
  .scroll-body {
    height: calc(100% - 1px);
    padding: 1px 4px 0;
    position: absolute;
    overflow: visible;
    white-space: nowrap;
    transition: left 0.3s ease;
    display: inline-flex;
    align-items: center;
  }
}
</style>
