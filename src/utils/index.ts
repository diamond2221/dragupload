import md5 from './md5'

// Parse the time to string
export const parseTime = (
  time?: object | string | number | null,
  cFormat?: string
): string | null => {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

export const encrypt = (param: { [key: string]: any }, isBig = true) => {
  const { body, ...querys } = param
  // console.log('querys', querys, 'body', body)
  const secret = 'saas'
  let paramsString = `${secret}`
  const queryArr = Object.keys(querys).sort()
  queryArr.forEach(item => {
    paramsString += `${item}${querys[item]}`
  })
  if (body && (Object.entries(body).length || Array.isArray(body))) {
    paramsString += `${JSON.stringify(body)}`
  }
  paramsString += secret
  // console.log(querys, queryArr, paramsString)
  paramsString = isBig ? md5(paramsString).toUpperCase() : md5(paramsString).toLowerCase()
  return paramsString
}

export function debounce(fn: Function, waitTime = 300) {
  let _timer: any = null
  return function(this: any, ...arg: any[]) {
    if (_timer) {
      clearTimeout(_timer)
    }
    _timer = setTimeout(fn.bind(this, ...arg), waitTime)
  }
}

export function throttle(fn: Function, gapTime = 1500) {
  let _lastTime: any = null

  // 返回新的函数
  return function(this: any, ...args: any[]) {
    const _nowTime = +new Date()

    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, args) // 将this和参数传给原函数

      _lastTime = _nowTime
    }
  }
}

/**
 * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * floatObj.add(0.1, 0.2) >> 0.3
 * floatObj.multiply(19.9, 100) >> 1990
 *
 */
const floatObj = function() {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj: number) {
    return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum: number) {
    const ret = { times: 1, num: 0 }
    const isNegative = floatNum < 0
    if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    const strfi = floatNum + ''
    const dotPos = strfi.indexOf('.')
    const len = strfi.substr(dotPos + 1).length
    const times = Math.pow(10, len)
    let intNum = parseInt((Math.abs(floatNum) * times + 0.5).toString(), 10)
    ret.times = times
    if (isNegative) {
      intNum = -intNum
    }
    ret.num = intNum
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a: number, b: number, op: 'add' | 'subtract' | 'multiply' | 'divide' /* , _digits?: number */) {
    const o1 = toInteger(a)
    const o2 = toInteger(b)
    const n1 = o1.num
    const n2 = o2.num
    const t1 = o1.times
    const t2 = o2.times
    const max = t1 > t2 ? t1 : t2
    let result: number | null = null
    switch (op) {
      case 'add':
        if (t1 === t2) { // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) { // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else { // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max
      case 'multiply':
        result = (n1 * n2) / (t1 * t2)
        return result
      case 'divide':
        if (n2 === 0) {
          return 0
        }
        result = (n1 / n2) * (t2 / t1)
        return result
    }
  }

  // 加减乘除的四个接口
  function add(a: number, b: number) { // digits?: number
    return operation(a, b, 'add') // digits
  }
  function subtract(a: number, b: number) { // digits?: number
    return operation(a, b, 'subtract') // digits
  }
  function multiply(a: number, b: number) { // digits?: number
    return operation(a, b, 'multiply') // digits
  }
  function divide(a: number, b: number) { // digits?: number
    return operation(a, b, 'divide') // digits
  }

  // exports
  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide
  }
}

export const { add, subtract, multiply, divide } = floatObj()
/**
 *
 * @param value 转换一个值 并判断是不是NAN
 */
export const transValueAndCheckIsNaN = (value: string | number) => {
  if (window.isNaN(Number(value))) {
    return false
  } else {
    return true
  }
}

export const genCode = (str = '') => {
  return md5(`${Date.now()}${(Math.random() * 10000).toString().slice(0, 3)}${str}`)
}

export const toAccountSystem = () => {
  const originUrl = process.env.NODE_ENV === 'production' ? '//wanwu.shanghe.link/#/' : '//localhost:8084/#/'
  const toUrl = process.env.NODE_ENV === 'production' ? '//op.shanghe.link/#/' : '//localhost:8080/#/'
  const toPath = 'account/login'

  const href = `${toUrl}${toPath}?fromPath=${encodeURIComponent(originUrl)}`
  location.href = href
}
