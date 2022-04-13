import { AppState } from './state'

const selectFrame = (state: AppState, { payload }: { payload: string }) => {
  state.frame = payload
}

const selectBuild = (state: AppState, { payload }: { payload: string }) => {
  state.build = payload
}

export default {
  selectFrame,
  selectBuild,
}
