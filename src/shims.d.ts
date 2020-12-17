declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'view-design/dist/locale/*' {
  export const elementLocale: any
}

declare module '*.gif' {
  export const gif: any
}

// TODO: remove this part after vue-count-to has its typescript file
declare module 'vue-count-to'


// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload'
