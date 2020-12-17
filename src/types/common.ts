export interface SelectOption<T = string | number> {
  label: string
  value: T
}

export interface SelectTreeOption extends SelectOption {
  children?: SelectTreeOption[]
}

export interface QueryList<T = any[] | null> {
  pageNum: number
  pageSize: number
  totalSize: number
  totalPages: number
  content: T
}

export interface Response<T = any> {
  code: number | string
  data: T
  msg: string
}

export interface UploadExcelResponse { results: any, header: string[] }

export interface TabItem {
  code: string
  title: string
  type?: Type
}
export type TabList = Array<TabItem>

export type Type = 'create' | 'edit' | 'detail'

export type Size = 'large' | 'default' | 'small'

export interface ListQuery<T = any> {
  currentPage: number
  pageSize: number
  totalNum: number
  isMore: number
  totalPage: number
  startIndex: number
  items: T
}

export interface Districts {
  id: number
  name: string
  code: number
  parentid: number
  typeid: number
}

export interface DicList {
  id?: number
  del?: number

  tenantId?: string
  operator?: string

  code: string
  dicType: 1 | 2 | null
  parentCode: string
  sort: number
  typeName: string
}

export interface RecordList<T> {
  records: T
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}
