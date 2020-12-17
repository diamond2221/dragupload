// 获取手机号码的功能
/**
 * ios系统获取手机号,尤其从通讯录中粘贴过来的话,会
 * 携带其他信息,因此不能正确获取手机号,
 * 所以用此方法
 * */
export const getMobilePhone = (params: string) => {
  const value = params.replace(/[^0-9]/ig, '')
  return value
}
// 去除字符串中间的空(用空格替换空)
export const deletSpaceInStr = (params: string) => {
  const paramsStr = params.replace(/\s/g, '')
  return paramsStr
}
// 检验手机号的正则表达式;
export const checkMobileReg = (params: string) => {
  const reg = /^1[3|4|5|6|8|7|9][0-9]\d{8}$/
  // const reg = /^1[3|4|5|6|8|7|9][0-9]\d{4,8}$/

  // 返回布尔值
  return reg.test(params)
}
export function phoneValidtor(rule: any, value: string, callback: (p?: any) => void) {
  if (value) {
    if (checkMobileReg(value)) {
      callback()
    } else {
      callback(new Error('请输入正确格式的手机号'))
    }
  } else {
    callback()
  }
}

// 手机号码和电话号码进行同时验证的正则表达式
export const checkConcactInfoReg = (params: string) => {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
  // 返回布尔值
  return reg.test(params)
}
// 检验身份证的正则表达式;
export const checkIdNumReg = (params: string) => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  // 返回布尔值
  return reg.test(params)
}
// 验证邮箱地址
export const checkEmailReg = (params: string) => {
  // 验证邮箱地址填写是否正确
  const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  // 返回布尔值
  return reg.test(params)
}

// 验证只能是汉字
export const checkChineseReg = (params: string) => {
  const reg = /^[\u4e00-\u9fa5]{0,}$/
  // 返回布尔值
  return reg.test(params)
}
// 以汉字或字母开头
export const checkFirstReg = (params: string) => {
  const reg = /^[\u4E00-\u9FA5A-Za-z]/
  return reg.test(params)
}
// 判断是否为字母
export const checkPatternReg = (params: string) => {
  // 是否为字母
  const reg = /^[a-zA-Z]*$/
  return reg.test(params)
}
// 验证输入的是否为金额,即输入的是否为金额
export const checkMoneyReg = (params: string) => {
  // 验证是否为两位小数
  const reg = /^\d*(?:\.\d{0,2})?$/
  // 返回布尔值
  return reg.test(params)
}
// 保留四位小数
export const checkMoneyRegFour = (params: string) => {
  // 验证是否为两位小数
  const reg = /^\d*(?:\.\d{0,4})?$/
  // 返回布尔值
  return reg.test(params)
}
export const checkMathParseInt = (params: string) => {
  // 验证是否正整数
  // let reg = /^([1-1000])$/;
  const reg = /^[1-9][0-9]*$/
  // 返回布尔值
  return reg.test(params)
}
// 验证是否为车牌号码,
export const checkCarCardReg = (params: string) => {
  //  验证车牌号
  const reg = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z0-9]{4,5}[a-zA-Z0-9\u4e00-\u9fa5]$|^[a-zA-Z]{2}\d{7,8}$ /
  return reg.test(params)
}
// 验证银行卡号
export const checkBankCardReg = (params: string) => {
  // 验证银行卡
  const reg = /^([0-9]{1})(\d{14}|\d{18})$/
  return reg.test(params)
}
// 只能输入数字或两位位小数
export const keepDecimal2 = (params: string) => {
  const reg = /^[0-9]+(?:\.\d{0,2})?$/
  return reg.test(params)
}
// 只能输入数字或一位小数
export const keepDecimal1 = (params: string) => {
  const reg = /^[0-9]+(?:\.\d{0,1})?$/
  return reg.test(params)
}
// 验证车架号17位--字母和数字组合
export const vinTest = (params: string) => {
  const reg = /^[0-9a-zA-Z]{17}$/
  return reg.test(params)
}
// 验证发动机号10位--字母和数字组合
export const engineTest = (params: string) => {
  const reg = /^[0-9a-zA-Z]{1,20}$/
  return reg.test(params)
}
