import request from './request'

export const uploadVideoUrl = '/api/upload/video'

/**
 * 直接上传视频
 * @param data
 */
export const uploadVideoNormal = (fileKey: string, data: FormData) => {
  return request<{ fileName: string }>({
    method: 'post',
    url: uploadVideoUrl,
    headers: {
      dataType: 'file'
    },
    params: {
      fileKey
    },
    data
  })
}

export const getUploadVideoProgress = (fileKey: string) => {
  return request<number>({
    url: '/api/upload/progress/listener',
    method: 'GET',
    params: { fileKey }
  })
}
