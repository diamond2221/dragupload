import { DirectiveOptions } from 'vue'
import { throttle as throttleHandle } from '@/utils/index'

export const throttle: DirectiveOptions = {
  bind(el, binding) {
    let executeFunction
    if (binding.value instanceof Array) {
      const [func, timer] = binding.value
      executeFunction = throttleHandle(func, timer)
    } else {
      console.error('throttle指令绑定的参数必须是数组，且需执行的事件类型或函数或时间间隔不能为空')
      return
    }
    el.addEventListener('click', executeFunction)
  }
}
