/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUploadVideoProgress, uploadVideoNormal, uploadVideoUrl } from '@/network/video'
import { LoadingBar, Message, Notice } from 'view-design'
import E from 'wangeditor'
import UploadVideo from './uploadVideo'
import { encrypt, genCode } from '@/utils/index'
import md5 from '@/utils/md5'
import { imgUrl } from '@/network'
import { setTimeout } from 'timers'
import { HTTP } from '@/network/request'

const { $, PanelMenu, Panel } = E
export const config = {
  uploadVideoParamsWithUrl: '',
  withCredentials: false,
  linkVideoCheck: null as null | Function,
  uploadFileName: 'file',
  // 是否显示添加网络视频的 tab
  showLinkVideo: true,

  // 插入网络视频的回调
  linkVideoCallback: function linkVideoCallback(_url: any) {
    // console.log(url)  // url 即插入视频的地址
  },

  // 默认上传视频 max size: 512M
  uploadVideoMaxSize: 512 * 1024 * 1024,

  // 配置一次最多上传几个视频
  uploadVideoMaxLength: 1,

  // 上传视频的自定义参数
  uploadVideoParams: {
    // token: 'abcdef12345'
  },

  // 上传视频的自定义header
  uploadVideoHeaders: {
    // 'Accept': 'text/x-json'
  },

  // 自定义上传视频超时时间 30分钟
  uploadVideoTimeout: 30 * 60 * 1000,

  // 上传视频 hook
  uploadVideoHooks: {
    // customInsert: function (insertLinkVideo, result, editor) {
    //     console.log('customInsert')
    //     // 视频上传并返回结果，自定义插入视频的事件，而不是编辑器自动插入视频
    //     const data = result.data1 || []
    //     data.forEach(link => {
    //         insertLinkVideo(link)
    //     })
    // },
    before: function before(_xhr: any, _editor: any, _files: any) {
      // 视频上传之前触发

      // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
      // return {
      //     prevent: true,
      //     msg: '放弃上传'
      // }
    },
    success: function success(_xhr: any, _editor: any, _result: any) {
      // 视频上传并返回结果，视频插入成功之后触发
    },
    fail: function fail(_xhr: any, _editor: any, _result: any) {
      // 视频上传并返回结果，但视频插入错误时触发
    },
    error: function error(_xhr: any, _editor: any) {
      // 视频上传出错时触发
    },
    timeout: function timeout(_xhr: any, _editor: any) {
      // 视频上传超时时触发
    },
    // 上传完成处理方法
    customInsert: function(insertVideo: any, result: any) {
      if (result.ret === 200) {
        (result.data || '').split(',').forEach((link: string) => {
          link && insertVideo(link)
        })
      } else {
        Message.error('上传失败')
      }
    }
  },
  customUploadVideo: async(resultFiles: File[], insertVideo: (link: string) => void) => {
    const file = resultFiles[0]
    const formdata = new FormData()
    formdata.append('file', file)
    const fileKey = await genMd5StrByFile(file)
    let done = false
    uploadVideoNormal(fileKey, formdata).then(({ data }) => {
      insertVideo(`${imgUrl}${data.fileName}`)
      done = true
      setNotice(100, 'success')
      Notice.destroy()
      Message.success('视频上传成功')
    }).catch(() => {
      Notice.destroy()
      done = true
      setNotice(null, 'wrong')
    })
    // let prc = 0
    const getProgress = (fileKey: string) => {
      setTimeout(() => {
        getUploadVideoProgress(fileKey).then(({ data }) => {
          if (done) return

          // prc = prc + 4
          setNotice(Math.floor(data / file.size * 100), 'active')
          getProgress(fileKey)
        }).catch(() => {
          if (done) return
          getProgress(fileKey)
        })
      }, 1500)
    }

    function cancelUploadHandle() {
      HTTP.queue.find(v => v.config && v.config.url?.endsWith('/api/upload/video'))?.cancel()
      setNotice(null, 'wrong')
    }

    function setNotice(percent: number | null, status: 'normal' | 'active' | 'wrong' | 'success', time?: number) {
      Notice.close('uploadVideo')

      if (typeof percent !== 'number') {
        return
      }
      Notice.info({
        title: '视频正在上传中……',
        duration: time ?? 30 * 60,
        name: 'uploadVideo',
        render: h => {
          if (!h) return null as unknown as any
          return h('div', [
            h('Progress', {
              props: {
                percent,
                status
              }
            }),
            h('Poptip', {
              props: {
                confirm: true,
                title: '确定取消上传？',
                transfer: true
              },
              on: {
                'on-ok': cancelUploadHandle
              }
            }, [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginTop: '10px'
                }
              }, [
                '取消上传'
              ])
            ])
          ])
        }
      })
    }
    setNotice(0, 'active')
    getProgress(fileKey)
  },
  // 视频上传
  uploadVideoServer: '' // 上传接口
}

