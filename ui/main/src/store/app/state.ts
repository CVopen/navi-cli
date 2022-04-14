import { session } from '@/utils/storage'

// export type WS =

export type WS = new (val: string) => WebSocket

export interface AppState {
  frame: string // 'vue' | 'select' | ''
  build: string // 'webpack' | 'vite' | ''
  socket?: WebSocket
}

export const initialState: AppState = {
  frame: session.getItem('frame'),
  build: session.getItem('build'),
}
