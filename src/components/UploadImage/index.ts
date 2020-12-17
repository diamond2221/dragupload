import { Vue, Component, Prop, Ref, Model, Watch } from 'vue-property-decorator'
import { compressAccurately } from 'image-conversion'
import { Response } from '@/types/common'
import { imgPath } from '@/network/index'
import { uploadImages } from '@/network//upload'
import { genCode } from '@/utils'
import { Message, Notice } from 'view-design'
export interface UploadFileResponse {
  fileName: string
}
export interface ResponseFile extends File { response: Response<UploadFileResponse> }

@Component({})
export default class UploadImage extends Vue {
  @Prop({ required: false }) private readonly onSuccess!: Function | null
  @Prop({ required: false }) private readonly onBeforeUpload!: Function | null
  @Prop({ default: 1 }) private readonly maxSize!: number
  @Prop({ default: 1 }) private readonly max!: number
  @Prop({ default: 75 }) private readonly width!: number
  @Prop({ default: 75 }) private readonly height!: number
  @Prop({ required: true }) private readonly type!: number
  @Prop({ default: false }) private readonly disabled!: boolean
  @Ref('upload') private upload!: null | { fileList: any[] }
  @Ref('imageUpload') private imageUpload!: null | any

  private get _maxSize() {
    return this.maxSize * 1024 * 1024
  }

  private uploadList: any[] = []
  private imgName = ''
  private visible = false

  private changeHandle() {
    const { imageUpload } = this
    if (imageUpload) {
      this.uploadFiles(this.imageUpload.files)
      this.imageUpload.value = null
    }
  }

  private async uploadFiles(sourceFiles: FileList | File[]) {
    let files: File[] = Array.from(sourceFiles)

    files = Array.from(files).slice(0, this.max)
    files = files.filter(v => this.handleFormatError(v))
    if (files.length > this.max) {
      Message.warning(`最多只可以上传${this.max}张图片！`)
    }
    files = files.slice(0, this.max)

    files = await this.onBeforeUploadHandle(files)

    const uploadFiles: any[] = []
    for (let i = 0; i < files.length; i++) {
      const v = files[i]

      uploadFiles.push({
        name: v.name,
        uid: `${Date.now() + i * 1000}${genCode()}`,
        response: null,
        status: 'start',
        file: v
      })
    }

    this.uploadList = [...this.uploadList, ...uploadFiles]
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i]
      const formData = new FormData()
      formData.append('upload', file.file)
      uploadImages(formData).then(({ data }) => {
        const idx = this.uploadList.findIndex((v) => v.uid === file.uid)
        if (idx > -1) {
          this.$set(this.uploadList[idx], 'url', data.filePath)
          this.$set(this.uploadList[idx], 'status', 'success')
        }
        this.$emit('change', [...this.uploadList])
      }).catch(() => {
        const idx = this.uploadList.findIndex((v) => v.uid === file.uid)
        if (idx > -1) {
          this.$set(this.uploadList[idx], 'url', null)
          this.$set(this.uploadList[idx], 'status', 'error')
        }
        this.onErrorHandle(file)
      })
    }
  }

  handleFormatError(file: any) {
    if (file.type.indexOf('image') === -1) {
      Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 是不正确的, 请选择正确格式的图片'
      })
      return false
    }
    return true
  }

  // handleMaxSize(file: any) {
  //   Notice.warning({
  //     title: '文件太大了',
  //     desc: '文件  ' + file.name + ' 太大了。'
  //   })
  // }

  onErrorHandle(file: any) {
    const idx = this.uploadList.findIndex(v => v.uid === file.uid)
    if (idx > -1) {
      this.handleRemove(file, idx)
    }
    Notice.error({
      title: '上传失败',
      desc: '图片  ' + file.name + ' 上传失败。'
    })
  }

  private onBeforeUploadHandle(files: File[]) {
    this.onBeforeUpload && this.onBeforeUpload()
    const dealPromises: Promise<File>[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > this._maxSize) {
        dealPromises.push(new Promise((resolve) => {
          compressAccurately(file, {
            size: 1024,
            scale: 1
          })
            .then(res => {
              const newFile = new window.File(
                [res],
                file.name,
                { type: file.type }
              )
              resolve(newFile)
            })
        }))
      } else {
        dealPromises.push(Promise.resolve(file))
      }
    }
    return Promise.all(dealPromises)
  }

  private handleView(name: string) {
    this.imgName = name
    this.visible = true
  }

  private handleRemove(file: any, index: number) {
    this.uploadList.splice(index, 1)
    if (this.upload) {
      this.upload.fileList = this.upload.fileList.filter(v => v.name !== file.name)
    }
    this.$emit('change', [...this.uploadList])
  }

  private get imgPath() {
    return imgPath
  }

  public setDetfaultImgList(fullImgList: any[]) {
    this.uploadList = [...fullImgList]
    this.$nextTick(() => {
      if (this.upload) {
        this.upload.fileList = [...fullImgList]
      }
    })
  }

  @Model('change') private readonly value!: ResponseFile[]
  @Watch('value', { immediate: true })
  valueChange(value: any[]) {
    this.uploadList = value
  }

  private dragOver = false
  /**
   * 拖拽移入
   */
  private dragOverHandle() {
    this.dragOver = true
  }

  /**
   * 拖拽移出
   */
  private dragLevelHandle() {
    this.dragOver = false
  }

  private onDropHandle(e: DragEvent) {
    if (this.disabled) return
    this.dragOver = false
    this.uploadFiles(e.dataTransfer?.files || [])
  }

  private onPasteHandle(e: ClipboardEvent) {
    if (this.disabled) return
    this.uploadFiles(e.clipboardData?.files || [])
  }
}
