import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, setSidebarStatus, getSize, setSize } from '@/utils/storage'

import store from '@/store'
import axios from 'axios'
import { Message } from 'view-design'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  size: string
  timestampDiff: number
  timeCail: boolean
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }

  public device = DeviceType.Desktop
  public size = getSize() ?? 'default'
  public timestampDiff = Date.now()
  public timeCail = false

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    setSize(this.size)
  }

  @Mutation
  private SET_TIMESTAMPDIFF(timestampDiff: number) {
    this.timestampDiff = timestampDiff
  }

  @Mutation
  private SET_TIMECAIL(timeCail: boolean) {
    this.timeCail = timeCail
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }

  @Action
  public GetTimestamp() {
    return axios
      .get('//quan.suning.com/getSysTime.do')
      .then(({ data, status }) => {
        if (status === 200) {
          return data
        } else {
          Message.error('网络时间校准失败！！！， 请刷新页面重试！！！')
        }
      })
      .then(({ sysTime2 }) => {
        this.SET_TIMESTAMPDIFF(Date.now() - (new Date(sysTime2)).getTime())
        this.SET_TIMECAIL(true)
      })
      .catch((err) => {
        console.error(err)
        Message.error('网络时间校准失败！！！， 请刷新页面重试！！！')
      })
  }
}

export const AppModule = getModule(App)
