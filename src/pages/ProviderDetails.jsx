import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { addItem } from '../store/marketSlice'
import { getRating, notify, stars } from '../utils'

export default function ProviderDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { providers, categories, services, reviews, bookings } = useSelector((s) => s.market)
  const [form, setForm] = useState({ service: '', date: '', time: '' })
  const [msg, setMsg] = useState(null)

  const provider = providers.find((p) => p.id === Number(id))
  if (!provider) return <div className="container py-5">Loading provider...</div>

  const category = categories.find((c) => c.id === provider.categoryId)
  const myServices = services.filter((s) => s.providerId === provider.id)
  const myReviews = reviews.filter((r) => r.providerId === provider.id)
  const rating = getRating(reviews, provider.id)
  const today = new Date().toISOString().split('T')[0]

  function handleBook(e) {
    e.preventDefault()
    const clash = bookings.some((b) => b.providerId === provider.id && b.date === form.date && b.time === form.time && ['Pending', 'Accepted', 'In Progress'].includes(b.status))
    if (clash) {
      setMsg({ type: 'danger', text: 'Sorry, this slot is already booked. Please choose another time.' })
      return
    }
    const svc = myServices.find((s) => s.id === Number(form.service))
    dispatch(addItem({
      collection: 'bookings',
      data: {
        customerId: user.id, customerName: user.name, providerId: provider.id, providerName: provider.name,
        service: svc ? svc.title : 'General visit', price: svc ? svc.charge : provider.price,
        date: form.date, time: form.time, status: 'Pending', reviewed: false,
      },
    }))
    notify(dispatch, provider.userId, `New booking request from ${user.name} on ${form.date} at ${form.time}`)
    setMsg({ type: 'success', text: 'Booking request sent! Track it in "My Bookings".' })
    setForm({ service: '', date: '', time: '' })
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <div className="d-flex gap-3 align-items-center mb-3">
              <div className="avatar">{provider.name[0]}</div>
              <div>
                <h3 className="mb-0">{provider.name}</h3>
                <span className="text-muted">{category?.icon} {category?.name} · 📍 {provider.location}</span>
              </div>
            </div>
            <p>{provider.about}</p>
            <div><span className="star">{stars(rating.avg)}</span> {rating.avg || 'New'} ({rating.count} reviews) · 🧰 {provider.experience} years experience</div>
            <h5 className="mt-4">Services & charges</h5>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between"><span>General visit</span><b>₹{provider.price}</b></li>
              {myServices.map((s) => <li key={s.id} className="list-group-item d-flex justify-content-between"><span>{s.title}</span><b>₹{s.charge}</b></li>)}
            </ul>
            <h5 className="mt-4">Available time slots</h5>
            <div>{provider.slots.map((t) => <span key={t} className="badge bg-primary-subtle text-primary-emphasis me-2 p-2">{t}</span>)}</div>
          </div>

          <h5>Customer reviews</h5>
          {myReviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
          {myReviews.map((r) => (
            <div key={r.id} className="card border-0 shadow-sm p-3 mb-2">
              <div><b>{r.customerName}</b> <span className="star">{stars(r.rating)}</span></div>
              <small>{r.comment}</small>
            </div>
          ))}
        </div>

        <div className="col-lg-5">
          <div className="card shadow border-0 p-4">
            <h5>📅 Book this provider</h5>
            {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
            {!user && <p>Please <Link to="/login">login</Link> as a customer to book.</p>}
            {user && user.role !== 'customer' && <p className="text-muted">Only customers can book services.</p>}
            {user?.role === 'customer' && (
              <form onSubmit={handleBook}>
                <label className="form-label small">Service</label>
                <select className="form-select mb-3" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                  <option value="">General visit (₹{provider.price})</option>
                  {myServices.map((s) => <option key={s.id} value={s.id}>{s.title} (₹{s.charge})</option>)}
                </select>
                <label className="form-label small">Date</label>
                <input className="form-control mb-3" type="date" min={today} required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <label className="form-label small">Time slot</label>
                <select className="form-select mb-3" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  <option value="">Choose a slot</option>
                  {provider.slots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button className="btn btn-primary w-100">Send booking request</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
