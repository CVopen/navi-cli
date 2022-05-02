import { session } from '@/utils/storage'

export interface CreatePathLocal {
  path: string[]
  folderList: { folderName: string; frame: '' | 'vue' | 'react' }[]
}

export interface AppState {
  frame: string // 'vue' | 'select' | ''
  build: string // 'webpack' | 'vite' | ''
  socket?: WebSocket
  createPath: CreatePathLocal
}

export const initialState: AppState = {
  frame: session.getItem('frame'),
  build: session.getItem('build'),
  createPath: session.getItem('createPath') || { path: [], folderList: [] },
}
