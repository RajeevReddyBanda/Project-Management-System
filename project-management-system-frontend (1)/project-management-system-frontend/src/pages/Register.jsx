import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'USER' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) { toast.error('Fill all required fields'); return }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await register({ username: form.username, email: form.email, password: form.password, role: form.role })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">⬡</div>
          <div className="auth-brand-name">Project<span>MS</span></div>
          <div className="auth-brand-tagline">Join the workspace and start shipping faster.</div>
        </div>
        <div className="auth-features">
          {[
            { icon: '◫', text: 'Manage unlimited projects' },
            { icon: '◻', text: 'Collaborate with your team' },
            { icon: '◈', text: 'Track progress in real time' },
            { icon: '⬡', text: 'Stay on top of deadlines' },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <span className="auth-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-box">
          <div className="auth-form-title">Create account</div>
          <div className="auth-form-subtitle">Fill in your details to get started.</div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-input" name="username" value={form.username} onChange={handleChange} placeholder="johndoe" autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                  <option value="USER">User</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm *</label>
                <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Creating…</> : 'Create account →'}
            </button>
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
