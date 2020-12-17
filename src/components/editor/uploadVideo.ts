
import { Message, Notice } from 'view-design'
import E from 'wangeditor'
import { config } from './video'

class UploadVideo {
  constructor(public editor: E) {
    this.editor = editor
  }

  uploadVideo(files: File[]) {
    if (!files || !files.length) {
      return
    }

    // ------------------------------ 获取配置信息 ------------------------------
    const editor = this.editor
    let uploadVideoServer = config.uploadVideoServer

    const maxSize = config.uploadVideoMaxSize
    const maxSizeM = maxSize / 1024 / 1024
    const maxLength = config.uploadVideoMaxLength || 10000
    const uploadFileName = config.uploadFileName || ''
    const uploadVideoParams: { [key: string]: any } = config.uploadVideoParams || {}
    const uploadVideoParamsWithUrl = config.uploadVideoParamsWithUrl
    const uploadVideoHeaders: { [key: string]: any } = config.uploadVideoHeaders || {}
    const hooks = config.uploadVideoHooks || {}
    const timeout = config.uploadVideoTimeout || 30 * 60 * 1000 // 30分钟
    let withCredentials = config.withCredentials
    if (withCredentials == null) {
      withCredentials = false
    }
    const customUploadVideo = config.customUploadVideo

    if (!customUploadVideo) {
      // 没有 customUploadVideo 的情况下，需要如下两个配置才能继续进行图片上传
      if (!uploadVideoServer) {
        return
      }
    }

    // ------------------------------ 验证文件信息 ------------------------------
    const resultFiles: any[] = []
    const errInfo: any[] = []
    files.forEach(file => {
      const name = file.name
      const size = file.size

      // chrome 低版本 name === undefined
      if (!name || !size) {
        return
      }

      if (/\.(mp4|mov|m4v|3gp|avi|m3u8|mkv|flv|mov)$/i.test(name) === false) {
        // 后缀名不合法，不是视频
        errInfo.push('\u3010' + name + '\u3011\u4e0d\u662f\u89c6\u9891')
        return
      }
      if (maxSize < size) {
        // 上传视频过大
        errInfo.push('\u3010' + name + '\u3011\u5927\u4E8E ' + maxSizeM + 'M')
        return
      }

      // 验证通过的加入结果列表
      resultFiles.push(file)
    })

    // 抛出验证信息
    if (errInfo.length) {
      Message.error('视频验证未通过: \n' + errInfo.join('\n'))
      return
    }
    if (resultFiles.length > maxLength) {
      Message.error('一次最多上传' + maxLength + '个视频')
      return
    }

    // ------------------------------ 自定义上传 ------------------------------
    if (customUploadVideo && typeof customUploadVideo === 'function') {
      customUploadVideo(resultFiles, this.insertLinkVideo.bind(this))

      // 阻止以下代码执行
      return
    }

    // 添加图片数据
    const formdata = new FormData()
    resultFiles.forEach(file => {
      const name = uploadFileName || file.name
      formdata.append(name, file)
    })

    // ------------------------------ 上传图片 ------------------------------
    if (uploadVideoServer && typeof uploadVideoServer === 'string') {
      // 添加参数
      const uploadVideoServerArr = uploadVideoServer.split('#')
      uploadVideoServer = uploadVideoServerArr[0]
      const uploadVideoServerHash = uploadVideoServerArr[1] || ''
      for (const key in uploadVideoParams) {
        const val = uploadVideoParams[key]
        // 因使用者反应，自定义参数不能默认 encode ，由 v3.1.1 版本开始注释掉
        // val = encodeURIComponent(val)

        // 第一，将参数拼接到 url 中
        if (uploadVideoParamsWithUrl) {
          if (uploadVideoServer.indexOf('?') > 0) {
            uploadVideoServer += '&'
          } else {
            uploadVideoServer += '?'
          }
          uploadVideoServer = uploadVideoServer + key + '=' + val
        }

        // 第二，将参数添加到 formdata 中
        formdata.append(key, val)
      }

      if (uploadVideoServerHash) {
        uploadVideoServer += '#' + uploadVideoServerHash
      }

      // 定义 xhr
      const xhr = new XMLHttpRequest()
      xhr.open('POST', uploadVideoServer)

      // 设置超时
      xhr.timeout = timeout
      xhr.ontimeout = function() {
        // hook - timeout
        if (hooks.timeout && typeof hooks.timeout === 'function') {
          hooks.timeout(xhr, editor)
        }

        Message.error('上传视频超时')
      }

      // 监控 progress
      if (xhr.upload) {
        xhr.upload.onprogress = function(e) {
          // let percent = 0
          // 进度条
          if (e.lengthComputable) {
            // percent = e.loaded / e.total
            // progressBar.show(percent)
            // LoadingBar.start
          }
        }
      }

      // 返回数据
      xhr.onreadystatechange = () => {
        let result: any = null
        if (xhr.readyState === 4) {
          if (xhr.status < 200 || xhr.status >= 300) {
            // hook - error
            if (hooks.error && typeof hooks.error === 'function') {
              hooks.error(xhr, editor)
            }

            // xhr 返回状态错误
            Notice.error({ title: '上传视频发生错误', desc: '\u4E0A\u4F20\u56FE\u7247\u53D1\u751F\u9519\u8BEF\uFF0C\u670D\u52A1\u5668\u8FD4\u56DE\u72B6\u6001\u662F ' + xhr.status })
            return
          }

          result = xhr.responseText
          if ((typeof result === 'undefined' ? 'undefined' : typeof result) !== 'object') {
            try {
              result = JSON.parse(result)
            } catch (ex) {
              // hook - fail
              if (hooks.fail && typeof hooks.fail === 'function') {
                hooks.fail(xhr, editor, result)
              }

              Notice.error({ title: '上传视频失败', desc: '上传视频返回结果错误，返回结果是: ' + result })
              return
            }
          }
          if (!hooks.customInsert && +result.errno !== 0) {
            // hook - fail
            if (hooks.fail && typeof hooks.fail === 'function') {
              hooks.fail(xhr, editor, result)
            }

            // 数据错误
            Notice.error({ title: '上传视频失败', desc: '上传视频返回结果错误，返回结果 errno=' + result.errno })
          } else {
            if (hooks.customInsert && typeof hooks.customInsert === 'function') {
              // 使用者自定义插入方法
              hooks.customInsert(this.insertLinkVideo.bind(this), result)
            } else {
              // 将图片插入编辑器
              const data = result.data || []
              data.forEach((link: string) => {
                this.insertLinkVideo(link)
              })
            }

            // hook - success
            if (hooks.success && typeof hooks.success === 'function') {
              hooks.success(xhr, editor, result)
            }
          }
        }
      }

      // hook - before
      if (hooks.before && typeof hooks.before === 'function') {
        const beforeResult: any = hooks.before(xhr, editor, resultFiles)
        if (beforeResult && (typeof beforeResult === 'undefined' ? 'undefined' : typeof beforeResult) === 'object') {
          if (beforeResult.prevent) {
            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            Message.info(beforeResult.msg)
            return
          }
        }
      }

      // 自定义 headers
      for (const key in uploadVideoHeaders) {
        const val = uploadVideoHeaders[key]
        xhr.setRequestHeader(key, val)
      }

      // 跨域传 cookie
      xhr.withCredentials = withCredentials

      // 发送请求
      xhr.send(formdata)
    }
    this.insertLinkVideo('http://192.168.1.109:5000/tmp/1607415202575.mp4')
  }

  insertLinkVideo(link: string) {
    if (!link) return

    const editor = this.editor

    // 校验格式
    const linkVideoCheck = config.linkVideoCheck
    let checkResult = ''
    if (linkVideoCheck && typeof linkVideoCheck === 'function') {
      checkResult = linkVideoCheck(link)
      if (checkResult) {
        // 校验失败，提示信息
        Message.error(checkResult)
        return
      }
    }
    const html = `
      <iframe src="${link}" style="width: 100%; max-width: 100%; height: auto; display: block" controls autobuffer autoplay muted ></iframe>
    `
    editor.customConfig.inserVideoCallback && editor.customConfig.inserVideoCallback(link)
    editor.cmd.do('insertHTML', html)
  }
}

export default UploadVideo
