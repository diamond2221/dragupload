import { getFullDateTime } from '@/utils/date'
import { Cash } from '@/types/order'
import { ECash } from '@/enums/common'

// Set utils function parseTime to filter
export { parseTime } from '@/utils'

// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const parseFullDateTime = (time: string) => {
  return getFullDateTime(time, '-')
}

/**
 * 转换结算方式
 * @param cash
 */
export const transCashFilter = (cash: Cash) => {
  return ECash[cash - 1]
}
