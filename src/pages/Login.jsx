import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login, clearError } from '../store/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider' : '/providers')
  }, [user, navigate])
  useEffect(() => { dispatch(clearError()) }, [dispatch])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card shadow border-0 p-4">
        <h3 className="text-center mb-3">Welcome back 👋</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="form-control mb-3" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3 mb-2 small">New here? <Link to="/register">Create an account</Link></p>
       
      </div>
    </div>
  )
}
