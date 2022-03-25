declare module '*.css' {
  const content: { [selector: string]: string }
  export default content
}

declare module '*.less' {
  const content: { [selector: string]: string }
  export default content
}

declare interface Window {
  __POWERED_BY_QIANKUN__: any
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
