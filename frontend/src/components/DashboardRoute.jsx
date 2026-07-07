import { Navigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

export default function DashboardRoute({ children }) {
  const { user } = useAuth()

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Citizen cannot access main dashboard
  if (user.role === 'CITIZEN') {
    return <Navigate to="/my-issues" replace />
  }

  // Only OFFICIAL and ADMIN allowed
  if (
    user.role !== 'OFFICIAL' &&
    user.role !== 'ADMIN'
  ) {
    return <Navigate to="/login" replace />
  }

  return children
}