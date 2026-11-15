import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'

export default function Navbar() {
  const { user } = useSelector((s) => s.auth)
  const notifications = useSelector((s) => s.market.notifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const count = user ? notifications.filter((n) => n.userId === user.id).length : 0

  function handleLogout() {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand brand text-primary" to="/">🛠️ LocalServe</Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu"><span className="navbar-toggler-icon"></span></button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/providers">Find Services</NavLink></li>
            {user?.role === 'customer' && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/my-bookings">My Bookings</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/favourites">Favourites</NavLink></li>
              </>
            )}
            {user?.role === 'provider' && <li className="nav-item"><NavLink className="nav-link" to="/provider">My Dashboard</NavLink></li>}
            {user?.role === 'admin' && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin Dashboard</NavLink></li>}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            {user ? (
              <>
                <Link to="/notifications" className="btn btn-outline-primary btn-sm">
                  🔔{count > 0 && <span className="badge bg-danger ms-1">{count}</span>}
                </Link>
                <span className="small fw-semibold">Hi, {user.name.split(' ')[0]}</span>
                <button className="btn btn-primary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
