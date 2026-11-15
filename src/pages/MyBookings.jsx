import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, editItem } from '../store/marketSlice'
import { notify, statusColor } from '../utils'

export default function MyBookings() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { bookings, providers } = useSelector((s) => s.market)
  const [reviewing, setReviewing] = useState(null) 
  const [review, setReview] = useState({ rating: 5, comment: '' })

  const mine = bookings.filter((b) => b.customerId === user.id).sort((a, b) => b.id - a.id)

  function cancel(b) {
    dispatch(editItem({ collection: 'bookings', id: b.id, data: { status: 'Cancelled' } }))
    const provider = providers.find((p) => p.id === b.providerId)
    if (provider) notify(dispatch, provider.userId, `${user.name} cancelled the booking on ${b.date} at ${b.time}`)
  }

  function submitReview(e) {
    e.preventDefault()
    dispatch(addItem({ collection: 'reviews', data: { providerId: reviewing.providerId, customerName: user.name, rating: Number(review.rating), comment: review.comment } }))
    dispatch(editItem({ collection: 'bookings', id: reviewing.id, data: { reviewed: true } }))
    setReviewing(null)
    setReview({ rating: 5, comment: '' })
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">My Bookings</h3>
      {mine.length === 0 && <div className="alert alert-info">You have no bookings yet.</div>}
      {mine.map((b) => (
        <div className="card shadow-sm border-0 mb-3" key={b.id}>
          <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h5 className="mb-1">{b.service}</h5>
              <div className="text-muted small">with {b.providerName} · 📅 {b.date} at {b.time} · ₹{b.price}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className={`badge bg-${statusColor[b.status]}`}>{b.status}</span>
              {['Pending', 'Accepted'].includes(b.status) && <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(b)}>Cancel</button>}
              {b.status === 'Completed' && !b.reviewed && <button className="btn btn-sm btn-primary" onClick={() => setReviewing(b)}>Rate & Review</button>}
            </div>
          </div>
          {reviewing?.id === b.id && (
            <form className="card-footer" onSubmit={submitReview}>
              <select className="form-select mb-2" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
              <textarea className="form-control mb-2" placeholder="Write your feedback..." required value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
              <button className="btn btn-success btn-sm me-2">Submit review</button>
              <button type="button" className="btn btn-light btn-sm" onClick={() => setReviewing(null)}>Cancel</button>
            </form>
          )}
        </div>
      ))}
    </div>
  )
}
