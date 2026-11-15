import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bar, Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'
import { addItem, deleteItem, editItem } from '../store/marketSlice'
import { statusColor } from '../utils'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { users, providers, categories, bookings } = useSelector((s) => s.market)
  const [tab, setTab] = useState('overview')
  const [catName, setCatName] = useState('')

  const pending = providers.filter((p) => !p.approved)
  const statuses = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected', 'Cancelled']

  const perCategory = categories.map((c) => bookings.filter((b) => providers.find((p) => p.id === b.providerId)?.categoryId === c.id).length)
  const perStatus = statuses.map((s) => bookings.filter((b) => b.status === s).length)

  const performance = providers.filter((p) => p.approved).map((p) => ({ name: p.name, done: bookings.filter((b) => b.providerId === p.id && b.status === 'Completed').length }))

  function approve(p) {
    dispatch(editItem({ collection: 'providers', id: p.id, data: { approved: true } }))
    dispatch(addItem({ collection: 'notifications', data: { userId: p.userId, message: 'Your profile has been approved. You are now live!', date: new Date().toLocaleString() } }))
  }

  function reject(p) {
    dispatch(deleteItem({ collection: 'providers', id: p.id }))
    dispatch(deleteItem({ collection: 'users', id: p.userId }))
  }

  function addCategory(e) {
    e.preventDefault()
    dispatch(addItem({ collection: 'categories', data: { name: catName, icon: '🛠️' } }))
    setCatName('')
  }

  function downloadCsv() {
    const rows = [['ID', 'Customer', 'Provider', 'Service', 'Date', 'Time', 'Status', 'Price']]
    bookings.forEach((b) => rows.push([b.id, b.customerName, b.providerName, b.service, b.date, b.time, b.status, b.price]))
    const csv = rows.map((r) => r.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'bookings.csv'
    link.click()
  }

  const stat = (n, label, icon) => (
    <div className="col-6 col-lg-3"><div className="card shadow-sm border-0 p-3 text-center"><div className="cat-icon">{icon}</div><h2>{n}</h2><small>{label}</small></div></div>
  )

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin Dashboard</h3>
        <div><button className="btn btn-outline-primary btn-sm me-2" onClick={downloadCsv}>⬇ CSV report</button><button className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>🖨 Print / PDF</button></div>
      </div>
      <ul className="nav nav-pills mb-3">
        {[['overview', '📊 Overview'], ['approvals', `✅ Approvals (${pending.length})`], ['bookings', '📋 Bookings'], ['users', '👥 Users'], ['categories', '🗂 Categories']].map((t) => (
          <li className="nav-item" key={t[0]}><button className={'nav-link ' + (tab === t[0] ? 'active' : '')} onClick={() => setTab(t[0])}>{t[1]}</button></li>
        ))}
      </ul>

      {tab === 'overview' && (
        <>
          <div className="row g-3 mb-4">
            {stat(users.filter((u) => u.role === 'customer').length, 'Customers', '🙋')}
            {stat(providers.filter((p) => p.approved).length, 'Providers', '🧑‍🔧')}
            {stat(bookings.length, 'Bookings', '📅')}
            {stat('₹' + bookings.filter((b) => b.status === 'Completed').reduce((t, b) => t + b.price, 0), 'Completed value', '💰')}
          </div>
          <div className="row g-4">
            <div className="col-lg-7"><div className="card shadow-sm border-0 p-3"><h6>Popular services (bookings per category)</h6><Bar data={{ labels: categories.map((c) => c.name), datasets: [{ label: 'Bookings', data: perCategory, backgroundColor: '#6366f1' }] }} /></div></div>
            <div className="col-lg-5"><div className="card shadow-sm border-0 p-3"><h6>Booking status</h6><Doughnut data={{ labels: statuses, datasets: [{ data: perStatus, backgroundColor: ['#facc15', '#6366f1', '#38bdf8', '#22c55e', '#ef4444', '#94a3b8'] }] }} /></div></div>
            <div className="col-12"><div className="card shadow-sm border-0 p-3"><h6>Provider performance (completed jobs)</h6><Bar data={{ labels: performance.map((p) => p.name), datasets: [{ label: 'Completed', data: performance.map((p) => p.done), backgroundColor: '#ec4899' }] }} /></div></div>
          </div>
        </>
      )}

      {tab === 'approvals' && (
        <>
          {pending.length === 0 && <div className="alert alert-success">No pending provider registrations.</div>}
          {pending.map((p) => (
            <div key={p.id} className="card shadow-sm border-0 p-3 mb-2 d-flex flex-row justify-content-between align-items-center">
              <div><b>{p.name}</b> – {categories.find((c) => c.id === p.categoryId)?.name}, {p.location}</div>
              <div><button className="btn btn-success btn-sm me-2" onClick={() => approve(p)}>Approve</button><button className="btn btn-danger btn-sm" onClick={() => reject(p)}>Reject</button></div>
            </div>
          ))}
        </>
      )}

      {tab === 'bookings' && (
        <div className="table-responsive card shadow-sm border-0">
          <table className="table align-middle mb-0">
            <thead><tr><th>#</th><th>Customer</th><th>Provider</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}><td>{b.id}</td><td>{b.customerName}</td><td>{b.providerName}</td><td>{b.service}</td><td>{b.date} {b.time}</td><td><span className={`badge bg-${statusColor[b.status]}`}>{b.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="table-responsive card shadow-sm border-0">
          <table className="table align-middle mb-0">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {users.filter((u) => u.role !== 'admin').map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td><td>{u.email}</td><td><span className="badge bg-secondary">{u.role}</span></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={() => {
                    dispatch(deleteItem({ collection: 'users', id: u.id }))
                    const prov = providers.find((p) => p.userId === u.id)
                    if (prov) dispatch(deleteItem({ collection: 'providers', id: prov.id }))
                  }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'categories' && (
        <>
          <form className="input-group mb-3" onSubmit={addCategory}>
            <input className="form-control" placeholder="New category name" required value={catName} onChange={(e) => setCatName(e.target.value)} />
            <button className="btn btn-primary">Add category</button>
          </form>
          <ul className="list-group">
            {categories.map((c) => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                {c.icon} {c.name}
                <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(deleteItem({ collection: 'categories', id: c.id }))}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
