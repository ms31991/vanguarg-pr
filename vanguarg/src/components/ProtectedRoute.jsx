import { Navigate } from 'react-router-dom'

export function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token')

  let user = null
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    user = null
  }

  const isAdmin = user?.roles?.includes('Admin')

  if (!token) {
    return <Navigate to="/secret/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}