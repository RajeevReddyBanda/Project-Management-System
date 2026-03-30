const PRIORITY_COLOR = {
  LOW:      'var(--green)',
  MEDIUM:   'var(--yellow)',
  HIGH:     'var(--red)',
  CRITICAL: 'var(--orange)',
}

const STATUS_CLASS = {
  TODO:        'badge-todo',
  IN_PROGRESS: 'badge-in-progress',
  IN_REVIEW:   'badge-in-review',
  DONE:        'badge-done',
}

const PRIORITY_CLASS = {
  LOW:      'badge-low',
  MEDIUM:   'badge-medium',
  HIGH:     'badge-high',
  CRITICAL: 'badge-critical',
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, canEdit }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'

  return (
    <div className="task-card fade-in">
      <div className="task-priority-bar" style={{ background: PRIORITY_COLOR[task.priority] ?? 'var(--border)' }} />

      <div className="task-card-body">
        <div className="task-card-title">{task.title}</div>
        <div className="task-card-meta">
          {task.projectName && (
            <span className="task-card-project">◫ {task.projectName}</span>
          )}
          {task.dueDate && (
            <span className="task-card-due" style={isOverdue ? { color: 'var(--red)' } : {}}>
              ⏱ {isOverdue ? '⚠ ' : ''}{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          {task.assigneeUsername && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              → {task.assigneeUsername}
            </span>
          )}
        </div>
      </div>

      <div className="task-card-right">
        <span className={`badge ${PRIORITY_CLASS[task.priority]}`}>{task.priority}</span>
        <span className={`badge ${STATUS_CLASS[task.status]}`}>{task.status?.replace('_', ' ')}</span>

        {canEdit && onStatusChange && task.status !== 'DONE' && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onStatusChange(task)}
            title="Advance status"
          >▷</button>
        )}

        {canEdit && (
          <>
            <button className="btn-icon" title="Edit" onClick={() => onEdit(task)}>✎</button>
            <button className="btn-icon" title="Delete" style={{ color: 'var(--red)' }} onClick={() => onDelete(task.id)}>⊗</button>
          </>
        )}
      </div>
    </div>
  )
}
