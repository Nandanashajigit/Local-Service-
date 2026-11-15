import { useDispatch, useSelector } from 'react-redux'
import { deleteItem } from '../store/marketSlice'

export default function Notifications() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const notifications = useSelector((s) => s.market.notifications)
  const mine = notifications.filter((n) => n.userId === user.id).sort((a, b) => b.id - a.id)

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h3 className="mb-3">🔔 Notifications</h3>
      {mine.length === 0 && <div className="alert alert-info">You are all caught up!</div>}
      {mine.map((n) => (
        <div key={n.id} className="card border-0 shadow-sm mb-2 p-3 d-flex flex-row justify-content-between align-items-center">
          <div>{n.message}<br /><small className="text-muted">{n.date}</small></div>
          <button className="btn btn-sm btn-light" onClick={() => dispatch(deleteItem({ collection: 'notifications', id: n.id }))}>✕</button>
        </div>
      ))}
    </div>
  )
}
