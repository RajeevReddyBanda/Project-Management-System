import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login        from '../pages/Login'
import Register     from '../pages/Register'
import Dashboard    from '../pages/Dashboard'
import Projects     from '../pages/Projects'
import CreateProject from '../pages/CreateProject'
import Tasks        from '../pages/Tasks'
import Users        from '../pages/Users'
import Sidebar      from '../components/Sidebar'
import Navbar       from '../components/Navbar'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader"><div className="spinner" /></div>
  if (!user)   return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      <Route path="/dashboard" element={
        <PrivateRoute><AppShell><Dashboard /></AppShell></PrivateRoute>
      } />
      <Route path="/projects" element={
        <PrivateRoute><AppShell><Projects /></AppShell></PrivateRoute>
      } />
      <Route path="/projects/new" element={
        <PrivateRoute><AppShell><CreateProject /></AppShell></PrivateRoute>
      } />
      <Route path="/projects/:id/edit" element={
        <PrivateRoute><AppShell><CreateProject /></AppShell></PrivateRoute>
      } />
      <Route path="/tasks" element={
        <PrivateRoute><AppShell><Tasks /></AppShell></PrivateRoute>
      } />
      <Route path="/users" element={
        <PrivateRoute adminOnly><AppShell><Users /></AppShell></PrivateRoute>
      } />

      <Route path="/"    element={<Navigate to="/dashboard" />} />
      <Route path="*"    element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
