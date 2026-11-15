import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import marketReducer from './marketSlice'

export default configureStore({
     reducer: { auth: authReducer,
 market: marketReducer } })
