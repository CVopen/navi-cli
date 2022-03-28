import { createSlice } from '@reduxjs/toolkit'

import {initialState} from './state'
import reducers from './reducers'

export const testSlice = createSlice({
  name: 'app',
  initialState,
  reducers: reducers,
})

export default testSlice.reducer
export const { 
  selectFrame,
  selectBuild
} = testSlice.actions
