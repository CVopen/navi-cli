import { post, get,del, put } from '@/utils/request'

export function addCommand(data: any) {
  return post('/command/add', data).then(res => (res.data as {id: number}).id)
}

export function getCommandList() {
  return get('/command/list').then(res => res.data)
}

export function delCommand(data: {id: number}) {
  return del('/command/del', data)
}

export function updateCommand(data:any) {
  return put('/command/update', data)
}
