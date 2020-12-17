import { ITagView } from '@/store/modules/tags-view'
import { Districts } from '@/types/common'
import md5 from './md5'

// tag 缓存
const viewTagsKey = 'view_tags'
export const getViewTags = () => {
  let result: ITagView[] = []
  try {
    sessionStorage.getItem(viewTagsKey)
    result = JSON.parse(sessionStorage.getItem(viewTagsKey) || '')
  } catch (error) {
  }
  return result
}
export const setViewTags = (viewTags: ITagView[]) => {
  const data: ITagView[] = viewTags.map(v => {
    return {
      title: v.title,
      path: v.path,
      name: v.name,
      hash: v.hash,
      query: v.query,
      params: v.params,
      fullPath: v.fullPath,
      matched: [],
      redirectedFrom: v.redirectedFrom,
      meta: v.meta
    }
  })
  sessionStorage.setItem(viewTagsKey, JSON.stringify(data))
}

// App
const fixHeaderKey = 'fixHeader'
export const getfixHeader = () => localStorage.getItem(fixHeaderKey)
export const setfixHeader = (fixHeader: boolean) => localStorage.setItem(fixHeaderKey, fixHeader ? '1' : '0')

const showTagViewsKey = 'showTagViews'
export const getshowTagViews = () => localStorage.getItem(showTagViewsKey)
export const setshowTagViews = (showTagViews: boolean) => localStorage.setItem(showTagViewsKey, showTagViews ? '1' : '0')

const siderbarLogoKey = 'showSiderBarLogo'
export const getshowSiderbarLogo = () => localStorage.getItem(siderbarLogoKey)
export const setshowSiderbarLogo = (value: boolean) => localStorage.setItem(siderbarLogoKey, value ? '1' : '0')

const sizeKey = 'size'
export const getSize = () => localStorage.getItem(sizeKey)
export const setSize = (size: string) => localStorage.setItem(sizeKey, size)

const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => localStorage.getItem(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => localStorage.setItem(sidebarStatusKey, sidebarStatus)

const themeKey = 'theme'
export const setTheme = (theme: string) => localStorage.setItem(themeKey, theme)
export const getTheme = () => localStorage.getItem(themeKey)

const allDistrictsKey = 'all_districts_cache'
export const setAllDistricts = (data: Districts[]) => localStorage.setItem(allDistrictsKey, JSON.stringify(data))
export const getAllDistricts = () => {
  let result: Districts[] | null = null
  try {
    result = JSON.parse(localStorage.getItem(allDistrictsKey) || '[]')
  } catch (error) {
    result = []
  }
  return result
}

const DistrictsKey = 'district_cache'
export const setDistrict = (data: Districts, code: number) => {
  const allData: { [key: number]: Districts } = getAllDistrict()
  allData[code] = data
  sessionStorage.setItem(DistrictsKey, JSON.stringify(allData))
}
export const getAllDistrict = (): { [key: number]: Districts } => {
  try {
    const data = JSON.parse(sessionStorage.getItem(DistrictsKey) || '{}')
    return data
  } catch (error) {
    return {}
  }
}
export const getDistrict = (code: number): Districts | null => {
  try {
    const data = JSON.parse(sessionStorage.getItem(DistrictsKey) || '{}')
    return data[code] || null
  } catch (error) {
    return null
  }
}

export const setStorage = (data: any) => {
  const key = md5(`Storage${Date.now()}`)
  return new Promise<string>((resolve, reject) => {
    if (typeof data === 'object' && data !== null) {
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch (error) {
        return reject(error)
      }
    } else {
      localStorage.setItem(key, data)
    }

    return resolve(key)
  })
}

export const setStorageJson = (data: any) => {
  return setStorage(data)
}

export const getStorageJson = <T = any>(key: string) => {
  return new Promise<T | null>((resolve, reject) => {
    let result: any = null
    if (!key) return resolve(null)
    try {
      result = JSON.parse(localStorage.getItem(key) || '')
      if (typeof result !== 'object') return resolve(null)
    } catch (error) {
      reject(error)
    }
    return resolve(result)
  })
}
export const getStorage = (key: string) => {
  return new Promise((resolve, reject) => {
    try {
      if (!key) return resolve(null)
      const result = localStorage.getItem(key)
      return resolve(result)
    } catch (error) {
      return reject(error)
    }
  })
}
