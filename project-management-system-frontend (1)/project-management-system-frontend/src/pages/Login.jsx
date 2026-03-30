import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Fill all fields'); return }
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">⬡</div>
          <div className="auth-brand-name">Project<span>MS</span></div>
          <div className="auth-brand-tagline">
            The modern workspace for high-velocity engineering teams.
          </div>
        </div>
        <div className="auth-features">
          {[
            { icon: '◫', text: 'Track projects across every stage' },
            { icon: '◻', text: 'Assign & prioritise tasks with ease' },
            { icon: '◈', text: 'Role-based access control' },
            { icon: '⬡', text: 'Real-time dashboard analytics' },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <span className="auth-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <div className="auth-form-title">Sign in</div>
          <div className="auth-form-subtitle">Enter your credentials to access your workspace.</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. admin"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign in →'}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>

          <div className="divider" />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo credentials</strong><br />
            admin / admin123 · manager1 / admin123 · dev1 / admin123
          </div>
        </div>
      </div>
    </div>
  )
}
