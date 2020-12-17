/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { AppModule, DeviceType } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'FixScroll'
})
export default class extends Vue {
  @Prop({ required: false, default: 0 }) public readonly paddingTop!: number;

  public get collapsible() {
    return !AppModule.sidebar.opened
  }

  public get showTagsView() {
    return SettingsModule.showTagsView
  }

  public get fixedHeader() {
    return SettingsModule.fixedHeader
  }

  @Watch('fixedHeader')
  fixedHeaderChange() {
    this.init()
    this.bindEvent()
  }

  public bindEvent() {
    this.removeEvent()
    if (this.fixedHeader) {
      document.querySelector<HTMLDivElement>('#app-main')!.addEventListener('scroll', this._pageScroll)
    } else {
      window.addEventListener('scroll', this._pageScroll)
    }
  }

  public removeEvent() {
    if (this.fixedHeader) {
      document.querySelector<HTMLDivElement>('#app-main')?.removeEventListener('scroll', this._pageScroll)
    } else {
      window.removeEventListener('scroll', this._pageScroll)
    }
  }

  public get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  private get menuOpend() {
    return AppModule.sidebar.opened
  }

  public get style() {
    const { mobile, showTagsView, paddingTop, collapsible, fixedHeader, leaveHeader, menuOpend } = this
    return {
      position: 'fixed',
      top: (!fixedHeader && leaveHeader) ? '0px' : `${(showTagsView ? 95 : 55) + paddingTop}px`,
      zIndex: '8',
      right: '16px',
      left: mobile ? '15px' : (collapsible ? '69px' : '225px'),
      display: mobile && menuOpend ? 'none' : 'unset'
    }
  }

  public async _pageScroll() {
    let top: number
    if (this.fixedHeader) {
      top = document.querySelector('#app-main')!.scrollTop
    } else {
      top = document.documentElement.scrollTop
    }
    if (!this.fixedHeader && top >= 30) {
      this.leaveHeader = true
    } else {
      this.leaveHeader = false
    }
    if (!this.isAnimation) return
    this.resetTopArr && this.resetTopArr(top)
  }

  public leaveHeader = false
  public isAnimation = true

  public resetTopArr(top: number) {
    //
  }

  public init() {
    //
  }
}
