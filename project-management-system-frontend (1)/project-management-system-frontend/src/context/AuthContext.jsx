import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('pms_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('pms_user')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch { logout() }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const res  = await authService.login(credentials)
    const data = res.data
    localStorage.setItem('pms_token', data.token)
    localStorage.setItem('pms_user', JSON.stringify(data))
    setToken(data.token)
    setUser(data)
    return data
  }

  const register = async (payload) => {
    const res  = await authService.register(payload)
    const data = res.data
    localStorage.setItem('pms_token', data.token)
    localStorage.setItem('pms_user', JSON.stringify(data))
    setToken(data.token)
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('pms_token')
    localStorage.removeItem('pms_user')
    setToken(null)
    setUser(null)
    toast.success('Logged out')
  }

  const isAdmin   = () => user?.role === 'ADMIN'
  const isManager = () => ['ADMIN', 'MANAGER'].includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
