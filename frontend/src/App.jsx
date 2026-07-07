import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './services/AuthContext'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import IssueDetails from './pages/IssueDetails'
import MyIssues from './pages/MyIssues'
import CitizenRoute from './components/CitizenRoute'
import DashboardRoute from './components/DashboardRoute'


export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<CitizenRoute><ReportIssue /></CitizenRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/issues/:id" element={<IssueDetails />} />
          <Route path="/my-issues" element={<CitizenRoute><MyIssues /></CitizenRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
