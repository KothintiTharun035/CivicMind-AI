import { Navigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

export default function CitizenRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'CITIZEN') {
    return <Navigate to="/" replace />
  }

  return children
}