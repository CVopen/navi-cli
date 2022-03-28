import {AppState} from './state'

const increment = (state: AppState) => {
  state.value += 1
}

const selectProject = (state: AppState, { payload }: {payload: 'vue' | 'select' | ''} ) => {
  state.select = payload
}

export default {
  increment,
  selectProject
}
