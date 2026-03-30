import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import dashboardService from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PRIORITY_COLORS = {
  LOW: '#34d399', MEDIUM: '#fbbf24', HIGH: '#f87171', CRITICAL: '#fb923c',
}
const STATUS_COLORS = {
  TODO: '#8890b0', IN_PROGRESS: '#fbbf24', DONE: '#34d399',
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${color}22`, color }}>{icon}</div>
      <div className="stat-card-value">{value ?? 0}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getStats()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loader"><div className="spinner" /></div>
  if (!stats)  return null

  const taskStatusData = [
    { name: 'To Do',       value: stats.todoTasks,       fill: STATUS_COLORS.TODO },
    { name: 'In Progress', value: stats.inProgressTasks, fill: STATUS_COLORS.IN_PROGRESS },
    { name: 'Done',        value: stats.doneTasks,        fill: STATUS_COLORS.DONE },
  ]
  const projectStatusData = [
    { name: 'Planned',     value: stats.plannedProjects,    fill: '#22d3ee' },
    { name: 'In Progress', value: stats.inProgressProjects, fill: '#fbbf24' },
    { name: 'Completed',   value: stats.completedProjects,  fill: '#34d399' },
  ]
  const priorityData = stats.tasksByPriority
    ? Object.entries(stats.tasksByPriority).map(([k, v]) => ({
        name: k, tasks: v, fill: PRIORITY_COLORS[k] ?? '#5b6ef5',
      }))
    : []

  const tooltipStyle = { background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-heading">Good {greeting()}, {user?.username} 👋</div>
          <div className="page-subheading">Here's what's happening across your workspace today.</div>
        </div>
        <div className="page-header-actions">
          <Link to="/projects/new" className="btn btn-primary">+ New Project</Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="stats-grid">
        <StatCard icon="◫" value={stats.totalProjects}  label="Total Projects"  color="var(--accent)" />
        <StatCard icon="◻" value={stats.totalTasks}     label="Total Tasks"     color="var(--cyan)" />
        <StatCard icon="◈" value={stats.totalUsers}     label="Team Members"    color="var(--purple)" />
        <StatCard icon="⚠" value={stats.overdueTasks}   label="Overdue Tasks"   color="var(--red)" />
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Tasks by Status</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}
                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false} fontSize={11}>
                {taskStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Projects by Status</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {projectStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Bar */}
      {priorityData.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Tasks by Priority</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityData} barSize={40}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(91,110,245,0.08)' }} contentStyle={tooltipStyle} />
              <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                {priorityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent rows */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Projects</span>
            <Link to="/projects" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {stats.recentProjects?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentProjects.map(p => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{p.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{p.taskCount} task{p.taskCount !== 1 ? 's' : ''} · {p.ownerUsername}</div>
                  </div>
                  <span className={`badge badge-${(p.status ?? '').toLowerCase().replace('_', '-')}`}>{p.status?.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◫</div>
              <div className="empty-state-title">No projects yet</div>
              <Link to="/projects/new" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Create one</Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Tasks</span>
            <Link to="/tasks" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {stats.recentTasks?.length ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {stats.recentTasks.map(t => (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--bg-elevated)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
                  <div style={{ width:3, height:32, borderRadius:99, background: PRIORITY_COLORS[t.priority] ?? 'var(--border)', flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{t.projectName}</div>
                  </div>
                  <span className={`badge badge-${(t.status ?? '').toLowerCase().replace('_', '-')}`} style={{ flexShrink:0 }}>
                    {t.status?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◻</div>
              <div className="empty-state-title">No tasks yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
