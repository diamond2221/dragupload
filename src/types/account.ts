export interface IUserInfo {
  uname: string
  uphone?: string
  role: string
  token: string
  uid: string
}

export interface UserInfo {
  addTime: null | number
  birthday: null | number
  depCods: null | string[]
  depNames: string[]
  gender: 1
  headPortrait: null
  leader: null
  permissionJson: string
  realName: string | null
  role: string
  roleName: string
  status: null
  token: null | string
  uemail: string
  uid: string
  uname: string
  uphone: string
}
