// 暂不使用

import request from './request'
import { Districts } from '@/types/common'

export const getDistrictByCode = (code: number) => {
  return request<Districts>({
    url: '/api/city/get/city',
    params: {
      code
    }
  })
}

export const fetchDistricts = (parentId = 0, typeId: 1 | 2 | 3 | 4) => {
  return request<Districts[] | Districts>({
    url: '/api/city/get/citys',
    params: {
      parentId,
      typeId
    }
  })
}

/**
 * 省市区三级数据所有
 */
export const fetchAllDistricts = () => {
  return request<Districts[]>({
    url: '/api/city/getall'
  })
}
