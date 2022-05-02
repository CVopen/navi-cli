import { createAsyncThunk } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'

import { getPath } from '@/api'

import { AppState } from './state'
import { session } from '@/utils/storage'

export const getPathAsync = createAsyncThunk('app/getPath', (params?: { path: string; status?: boolean }) => {
  return getPath(params).then((res) => {
    session.setItem('createPath', res)
    return res
  })
})

export default {
  [getPathAsync.fulfilled.type](state: WritableDraft<AppState>, action: any) {
    state.createPath = action.payload
  },
}
