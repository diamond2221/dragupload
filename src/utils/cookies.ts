import Cookies from 'js-cookie'

// User 暂不使用
const tokenKey = '56token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)
