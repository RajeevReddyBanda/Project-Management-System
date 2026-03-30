import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { to: '/projects',  icon: '◫', label: 'Projects'  },
  { to: '/tasks',     icon: '◻', label: 'Tasks'     },
]

const ADMIN_NAV = [
  { to: '/users', icon: '◈', label: 'Users' },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const loc = useLocation()

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⬡</div>
        <span className="sidebar-logo-text">PM<span>S</span></span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Workspace</div>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-item-icon">{icon}</span>
            <span className="sidebar-item-label">{label}</span>
          </NavLink>
        ))}

        {isAdmin() && (
          <>
            <div className="sidebar-section-label">Admin</div>
            {ADMIN_NAV.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-item-icon">{icon}</span>
                <span className="sidebar-item-label">{label}</span>
              </NavLink>
            ))}
          </>
        )}

        {/* User mini-card */}
        <div style={{ marginTop: 24, padding: '12px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="navbar-avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-logout" onClick={logout}>
          <span>⇥</span>
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  )
}
