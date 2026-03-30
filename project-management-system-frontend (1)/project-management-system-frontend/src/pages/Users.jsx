import { useState, useEffect } from 'react'
import userService from '../services/userService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ROLES = ['ADMIN', 'MANAGER', 'USER']

export default function Users() {
  const { user: me } = useAuth()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [changing, setChanging] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await userService.getAll()
      setUsers(res.data)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  async function handleRoleChange(userId, newRole) {
    if (userId === me.id) { toast.error("Can't change your own role"); return }
    setChanging(userId)
    try {
      const res = await userService.updateRole(userId, newRole)
      setUsers(u => u.map(x => x.id === userId ? res.data : x))
      toast.success('Role updated')
    } catch { toast.error('Role update failed') }
    finally { setChanging(null) }
  }

  async function handleDelete(userId) {
    if (userId === me.id) { toast.error("Can't delete your own account"); return }
    if (!window.confirm('Delete this user? This action cannot be undone.')) return
    try {
      await userService.delete(userId)
      setUsers(u => u.filter(x => x.id !== userId))
      toast.success('User deleted')
    } catch { toast.error('Delete failed') }
  }

  const visible = users.filter(u => {
    const matchRole   = roleFilter === 'ALL' || u.role === roleFilter
    const matchSearch = !search || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const roleCounts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc }, {})

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-heading">User Management</div>
          <div className="page-subheading">{users.length} registered user{users.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Role summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[['ADMIN','badge-admin'],['MANAGER','badge-manager'],['USER','badge-user']].map(([r, cls]) => (
          <div key={r} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 100 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{roleCounts[r] ?? 0}</div>
            <span className={`badge ${cls}`} style={{ width: 'fit-content' }}>{r}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: 16 }}>
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="ALL">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Projects</th>
                <th>Tasks</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                    No users match your search.
                  </td>
                </tr>
              ) : visible.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="navbar-avatar" style={{ flexShrink: 0 }}>
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.username}</div>
                        {u.id === me.id && <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>you</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td>
                    <select
                      className="filter-select"
                      value={u.role}
                      disabled={u.id === me.id || changing === u.id}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '5px 28px 5px 10px' }}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {changing === u.id && <span className="spinner" style={{ marginLeft: 6 }} />}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.ownedProjectsCount}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.assignedTasksCount}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    {u.id !== me.id ? (
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
