import { createAsyncThunk } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'

import { getPath } from '@/api'

import { AppState, CreatePathLocal } from './state'
import { session } from '@/utils/storage'

export const getPathAsync = createAsyncThunk('app/test', (params?: { path: string }) => {
  return getPath(params).then((res) => {
    session.setItem('createPath', res)
    return res as unknown as CreatePathLocal
  })
})

export default {
  [getPathAsync.fulfilled.type](state: WritableDraft<AppState>, action: any) {
    state.createPath = action.payload
  },
}
