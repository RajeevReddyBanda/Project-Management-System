import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import projectService from '../services/projectService'
import userService    from '../services/userService'
import ProjectCard    from '../components/ProjectCard'
import toast from 'react-hot-toast'

const STATUSES = ['ALL', 'PLANNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']

export default function Projects() {
  const { isManager, user } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('ALL')
  const [modal,    setModal]    = useState(null) // null | 'create' | project obj
  const [form,     setForm]     = useState(emptyForm())
  const [saving,   setSaving]   = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [pRes, uRes] = await Promise.all([
        projectService.getAll(),
        userService.getAll().catch(() => ({ data: [] })),
      ])
      setProjects(pRes.data)
      setUsers(uRes.data)
    } catch { toast.error('Failed to load projects') }
    finally { setLoading(false) }
  }

  function emptyForm() {
    return { name: '', description: '', status: 'PLANNED', startDate: '', endDate: '', ownerId: '' }
  }

  function openCreate() {
    setForm({ ...emptyForm(), ownerId: user.id })
    setModal('create')
  }

  function openEdit(project) {
    setForm({
      name:        project.name,
      description: project.description ?? '',
      status:      project.status,
      startDate:   project.startDate ?? '',
      endDate:     project.endDate   ?? '',
      ownerId:     project.ownerId,
    })
    setModal(project)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project? All tasks will be removed.')) return
    try {
      await projectService.delete(id)
      toast.success('Project deleted')
      setProjects(p => p.filter(x => x.id !== id))
    } catch { toast.error('Delete failed') }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.ownerId)      { toast.error('Owner is required'); return }
    setSaving(true)
    try {
      if (modal === 'create') {
        const res = await projectService.create(form)
        setProjects(p => [res.data, ...p])
        toast.success('Project created!')
      } else {
        const res = await projectService.update(modal.id, form)
        setProjects(p => p.map(x => x.id === modal.id ? res.data : x))
        toast.success('Project updated!')
      }
      setModal(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Save failed')
    } finally { setSaving(false) }
  }

  const visible = projects.filter(p => {
    const matchFilter = filter === 'ALL' || p.status === filter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-heading">Projects</div>
          <div className="page-subheading">{projects.length} project{projects.length !== 1 ? 's' : ''} in workspace</div>
        </div>
        {isManager() && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : visible.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">◫</div>
            <div className="empty-state-title">No projects found</div>
            <div className="empty-state-desc">
              {isManager() ? 'Create your first project to get started.' : 'No projects match your filters.'}
            </div>
          </div>
        </div>
      ) : (
        <div className="projects-grid">
          {visible.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={openEdit}
              onDelete={handleDelete}
              canEdit={isManager()}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? 'New Project' : 'Edit Project'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. E-Commerce Platform" autoFocus />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What is this project about?" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {STATUSES.slice(1).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Owner *</label>
                  <select className="form-select" value={form.ownerId} onChange={e => setForm({...form, ownerId: Number(e.target.value)})}>
                    <option value="">Select owner…</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-input" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving…</> : modal === 'create' ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
