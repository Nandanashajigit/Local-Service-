import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ProviderCard from '../components/ProviderCard'
import { getRating } from '../utils'

export default function Providers() {
  const { providers, categories, reviews } = useSelector((s) => s.market)
  const [params] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(params.get('category') || '')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState(0)

  const list = providers
    .filter((p) => p.approved)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => !category || p.categoryId === Number(category))
    .filter((p) => p.location.toLowerCase().includes(location.toLowerCase()))
    .filter((p) => !maxPrice || p.price <= Number(maxPrice))
    .filter((p) => getRating(reviews, p.id).avg >= Number(minRating))

  return (
    <div className="container py-4">
      <h3 className="mb-3">Find a service provider</h3>
      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" placeholder="🔍 Name" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="col-md-3">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2"><input className="form-control" placeholder="📍 Location" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
          <div className="col-md-2"><input className="form-control" type="number" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></div>
          <div className="col-md-2">
            <select className="form-select" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="0">Any rating</option>
              <option value="3">3★ & above</option>
              <option value="4">4★ & above</option>
            </select>
          </div>
        </div>
      </div>
      <p className="text-muted">{list.length} provider(s) found</p>
      <div className="row g-4">
        {list.map((p) => <div className="col-md-6 col-lg-4" key={p.id}><ProviderCard provider={p} /></div>)}
      </div>
    </div>
  )
}
