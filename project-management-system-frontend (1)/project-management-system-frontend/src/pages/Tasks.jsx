import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import taskService    from '../services/taskService'
import projectService from '../services/projectService'
import userService    from '../services/userService'
import TaskCard       from '../components/TaskCard'
import toast from 'react-hot-toast'

const STATUSES   = ['ALL', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
const PRIORITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const NEXT_STATUS = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'IN_REVIEW', IN_REVIEW: 'DONE' }

function emptyForm(projectId, userId) {
  return { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', projectId: projectId ?? '', assigneeId: userId ?? '' }
}

export default function Tasks() {
  const { isManager, user } = useAuth()

  const [tasks,    setTasks]    = useState([])
  const [projects, setProjects] = useState([])
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filterStatus,   setFilterStatus]   = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [filterProject,  setFilterProject]  = useState('ALL')
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(emptyForm())
  const [saving,   setSaving]   = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [tRes, pRes, uRes] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        userService.getAll().catch(() => ({ data: [] })),
      ])
      setTasks(tRes.data)
      setProjects(pRes.data)
      setUsers(uRes.data)
    } catch { toast.error('Failed to load tasks') }
    finally { setLoading(false) }
  }

  function openCreate() {
    setForm(emptyForm(projects[0]?.id ?? '', user.id))
    setModal('create')
  }

  function openEdit(task) {
    setForm({
      title:       task.title,
      description: task.description ?? '',
      status:      task.status,
      priority:    task.priority,
      dueDate:     task.dueDate ?? '',
      projectId:   task.projectId,
      assigneeId:  task.assigneeId ?? '',
    })
    setModal(task)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try {
      await taskService.delete(id)
      toast.success('Task deleted')
      setTasks(t => t.filter(x => x.id !== id))
    } catch { toast.error('Delete failed') }
  }

  async function handleStatusAdvance(task) {
    const next = NEXT_STATUS[task.status]
    if (!next) return
    try {
      const res = await taskService.updateStatus(task.id, next)
      setTasks(t => t.map(x => x.id === task.id ? res.data : x))
      toast.success(`Status → ${next.replace('_', ' ')}`)
    } catch { toast.error('Status update failed') }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title required'); return }
    if (!form.projectId)    { toast.error('Project required'); return }
    setSaving(true)
    try {
      const payload = { ...form, projectId: Number(form.projectId), assigneeId: form.assigneeId ? Number(form.assigneeId) : null }
      if (modal === 'create') {
        const res = await taskService.create(payload)
        setTasks(t => [res.data, ...t])
        toast.success('Task created!')
      } else {
        const res = await taskService.update(modal.id, payload)
        setTasks(t => t.map(x => x.id === modal.id ? res.data : x))
        toast.success('Task updated!')
      }
      setModal(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Save failed')
    } finally { setSaving(false) }
  }

  const visible = tasks.filter(t => {
    const matchStatus   = filterStatus   === 'ALL' || t.status   === filterStatus
    const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority
    const matchProject  = filterProject  === 'ALL' || String(t.projectId) === filterProject
    const matchSearch   = !search || t.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchPriority && matchProject && matchSearch
  })

  // Group by status for kanban-style counts
  const counts = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc }, {})

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-heading">Tasks</div>
          <div className="page-subheading">{tasks.length} task{tasks.length !== 1 ? 's' : ''} · {counts.DONE ?? 0} done</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>
        </div>
      </div>

      {/* Status summary pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['TODO','◻','badge-todo'],['IN_PROGRESS','▷','badge-in-progress'],['IN_REVIEW','◈','badge-in-review'],['DONE','✓','badge-done']].map(([s, icon, cls]) => (
          <button
            key={s}
            className={`badge ${cls}`}
            style={{ cursor: 'pointer', padding: '5px 14px', fontSize: '0.78rem', background: filterStatus === s ? undefined : 'transparent' }}
            onClick={() => setFilterStatus(filterStatus === s ? 'ALL' : s)}
          >
            {icon} {s.replace('_', ' ')} {counts[s] ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p}</option>)}
        </select>
        <select className="filter-select" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
          <option value="ALL">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : visible.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">◻</div>
            <div className="empty-state-title">No tasks found</div>
            <div className="empty-state-desc">Create your first task to start tracking work.</div>
          </div>
        </div>
      ) : (
        <div className="tasks-list">
          {visible.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusAdvance}
              canEdit={isManager() || t.assigneeId === user.id}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? 'New Task' : 'Edit Task'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Implement login flow" autoFocus />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Task details…" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Project *</label>
                  <select className="form-select" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})}>
                    <option value="">Select project…</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select className="form-select" value={form.assigneeId} onChange={e => setForm({...form, assigneeId: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {['TODO','IN_PROGRESS','IN_REVIEW','DONE'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    {['LOW','MEDIUM','HIGH','CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving…</> : modal === 'create' ? 'Create Task' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
