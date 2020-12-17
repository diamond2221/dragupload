import { RecordList } from '@/types/common'
import request from './request'

export interface LogoItem {
  addTime: number
  /**
   * 0 下架
   * 1 上架
   */
  display: 0 | 1
  explanation: string
  id: number
  imgType: 1 | 2 | 3 | 4 | 5 | 6
  imgUrl: string
}

export const fetchLogoWalls = (pageNo: number, pageSize: number, explanation: string) => {
  return request<RecordList<LogoItem[]>>({
    method: 'GET',
    url: '/api/back/img/list',
    params: {
      pageNo,
      pageSize,
      explanation
    }
  })
}

export interface LogoWallData {
  display: number
  explanation: string
  imgType: number
  imgUrl: string
}

export const addLogoWall = (data: LogoWallData) => {
  return request({
    method: 'post',
    url: '/api/back/img/save',
    data
  })
}

export const upLogoWallStatus = (id: number) => {
  return request({
    url: '/api/back/img/update',
    method: 'PUT',
    data: id
  })
}
