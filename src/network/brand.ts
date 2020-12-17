import { RecordList } from '@/types/common'
import request from './request'

export interface BrandItem {
  id: number
  brandCode: string
  brandName: string
  brandType: number
  companyName: null
  contactPerson: null
  contactPhone: null
  display: number
  source: number
  addTime: number
  applyType: null
  brandSummary: string
  imgUrls: null
  videoUrls: null
  sort: number
  brandLogo: string
}

export const fetchBrandShowRooms = (pageNo: number, pageSize: number, brandName: string) => {
  return request<RecordList<BrandItem[]>>({
    method: 'GET',
    url: '/api/back/brand/list',
    params: {
      pageNo,
      pageSize,
      brandName
    }
  })
}

export interface BranShowRoomData {
  brandCode?: string
  brandLogo: string
  brandName: string
  brandSummary: string
  imgUrls: string
  sort: number
  text: string
  videoUrls: string
  brandType: number

  style?: number
}

export const createBrandShowRoom = (data: BranShowRoomData) => {
  return request({
    method: 'post',
    url: '/api/back/brand/save',
    data
  })
}

export const updateBrandShowRoom = (data: BranShowRoomData) => {
  return request({
    url: '/api/back/brand/update',
    method: 'POST',
    data
  })
}

export const upBrandShowRoomStatus = (brandCode: string) => {
  return request({
    url: '/api/back/brand/under',
    method: 'PUT',
    params: { brandCode }
  })
}
export interface BrandShowRoomDetail {
  brandCode: null | string
  brandLogo: string
  brandName: string
  brandSummary: string
  imgUrls: string | null
  sort: number
  style: null
  text: string | null
  videoUrls: string | null
  brandType: number
}
export const getBrandShowRoom = (brandCode: string) => {
  return request<BrandShowRoomDetail>({
    url: '/api/back/brand/details',
    method: 'GET',
    params: { brandCode }
  })
}

export interface BrandType {
  brandName: string
  brandType: 5
}
export const fetchBrandTypes = () => {
  return request<BrandType[]>({
    url: '/api/back/brand/getBrandType'
  })
}
