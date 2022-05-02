import moment from 'moment'

export function strToJson(data: string) {
  return JSON.parse(data)
}

export function formatDate(date: string, format = 'YYYY/MM/DD HH:mm'): string {
  return moment(date).format(format)
}

export function checkPlatFormToWin(): boolean {
  return /Windows/i.test(navigator.userAgent)
}

export function transformPath(pathList: string[]): string {
  const win = checkPlatFormToWin()
  const symbol = win ? '\\' : '/'
  if (win) {
    pathList = pathList.slice(1)
  }
  return pathList.join(symbol)
}

export function validateFolderName(fileName: string): boolean {
  return /[\:*?"<>|]/.test(fileName)
}
