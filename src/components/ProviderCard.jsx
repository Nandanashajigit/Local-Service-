import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addItem, deleteItem } from '../store/marketSlice'
import { getRating, stars } from '../utils'

export default function ProviderCard({ provider }) {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { categories, reviews, favourites } = useSelector((s) => s.market)
  const category = categories.find((c) => c.id === provider.categoryId)
  const rating = getRating(reviews, provider.id)
  const fav = user && favourites.find((f) => f.userId === user.id && f.providerId === provider.id)

  function toggleFavourite() {
    if (fav) dispatch(deleteItem({ collection: 'favourites', id: fav.id }))
    else dispatch(addItem({ collection: 'favourites', data: { userId: user.id, providerId: provider.id } }))
  }

  return (
    <div className="card hover-card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="avatar">{provider.name[0]}</div>
          <div className="flex-grow-1">
            <h5 className="mb-0">{provider.name}</h5>
            <small className="text-muted">{category?.icon} {category?.name}</small>
          </div>
          {user?.role === 'customer' && (
            <button className="btn btn-sm btn-light" onClick={toggleFavourite} title="Favourite">{fav ? '❤️' : '🤍'}</button>
          )}
        </div>
        <p className="small text-muted">{provider.about}</p>
        <div className="mb-2"><span className="star">{stars(rating.avg)}</span> <small>{rating.avg || 'New'} ({rating.count})</small></div>
        <div className="d-flex justify-content-between small mb-3">
          <span>📍 {provider.location}</span>
          <span>🧰 {provider.experience} yrs</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <strong className="text-primary">₹{provider.price}<small className="text-muted fw-normal"> /visit</small></strong>
          <Link to={`/providers/${provider.id}`} className="btn btn-primary btn-sm">View & Book</Link>
        </div>
      </div>
    </div>
  )
}
