import { post, get } from '@/utils/request'

export function addCommand(data: any) {
  return post('/command/add', data)
}

export function getCommandList() {
  return new Promise((resolve, reject) => {
    get('/command/list')
      .then(res => resolve(res.data))
      .catch(reject)
  })
}
