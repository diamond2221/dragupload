import request from './request'

/**
 * 直接上传图片
 * @param data
 */
export const uploadImages = (data: FormData) => {
  return request < {filePath: string}>({
    method: 'post',
    url: '/upload',
    headers: {
      dataType: 'file'
    },
    data
  })
}
