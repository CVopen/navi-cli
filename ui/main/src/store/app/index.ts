import { createSlice } from '@reduxjs/toolkit'

import { initialState } from './state'
import reducers from './reducers'
import extraReducers, { getPathAsync } from './asyncThunk'

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: reducers,
  extraReducers,
})

export default appSlice.reducer
export const { selectFrame, selectBuild, socketInstance } = appSlice.actions
export { getPathAsync }
