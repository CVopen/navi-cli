import { get, post } from '@/utils/request'

export function getProjectList() {
  return get('/project/list').then((res) => res.data)
}

export function openFolder(data: { local: string }) {
  return post('/project/open', data)
}

export function getPath(params?: { path: string; status?: boolean }) {
  return get('/project/path', params).then((res) => res.data)
}

export function getDisc() {
  return get('/project/disc').then((res) => res.data as unknown as string[])
}

export function getProjectSelect(params: { name: string }) {
  return get('/project/select', params).then((res) => res.data)
}

export function createProject(data: any) {
  return post('/project/create', data)
}
