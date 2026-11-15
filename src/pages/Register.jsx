import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register, clearError } from '../store/authSlice'
import { loadAll } from '../store/marketSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, error } = useSelector((s) => s.auth)
  const categories = useSelector((s) => s.market.categories)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', categoryId: 1, location: '', price: '' })

  useEffect(() => {
    if (user) navigate(user.role === 'provider' ? '/provider' : '/providers')
  }, [user, navigate])
  useEffect(() => { dispatch(clearError()) }, [dispatch])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    await dispatch(register(form))
    dispatch(loadAll())
  }

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <div className="card shadow border-0 p-4">
        <h3 className="text-center mb-3">Create your account</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="btn-group w-100 mb-3">
            <button type="button" className={'btn ' + (form.role === 'customer' ? 'btn-primary' : 'btn-outline-primary')} onClick={() => setForm({ ...form, role: 'customer' })}>I need a service</button>
            <button type="button" className={'btn ' + (form.role === 'provider' ? 'btn-primary' : 'btn-outline-primary')} onClick={() => setForm({ ...form, role: 'provider' })}>I offer services</button>
          </div>
          <input className="form-control mb-3" name="name" placeholder="Full name" required value={form.name} onChange={change} />
          <input className="form-control mb-3" name="email" type="email" placeholder="Email" required value={form.email} onChange={change} />
          <input className="form-control mb-3" name="password" type="password" placeholder="Password (min 4 characters)" minLength={4} required value={form.password} onChange={change} />
          {form.role === 'provider' && (
            <>
              <select className="form-select mb-3" name="categoryId" value={form.categoryId} onChange={change}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <input className="form-control mb-3" name="location" placeholder="Location (e.g. Kochi)" required value={form.location} onChange={change} />
              <input className="form-control mb-3" name="price" type="number" placeholder="Charge per visit (₹)" required value={form.price} onChange={change} />
              <div className="alert alert-info small">Your profile will be visible after the admin approves it.</div>
            </>
          )}
          <button className="btn btn-primary w-100">Sign up</button>
        </form>
        <p className="text-center mt-3 mb-0 small">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
