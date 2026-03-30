import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
  PLANNED:     'linear-gradient(90deg,#22d3ee,#3b82f6)',
  IN_PROGRESS: 'linear-gradient(90deg,#fbbf24,#f59e0b)',
  COMPLETED:   'linear-gradient(90deg,#34d399,#10b981)',
  ON_HOLD:     'linear-gradient(90deg,#a78bfa,#7c3aed)',
  CANCELLED:   'linear-gradient(90deg,#f87171,#ef4444)',
}

const STATUS_CLASS = {
  PLANNED:     'badge-planned',
  IN_PROGRESS: 'badge-in-progress',
  COMPLETED:   'badge-completed',
  ON_HOLD:     'badge-on-hold',
  CANCELLED:   'badge-cancelled',
}

function statusLabel(s) {
  return s?.replace('_', ' ') ?? '—'
}

export default function ProjectCard({ project, onEdit, onDelete, canEdit }) {
  const navigate = useNavigate()

  return (
    <div className="project-card fade-in" onClick={() => navigate(`/projects`)}>
      <div
        className="project-card-accent"
        style={{ background: STATUS_COLORS[project.status] ?? '#5b6ef5' }}
      />

      <div className="project-card-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="project-card-name">{project.name}</div>
          <span className={`badge ${STATUS_CLASS[project.status]}`}>
            {statusLabel(project.status)}
          </span>
        </div>
        {canEdit && (
          <div style={{ display: 'flex', gap: 6, marginLeft: 10 }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-icon" title="Edit" onClick={() => onEdit(project)}>✎</button>
            <button className="btn-icon" title="Delete" style={{ color: 'var(--red)' }} onClick={() => onDelete(project.id)}>⊗</button>
          </div>
        )}
      </div>

      <p className="project-card-desc">{project.description || 'No description provided.'}</p>

      <div className="project-card-meta">
        <span className="project-card-tasks">
          ◻ {project.taskCount ?? 0} task{project.taskCount !== 1 ? 's' : ''}
        </span>
        <div className="project-card-owner">
          <div className="mini-avatar">
            {project.ownerUsername?.slice(0, 2).toUpperCase() ?? 'U'}
          </div>
          <span>{project.ownerUsername}</span>
        </div>
      </div>

      {project.endDate && (
        <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Due {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )}
    </div>
  )
}
