import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import './styles/main.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#34d399', secondary: 'var(--bg-elevated)' } },
            error:   { iconTheme: { primary: '#f87171', secondary: 'var(--bg-elevated)' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
