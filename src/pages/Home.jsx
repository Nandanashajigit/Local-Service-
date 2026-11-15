import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ProviderCard from '../components/ProviderCard'
import { getRating } from '../utils'

export default function Home() {
  const { categories, providers, reviews } = useSelector((s) => s.market)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const top = providers.filter((p) => p.approved).sort((a, b) => getRating(reviews, b.id).avg - getRating(reviews, a.id).avg).slice(0, 3)

  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Find trusted local experts</h1>
          <p className="lead mb-4">Electricians, plumbers, tutors and more – book in just a few clicks.</p>
          <div className="input-group input-group-lg mx-auto" style={{ maxWidth: 560 }}>
            <input className="form-control" placeholder="Search by provider name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-dark" onClick={() => navigate('/providers')}>Search</button>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <h3 className="mb-4 text-center">Browse Categories</h3>
        <div className="row g-3">
          {categories.map((c) => (
            <div className="col-6 col-md-3 col-lg-2" key={c.id}>
              <Link to={`/providers?category=${c.id}`} className="text-decoration-none">
                <div className="card hover-card shadow-sm text-center p-3 h-100">
                  <div className="cat-icon">{c.icon}</div>
                  <small className="fw-semibold text-body">{c.name}</small>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <h3 className="mt-5 mb-4 text-center">Top Rated Providers</h3>
        <div className="row g-4">
          {top.map((p) => (
            <div className="col-md-4" key={p.id}><ProviderCard provider={p} /></div>
          ))}
        </div>

        <h3 className="mt-5 mb-4 text-center">How it works</h3>
        <div className="row text-center g-4">
          {[['🔍', 'Search', 'Pick a category and compare providers'], ['📅', 'Book', 'Choose a date and time slot'], ['⭐', 'Review', 'Rate the service after it is done']].map((s) => (
            <div className="col-md-4" key={s[1]}>
              <div className="cat-icon">{s[0]}</div>
              <h5>{s[1]}</h5>
              <p className="text-muted">{s[2]}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
