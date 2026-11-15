import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

const savedUser = JSON.parse(localStorage.getItem('user') || 'null')

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  const res = await api.get('/users', { params: { email, password } })
  if (res.data.length === 0) return rejectWithValue('Wrong email or password')
  return res.data[0]
})

export const register = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  const exists = await api.get('/users', { params: { email: form.email } })
  if (exists.data.length > 0) return rejectWithValue('This email is already registered')
  const res = await api.post('/users', { name: form.name, email: form.email, password: form.password, role: form.role })
  if (form.role === 'provider') {
    await api.post('/providers', {
      userId: res.data.id, name: form.name, categoryId: Number(form.categoryId), location: form.location,
      price: Number(form.price), experience: 1, about: 'New provider on LocalServe.', approved: false, slots: ['09:00', '11:00', '14:00', '16:00'],
    })
  }
  return res.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser, error: '' },
  reducers: {
    logout(state) {
      state.user = null
      localStorage.removeItem('user')
    },
    clearError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    const success = (state, action) => {
      state.user = action.payload
      state.error = ''
      localStorage.setItem('user', JSON.stringify(action.payload))
    }
    const failure = (state, action) => {
      state.error = action.payload || 'Something went wrong. Is JSON Server running?'
    }
    builder.addCase(login.fulfilled, success).addCase(login.rejected, failure)
    builder.addCase(register.fulfilled, success).addCase(register.rejected, failure)
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
