/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { Response } from '@/types/common'
import { imgUrl } from '@/network'
import { baseURL } from '@/network/request'
import { Message } from 'view-design'
import { Vue, Component, Ref, Model, Prop } from 'vue-property-decorator'
import E from 'wangeditor'
import VideoPanel from './video'
const maxZIndex = 10010

@Component({})
export default class Editor extends Vue {
  @Prop({ required: false, default: 10000, type: Number, validator: (v: number) => { return v <= maxZIndex } }) private readonly zIndex!: number
  @Prop({ required: true, default: '', type: String }) private readonly id!: string
  @Ref('editorRef') private readonly editorRef!: HTMLDivElement | null
  @Model('change', { required: false, default: '' }) private readonly value!: string
  @Prop({ default: false }) private readonly disabled!: boolean

  private editor: E | null = null

  public setValue(value: string) {
    if (this.disabled) {
      if (this.editorRef) {
        this.editorRef.innerHTML = value
      }
    } else {
      if (value && this.editor) {
        // eslint-disable-next-line no-useless-escape
        this.editor.txt.html(value.replace(/\<o\:p\>/g, '').replace(/\<\/o\:p\>/g, '').replace(/(&amp;)/g, '&').replace(/(&quot;;)/g, '"').replace(/(&quot;)/g, '"').replace(/(§&nbsp;)/g, ' ').replace(/(&gt;)/g, '>').replace(/(&lt;)/g, '<'))
      }
    }
  }

  private get height() {
    return window.innerHeight - 180 <= 600 ? 600 : window.innerHeight - 180
  }

  @Prop({}) private onImgUploadedHandle!: Function
  @Prop({}) private onVideoUploadedHandle!: Function
  mounted() {
    if (!this.disabled) {
      const editor = new E('#' + this.id)
      this.editor = editor
      // 基本设置
      editor.config.zIndex = this.zIndex || 10000
      editor.config.height = this.height

      // 注册菜单
      const menuKey = 'customVideoKey' // 菜单 key ，各个菜单不能重复
      editor.menus.extend('customVideoKey', VideoPanel)

      // 设置菜单
      editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'list',
        'justify',
        'quote',
        'emoticon',
        'image',
        menuKey,
        'splitLine',
        'undo',
        'redo'
      ]

      // 上传图片相关
      editor.config.uploadImgServer = baseURL + '/api/upload/files?type=4'
      editor.config.uploadFileName = 'files'
      editor.config.uploadImgMaxLength = 1 // 一次最多上传 1 个图片
      editor.config.uploadImgParams = {
      }
      editor.config.uploadImgHeaders = {
        // token: AccountModule.userInfo ? AccountModule.userInfo.token : ''
      }
      editor.config.uploadImgTimeout = 60 * 1000
      editor.config.uploadImgHooks = {
        // 上传图片出错，一般为 http 请求的错误
        error: (/* xhr, editor, resData */) => {
          Message.error('上传图片出错了！')
        },
        // 上传图片超时
        timeout: () => {
          Message.error('上传图片超时了！')
        },
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        customInsert: (insertImgFn: any, result: any) => {
          // result 即服务端返回的接口
          if (+result.code === 1) {
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            insertImgFn(`${imgUrl}${result.data[0]}`)
            this.onImgUploadedHandle && this.onImgUploadedHandle(result.data)
          } else {
            Message.error(result.msg)
          }
        }
      }

      editor.config.onchange = this.change
      editor.customConfig = {
        ...editor.customConfig || {}
      }
      editor.customConfig.inserVideoCallback = (link: string) => {
        this.onVideoUploadedHandle && this.onVideoUploadedHandle(link)
      }

      // 关闭全屏功能
      editor.config.showFullScreen = false
      // editor.txt.eventHooks.toolbarClickEvents.push((e: any | MouseEvent) => {
      //   const fullscreenEl = document.querySelector<HTMLDivElement>(`#${this.id} .w-e-menu .w-e-icon-fullscreen`)
      //   const fullscreenExitEl = document.querySelector<HTMLDivElement>(`#${this.id} .w-e-menu .w-e-icon-fullscreen_exit`)
      //   if (e.target) {
      //     if (fullscreenEl && fullscreenEl.parentNode && fullscreenEl.parentNode.contains(e.target as HTMLDivElement)) {
      //       this.$nextTick(() => {
      //         const editorRef = document.querySelector<HTMLDivElement>(`#${this.id}`)
      //         console.log('退出全屏幕')
      //         if (editorRef) {
      //           editorRef.style.zIndex = `${this.zIndex}`
      //         }
      //       })
      //     } else if (fullscreenExitEl && fullscreenExitEl.parentNode && fullscreenExitEl.parentNode.contains(e.target as HTMLDivElement)) {
      //       this.$nextTick(() => {
      //         const editorRef = document.querySelector<HTMLDivElement>(`#${this.id}`)
      //         console.log('进入全屏幕')
      //         if (editorRef) {
      //           editorRef.style.zIndex = `${maxZIndex}`
      //         }
      //       })
      //     }
      //   }
      // })

      editor.create()
    }
  }

  public beforeDestroy() {
    this.editor && this.editor.destroy()
  }

  private _value = this.value
  change(html: string) {
    this._value = html
    // 输入的内容长度
    // this.editor!.txt.text()
    this.$emit('change', html)
    // console.log(html)
  }
}
