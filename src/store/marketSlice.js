import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

const names = ['users', 'providers', 'services', 'categories', 'bookings', 'reviews', 'notifications', 'favourites']

export const loadAll = createAsyncThunk('market/loadAll', async () => {
  const results = await Promise.all(names.map((n) => api.get('/' + n)))
  const data = {}
  names.forEach((n, i) => (data[n] = results[i].data))
  return data
})

export const addItem = createAsyncThunk('market/add', async ({ collection, data }, { dispatch }) => {
  await api.post('/' + collection, data)
  await dispatch(loadAll())
})
export const editItem = createAsyncThunk('market/edit', async ({ collection, id, data }, { dispatch }) => {
  await api.patch(`/${collection}/${id}`, data)
  await dispatch(loadAll())
})
export const deleteItem = createAsyncThunk('market/delete', async ({ collection, id }, { dispatch }) => {
  await api.delete(`/${collection}/${id}`)
  await dispatch(loadAll())
})

const initialState = { loading: true }
names.forEach((n) => (initialState[n] = []))

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAll.fulfilled, (state, action) => {
      Object.assign(state, action.payload)
      state.loading = false
    })
    builder.addCase(loadAll.rejected, (state) => {
      state.loading = false
    })
  },
})

export default marketSlice.reducer