export function genMd5StrByFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    resolve(getRandom(file.name + Date.now()))
    return
    const f = new FileReader()
    f.readAsBinaryString(file)
    f.onload = e => {
      const fileKey = md5(e.target?.result as string || genCode(`${Date.now()}`))
      resolve(fileKey)
    }
    f.onerror = e => {
      const fileKey = md5(genCode(`${Date.now()}`))
      resolve(fileKey)
    }
  })
}

/**
 * 获取随机字符
 * @param prefix 前缀
 */
export function getRandom(prefix = ''): string {
  return prefix + Math.random().toString().slice(2)
}

export interface MenuActive {
  /**
   * 修改菜单激活状态，菜单是否高亮
   */
  tryChangeActive(): void
}

class Video extends PanelMenu implements MenuActive {
  constructor(editor: E) {
    const $elem = $(
      `<div class="w-e-menu">
                <i class="w-e-icon-play"></i>
            </div>`
    )
    super($elem, editor)
  }

  /**
   * 菜单点击事件
   */
  public clickHandler(): void {
    // 弹出 panel
    this.createPanel()
  }

  /**
   * 创建 panel
   * @param link 链接
   */
  private createPanel(): void {
    const editor = this.editor

    // 创建 id
    // 上传视频id
    const upTriggerVideoId = getRandom('up-trigger-video')
    const upFileVideoId = getRandom('up-file-video')
    // 插入视频id
    const textValId = getRandom('text-val')
    const btnId = getRandom('btn')

    // tabs 的配置
    const tabsConfig = [
      {
        title: '上传视频',
        tpl: `<div class="w-e-up-img-container"><div id="${upTriggerVideoId}" class="w-e-up-btn"><i class="w-e-icon-upload2"></i></div><div style="display:none;"><input id="${upFileVideoId}" type="file" ${config.uploadVideoMaxLength > 1 ? 'multiple="multiple"' : ''} accept="application/video/*"/></div></div>`,
        events: [{
          // 触发选择图片
          selector: '#' + upTriggerVideoId,
          type: 'click',
          fn: function fn() {
            const $file: any = document.querySelector<HTMLInputElement>('#' + upFileVideoId)

            if ($file) {
              $file.click()
            } else {
              // 返回 true 可关闭 panel
              return true
            }
          }
        }, {
          // 选择图片完毕
          selector: '#' + upFileVideoId,
          type: 'change',
          fn: () => {
            const $file: any = document.querySelector<HTMLInputElement>('#' + upFileVideoId)
            if (!$file) {
              // 返回 true 可关闭 panel
              return true
            }

            // 获取选中的 file 对象列表
            const fileList = $file.files
            if (fileList.length) {
              new UploadVideo(this.editor).uploadVideo(fileList)
            }

            // 返回 true 可关闭 panel
            return true
          }
        }]
      }, // first tab end
      {
        // 标题
        title: '插入视频',
        // 模板
        tpl: '<div><input id="' + textValId + '" type="text" class="block" placeholder="放入视频的网络地址"/><div class="w-e-button-container"><button id="' + btnId + '" class="right">\u63D2\u5165</button></div></div>',
        // 事件绑定
        events: [{
          selector: '#' + btnId,
          type: 'click',
          fn: () => {
            const $text = $('#' + textValId)
            const val = $text.val().trim()

            if (val) this.insert(val) // 插入视频

            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
            return true
          }
        }]
      } // second tab end
    ] // tabs end

    // 判断 tabs 的显示
    const tabsConfigResult = []
    if (config.uploadVideoServer || config.customUploadVideo) {
      // 显示“上传视频”
      tabsConfigResult.push(tabsConfig[0])
    }
    if (config.showLinkVideo) {
      // 显示“网络视频”
      tabsConfigResult.push(tabsConfig[1])
    }

    // 创建 panel
    const panel = new Panel(this, {
      width: 350,
      height: 0,
      // 一个 panel 多个 tab
      tabs: tabsConfigResult // tabs end
    }) // panel end

    // 显示 panel
    panel.create()

    // 记录属性
    this.panel = panel
  }

  private insert(value: string) {
    const html = `<iframe src="${value}" style="width: 100%; max-width: 100%; height: auto; display: block" controls autobuffer autoplay muted></iframe>`
    this.editor.cmd.do('insertHTML', html)
  }

  /**
   * 尝试修改菜单 active 状态
   */
  public tryChangeActive() {
    //
  }
}

export default Video
