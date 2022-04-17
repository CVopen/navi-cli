import moment from 'moment'
export function strToJson(data: string) {
  return JSON.parse(data)
}

export function formatDate(date: string, format = 'YYYY:MM:DD HH:mm') {
  return moment(date).format(format)
}
