import { useSelector } from 'react-redux'
import ProviderCard from '../components/ProviderCard'

export default function Favourites() {
  const { user } = useSelector((s) => s.auth)
  const { favourites, providers } = useSelector((s) => s.market)
  const list = favourites.filter((f) => f.userId === user.id).map((f) => providers.find((p) => p.id === f.providerId)).filter(Boolean)

  return (
    <div className="container py-4">
      <h3 className="mb-3">❤️ My Favourite Providers</h3>
      {list.length === 0 && <div className="alert alert-info">No favourites yet. Tap the heart on a provider card to save it.</div>}
      <div className="row g-4">
        {list.map((p) => <div className="col-md-6 col-lg-4" key={p.id}><ProviderCard provider={p} /></div>)}
      </div>
    </div>
  )
}
