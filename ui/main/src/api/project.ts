import { get, post } from '@/utils/request'

export function getProjectList() {
  return get('/project/list').then((res) => res.data)
}

export function openFolder(data: { local: string }) {
  return post('/project/open', data)
}
