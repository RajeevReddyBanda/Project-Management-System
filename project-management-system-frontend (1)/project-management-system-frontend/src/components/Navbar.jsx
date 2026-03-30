import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TITLES = {
  '/dashboard':   'Dashboard',
  '/projects':    'Projects',
  '/projects/new':'New Project',
  '/tasks':       'Tasks',
  '/users':       'User Management',
}

export default function Navbar() {
  const { user } = useAuth()
  const loc      = useLocation()
  const title    = TITLES[loc.pathname] ?? 'PMS'
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⬡</span>
        <span className="navbar-title">{title}</span>
      </div>
      <div className="navbar-right">
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          <div style={{ color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <div>
            <div className="navbar-username">{user?.username}</div>
            <div className="navbar-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
