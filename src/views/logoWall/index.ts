import { Component, Vue } from 'vue-property-decorator'
import SparkMd5 from 'spark-md5'

@Component({
  name: 'logoWallList'
})
export default class extends Vue {
  private images: any[] = []
  private videos: any[] = []

  private onBeforeUpload(files: File[]) {
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice

    const file = files[0]
    const chunkSize = 3 * 1024 * 1024

    const sm5 = new SparkMd5()

    const parkSize = Math.ceil(file.size / chunkSize)
    let currentChunk = 0

    const fr = new FileReader()

    fr.onload = e => {
      console.log(e, 'load')
      if (e.target?.result) {
        sm5.append(e.target.result as string)
        currentChunk++
        if (currentChunk < parkSize) {
          loadNext()
        } else {
          console.log('finished!')
          console.info('hash results: ', sm5.end())
        }
      }
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = (start + chunkSize >= file.size) ? file.size : start + chunkSize
      fr.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
    // sm5.append()
  }
}
