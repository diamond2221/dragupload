import request from './request'
import { RecordList } from '@/types/common'

export interface Info {
  addTime?: any
  contactState: number
  id: number
  imgUrl?: any
  nickName: string
  openId: string
  phone: string
}

export const fetchAuthInfo = (pageNo: number, pageSize: number, phone: string, nickName: string, contactState: number | null) => {
  return request<RecordList<Info[]>>({
    method: 'GET',
    url: '/api/back/user/list',
    params: {
      pageNo,
      pageSize,
      phone,
      nickName,
      contactState
    }
  })
}

export const contactUser = (openId: string) => {
  return request({
    url: '/api/back/user/contactUser',
    method: 'POST',
    params: { openId }
  })
}
