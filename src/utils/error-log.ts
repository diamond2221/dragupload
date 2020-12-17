import Vue from 'vue'
import { ErrorLogModule } from '@/store/modules/error-log'
import { isArray } from '@/utils/validate'
import settings from '@/settings'
import { Message } from 'view-design'

const { errorLog: needErrorLog } = settings

const checkNeed = () => {
  const env = process.env.NODE_ENV
  if (isArray(needErrorLog) && env) {
    return needErrorLog.includes(env)
  }
  return false
}

function errorHandler(err: Error, vm: Vue, info: string) {
  if (err.message?.includes('没有通过校验')) return
  Message.error('页面出错了')
  ErrorLogModule.AddErrorLog({
    err,
    vm,
    info,
    url: window.location.href,
    type: 'page'
  })
}
if (checkNeed()) {
  Vue.config.errorHandler = errorHandler
}

Vue.prototype.$throw = function(this: Vue, error: Error) { errorHandler(error, this, '出错了') }
