import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { loadAll } from './store/marketSlice'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Providers from './pages/Providers'
import ProviderDetails from './pages/ProviderDetails'
import MyBookings from './pages/MyBookings'
import Favourites from './pages/Favourites'
import Notifications from './pages/Notifications'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadAll())
  }, [dispatch])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<ProviderDetails />} />
        <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute role="customer"><Favourites /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/provider" element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
