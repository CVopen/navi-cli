import { post, get, del, put } from '@/utils/request'

export function addTemplate(data: any) {
  return post('/template/add', data).then((res) => (res.data as { id: number }).id)
}

export function getTemplateList() {
  return get('/template/list').then((res) => res.data)
}

export function delTemplate(data: { id: string }) {
  return del('/template/del', data)
}

export function updateTemplate(data: any) {
  return put('/template/update', data)
}
