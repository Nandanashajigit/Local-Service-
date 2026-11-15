import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, deleteItem, editItem } from '../store/marketSlice'
import { getRating, notify, statusColor, stars } from '../utils'

export default function ProviderDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { providers, bookings, services, reviews } = useSelector((s) => s.market)
  const [tab, setTab] = useState('bookings')
  const [newService, setNewService] = useState({ title: '', charge: '' })
  const [newSlot, setNewSlot] = useState('')
  const [profile, setProfile] = useState(null)

  const me = providers.find((p) => p.userId === user.id)
  if (!me) return <div className="container py-5">Loading...</div>

  const myBookings = bookings.filter((b) => b.providerId === me.id).sort((a, b) => b.id - a.id)
  const myServices = services.filter((s) => s.providerId === me.id)
  const myReviews = reviews.filter((r) => r.providerId === me.id)
  const rating = getRating(reviews, me.id)
  const form = profile || me 

  function updateStatus(b, status) {
    dispatch(editItem({ collection: 'bookings', id: b.id, data: { status } }))
    notify(dispatch, b.customerId, `Your booking with ${me.name} on ${b.date} is now: ${status}`)
  }

  function addService(e) {
    e.preventDefault()
    dispatch(addItem({ collection: 'services', data: { providerId: me.id, title: newService.title, charge: Number(newService.charge) } }))
    setNewService({ title: '', charge: '' })
  }

  function saveProfile(e) {
    e.preventDefault()
    dispatch(editItem({ collection: 'providers', id: me.id, data: { about: form.about, location: form.location, price: Number(form.price), experience: Number(form.experience) } }))
    setProfile(null)
  }

  function addSlot() {
    if (!newSlot || me.slots.includes(newSlot)) return
    dispatch(editItem({ collection: 'providers', id: me.id, data: { slots: [...me.slots, newSlot].sort() } }))
    setNewSlot('')
  }

  function removeSlot(t) {
    dispatch(editItem({ collection: 'providers', id: me.id, data: { slots: me.slots.filter((s) => s !== t) } }))
  }

  const nextStep = { Pending: [['Accept', 'Accepted', 'success'], ['Reject', 'Rejected', 'danger']], Accepted: [['Start work', 'In Progress', 'info']], 'In Progress': [['Mark completed', 'Completed', 'success']] }

  return (
    <div className="container py-4">
      <h3>Provider Dashboard</h3>
      {!me.approved && <div className="alert alert-warning">⏳ Your profile is waiting for admin approval. Customers cannot see it yet.</div>}
      <div className="row g-3 mb-4">
        <div className="col-4"><div className="card shadow-sm border-0 p-3 text-center"><h2>{myBookings.length}</h2><small>Total bookings</small></div></div>
        <div className="col-4"><div className="card shadow-sm border-0 p-3 text-center"><h2>{myBookings.filter((b) => b.status === 'Pending').length}</h2><small>Pending requests</small></div></div>
        <div className="col-4"><div className="card shadow-sm border-0 p-3 text-center"><h2>{rating.avg || '-'}</h2><small>Rating ({rating.count})</small></div></div>
      </div>

      <ul className="nav nav-pills mb-3">
        {[['bookings', '📋 Bookings'], ['services', '🧰 Services'], ['profile', '👤 Profile & Availability'], ['reviews', '⭐ Reviews']].map((t) => (
          <li className="nav-item" key={t[0]}><button className={'nav-link ' + (tab === t[0] ? 'active' : '')} onClick={() => setTab(t[0])}>{t[1]}</button></li>
        ))}
      </ul>

      {tab === 'bookings' && (
        <>
          {myBookings.length === 0 && <div className="alert alert-info">No booking requests yet.</div>}
          {myBookings.map((b) => (
            <div key={b.id} className="card shadow-sm border-0 mb-2 p-3 d-flex flex-row flex-wrap justify-content-between align-items-center gap-2">
              <div><b>{b.service}</b> for {b.customerName}<br /><small className="text-muted">📅 {b.date} at {b.time} · ₹{b.price}</small></div>
              <div className="d-flex gap-2 align-items-center">
                <span className={`badge bg-${statusColor[b.status]}`}>{b.status}</span>
                {(nextStep[b.status] || []).map((n) => <button key={n[1]} className={`btn btn-sm btn-${n[2]}`} onClick={() => updateStatus(b, n[1])}>{n[0]}</button>)}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'services' && (
        <>
          <form className="row g-2 mb-3" onSubmit={addService}>
            <div className="col-md-6"><input className="form-control" placeholder="Service name" required value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} /></div>
            <div className="col-md-3"><input className="form-control" type="number" placeholder="Charge ₹" required value={newService.charge} onChange={(e) => setNewService({ ...newService, charge: e.target.value })} /></div>
            <div className="col-md-3"><button className="btn btn-primary w-100">Add service</button></div>
          </form>
          <ul className="list-group">
            {myServices.map((s) => (
              <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{s.title} – <b>₹{s.charge}</b></span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(deleteItem({ collection: 'services', id: s.id }))}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'profile' && (
        <div className="row g-4">
          <form className="col-md-7" onSubmit={saveProfile}>
            <textarea className="form-control mb-2" rows="3" value={form.about} onChange={(e) => setProfile({ ...form, about: e.target.value })} />
            <input className="form-control mb-2" placeholder="Location" value={form.location} onChange={(e) => setProfile({ ...form, location: e.target.value })} />
            <input className="form-control mb-2" type="number" placeholder="Charge per visit" value={form.price} onChange={(e) => setProfile({ ...form, price: e.target.value })} />
            <input className="form-control mb-2" type="number" placeholder="Years of experience" value={form.experience} onChange={(e) => setProfile({ ...form, experience: e.target.value })} />
            <button className="btn btn-primary">Save profile</button>
          </form>
          <div className="col-md-5">
            <h6>My available time slots</h6>
            {me.slots.map((t) => <span key={t} className="badge bg-primary me-2 mb-2 p-2">{t} <span role="button" onClick={() => removeSlot(t)}>✕</span></span>)}
            <div className="input-group mt-2">
              <input className="form-control" type="time" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} />
              <button className="btn btn-outline-primary" onClick={addSlot}>Add slot</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <>
          {myReviews.length === 0 && <div className="alert alert-info">No reviews yet.</div>}
          {myReviews.map((r) => <div key={r.id} className="card border-0 shadow-sm p-3 mb-2"><b>{r.customerName}</b> <span className="star">{stars(r.rating)}</span><small>{r.comment}</small></div>)}
        </>
      )}
    </div>
  )
}
