import { PayloadAction } from '@reduxjs/toolkit'
import { AppState, WS } from './state'

const selectFrame = (state: AppState, action: PayloadAction<string>) => {
  state.frame = action.payload
}

const selectBuild = (state: AppState, action: PayloadAction<string>) => {
  state.build = action.payload
}

const socketInstance = (state: AppState, action: PayloadAction<WebSocket>) => {
  state.socket = action.payload
}

export default {
  selectFrame,
  selectBuild,
  socketInstance,
}
