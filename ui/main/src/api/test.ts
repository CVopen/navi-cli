import { post } from '@/utils/request'

export function test() {
  // return get('/list', {test: 'test'})
  return post('/list', {test: 'test'})
}
