import { getUserInfo } from '@/network/account'
import store from '@/store'
import { IUserInfo } from '@/types/account'
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { TagsViewModule } from './tags-view'

export interface IUserState {
  roles: string[]
  signStatus: boolean
  changePwdModalStatus: boolean
  allUserInfo: any | null
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public roles: string[] = []
  public signStatus = false
  public allUserInfo: IUserState['allUserInfo'] = null
  // {
  //   permissionJson: JSON.stringify([{ code: '180dd3743f4547cd10278ffeaac3a968' }])
  // }

  public changePwdModalStatus = false

  @Mutation
  public setChangePwdModalStatus(boolean: boolean) {
    this.changePwdModalStatus = boolean
  }

  @Mutation
  public SET_USERINFO_ONLY(userInfo: IUserInfo | null) {
    this.allUserInfo = userInfo
  }

  @Action
  setLogin(userInfo: IUserInfo) {
    const domain = process.env.NODE_ENV === 'production' ? 'shanghe.link' : 'localhost'
    return new Promise<void>((resolve) => {
      window.Cookies.set('token', userInfo.token, { domain })
      window.Cookies.set('uid', userInfo.uid, { domain })
      window.Cookies.set('system_type', '2', { domain })
      window.Cookies.set('uname', userInfo.uname, { domain })
      window.Cookies.set('role', userInfo.role, { domain })
      resolve()
    })
  }

  @Action
  setLogout() {
    return new Promise<void>((resolve) => {
      const domain = process.env.NODE_ENV === 'production' ? 'shanghe.link' : 'localhost'
      window.Cookies.remove('token', { domain })
      window.Cookies.remove('uid', { domain })
      window.Cookies.remove('system_type', { domain })
      window.Cookies.remove('uname', { domain })
      window.Cookies.remove('role', { domain })

      // Reset visited views and cached views
      TagsViewModule.delAllViews()
      this.SET_USERINFO_ONLY(null)
      localStorage.clear()
      resolve()
    })
  }

  @Mutation
  setRoles(roles: string[]) {
    this.roles = roles
  }

  @Action
  GetUserInfo() {
    return new Promise<void>((resolve, reject) => {
      const token = window.Cookies.get('token')
      const uid = window.Cookies.get('uid')
      const uname = window.Cookies.get('uname')
      const role = window.Cookies.get('role')
      if (token && uid && uname && role) {
        if (this.allUserInfo) {
          let roles: string[] = []
          try {
            roles = (JSON.parse(this.allUserInfo.permissionJson || '')).map((v: any) => v.code) as string[]
          } catch (error) {

          }
          this.setRoles(roles)
          resolve()
        } else {
          getUserInfo().then(async res => {
            this.SET_USERINFO_ONLY(res.data)
            let roles: string[] = []
            try {
              roles = (JSON.parse(res.data.permissionJson || '')).map((v: any) => v.code) as string[]
            } catch (error) {

            }
            this.setRoles(roles)
            return resolve()
          })
        }
      } else {
        reject(new Error('未登录'))
      }
    })
  }
}

export const UserModule = getModule(User)
