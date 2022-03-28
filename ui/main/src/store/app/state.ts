
export interface AppState {
  value: number,
  select: 'vue' | 'select' | ''
}

export const initialState: AppState = {
  value: 1,
  select: ''
}
