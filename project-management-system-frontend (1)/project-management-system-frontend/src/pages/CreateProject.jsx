import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import projectService from '../services/projectService'
import userService    from '../services/userService'
import toast from 'react-hot-toast'

const STATUSES = ['PLANNED','IN_PROGRESS','ON_HOLD','COMPLETED','CANCELLED']

export default function CreateProject() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const isEdit    = Boolean(id)

  const [form, setForm] = useState({
    name: '', description: '', status: 'PLANNED',
    startDate: '', endDate: '', ownerId: user?.id ?? '',
  })
  const [users,   setUsers]   = useState([])
  const [saving,  setSaving]  = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    userService.getAll().then(r => setUsers(r.data)).catch(() => {})
    if (isEdit) {
      projectService.getById(id).then(r => {
        const p = r.data
        setForm({ name: p.name, description: p.description ?? '', status: p.status, startDate: p.startDate ?? '', endDate: p.endDate ?? '', ownerId: p.ownerId })
      }).catch(() => toast.error('Failed to load project')).finally(() => setLoading(false))
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name required'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await projectService.update(id, form)
        toast.success('Project updated!')
      } else {
        await projectService.create(form)
        toast.success('Project created!')
      }
      navigate('/projects')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Save failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div className="fade-in" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-heading">{isEdit ? 'Edit Project' : 'New Project'}</div>
          <div className="page-subheading">{isEdit ? 'Update project details.' : 'Fill in the details to create a new project.'}</div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. E-Commerce Platform" autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the project goals and scope…" style={{ minHeight: 110 }} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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

          <div className="divider" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" /> Saving…</> : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
