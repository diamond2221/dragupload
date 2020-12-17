import request from './request'
import qs from 'qs'
import md5 from '@/utils/md5'

export const userLogout = () => {
  return request({
    prefixUrl: '/8899',
    base: '//op.shanghe.link',
    method: 'post',
    url: '/user/logout'
  })
}

export const userUpPass = (oldPass: string, newPass: string, confirmPass: string) => {
  const data = {
    confirmPass: md5(confirmPass).toUpperCase(),
    oldPass: md5(oldPass).toUpperCase(),
    newPass: md5(newPass).toUpperCase()
  }
  return request({
    prefixUrl: '/8899',
    base: '//op.shanghe.link',
    isForm: true,
    method: 'post',
    url: '/user/uppass',
    data: qs.stringify(data)
  })
}

export const getUserInfo = () => {
  return request<any>({
    prefixUrl: '/8899',
    base: '//op.shanghe.link',
    method: 'GET',
    url: '/api/user/get',
    code: '3f856ec241d67b94402699ed313d714f'
  })
}
