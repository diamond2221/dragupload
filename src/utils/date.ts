import { parseTime } from './index'

/**
 * 完整年月日时分秒
 * @param time
 */
export const getFullTime = (time?: object | string | number | null) => {
  return parseTime(time, '{h}:{i}:{s}')
}

/**
 * 完整年月日时分秒
 * @param time
 */
export const getTime = (time?: object | string | number | null) => {
  return parseTime(time, '{h}:{i}')
}

/**
 * 完整年月日时分秒
 * @param time
 */
export const getFullDateTime = (time?: object | string | number | null, symbol: '/' | '-' = '-') => {
  return parseTime(time, `{y}${symbol}{m}${symbol}{d} {h}:{i}:{s}`)
}

/**
 * 完整年月日时分
 * @param time
 */
export const getDateTime = (time?: object | string | number | null) => {
  return parseTime(time, '{y}-{m}-{d} {h}:{i}')
}

/**
 * 完整年月日
 * @param time
 */
export const getDate = (time?: object | string | number | null, symbol: '/' | '-' = '-') => {
  return parseTime(time, `{y}${symbol}{m}${symbol}{d}`)
}

/**
 * 年
 * @param time
 */
export const getYear = (time?: object | string | number | null) => {
  return parseTime(time, '{y}')
}

/**
 * 月
 * @param time
 */
export const getMonth = (time?: object | string | number | null) => {
  return parseTime(time, '{m}')
}

/**
 * 日
 * @param time
 */
export const getDay = (time?: object | string | number | null) => {
  return parseTime(time, '{d}')
}

/**
 *
 * @param ds [2020, 11, 09, 15, 20]
 * @param symbol
 * @returns 2020-11-09 15:20
 */
export const joinDate = (ds: (string | number)[] | string | null | void, symbol: '/' | '-' = '-') => {
  if (typeof ds === 'string' || !ds) {
    return ''
  }
  if (ds.length === 6) {
    return `${ds[0]}${symbol}${formatNumber(ds[1])}${symbol}${formatNumber(ds[2])} ${formatNumber(ds[3])}:${formatNumber(ds[4])}:${formatNumber(ds[5])}`
  } else if (ds.length === 5) {
    return `${ds[0]}${symbol}${formatNumber(ds[1])}${symbol}${formatNumber(ds[2])} ${formatNumber(ds[3])}:${formatNumber(ds[4])}`
  } else if (ds.length === 3) {
    return `${ds[0]}${symbol}${formatNumber(ds[1])}${symbol}${formatNumber(ds[2])}`
  }

  return ''
}

export const formatNumber = (n: number | string) => {
  const v = n.toString()
  return v[1] ? v : '0' + v
}
