import React, { createContext, useContext, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicmind_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })

    console.log('LOGIN RESPONSE:', data)
    console.log('USER ROLE:', data.role)

    persist(data)
    return data
  }

  const register = async (fullName, email, password) => {
    const { data } = await authAPI.register({
      fullName,
      email,
      password
    })

    persist(data)
    return data
  }

  const persist = (data) => {
    localStorage.setItem(
      'civicmind_token',
      data.token
    )

    const userInfo = {
      email: data.email,
      fullName: data.fullName,
      role: data.role
    }

    localStorage.setItem(
      'civicmind_user',
      JSON.stringify(userInfo)
    )

    setUser(userInfo)
  }

  const logout = () => {
    localStorage.removeItem('civicmind_token')
    localStorage.removeItem('civicmind_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}