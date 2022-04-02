import { post, get } from '@/utils/request'

export function test() {
  return post('/list', {test: 'test'})
    .then(res => res.data)
    .catch(err => {
      console.log(err)
    })
}

export function getCommandList() {
  return new Promise((resolve, reject) => {
    get('/command/list')
      .then(res => resolve(res.data))
      .catch(reject)
  })
}