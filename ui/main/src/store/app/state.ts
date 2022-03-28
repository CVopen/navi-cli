import {session} from '@/utils/storage'

export interface AppState {
  frame: string, // 'vue' | 'select' | ''
  build: string // 'webpack' | 'vite' | ''
}

export const initialState: AppState = {
  frame:  session.getItem('frame'),
  build: session.getItem('build')
}
