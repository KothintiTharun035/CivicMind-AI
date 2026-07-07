import React, { useState } from 'react'
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [profileOpen, setProfileOpen] =
    useState(false)

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const handleLogout = () => {
    setProfileOpen(false)
    setMobileOpen(false)

    logout()
    navigate('/login')
  }

  const getHomePath = () => {
    if (!user) {
      return '/login'
    }

    if (user.role === 'CITIZEN') {
      return '/my-issues'
    }

    return '/'
  }

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-civic-50 text-civic-700'
        : 'text-gray-600 hover:text-civic-700 hover:bg-gray-50'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-civic-50 text-civic-700'
        : 'text-gray-700 hover:bg-gray-50'
    }`

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const userInitial =
    user?.fullName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* =========================
              BRAND
          ========================= */}
          <Link
            to={getHomePath()}
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 rounded-xl bg-civic-700 text-white flex items-center justify-center font-bold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
              C
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-bold text-gray-900 leading-tight">
                CivicMind
                <span className="text-civic-700">
                  {' '}AI
                </span>
              </p>

              <p className="text-[11px] text-gray-500">
                Smart Civic Platform
              </p>
            </div>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}
          <div className="hidden md:flex items-center gap-1">

            {/* OFFICIAL + ADMIN */}
            {(user?.role === 'OFFICIAL' ||
              user?.role === 'ADMIN') && (
              <NavLink
                to="/"
                end
                className={navLinkClass}
              >
                Dashboard
              </NavLink>
            )}

            {/* CITIZEN */}
            {user?.role === 'CITIZEN' && (
              <>
                <NavLink
                  to="/my-issues"
                  className={navLinkClass}
                >
                  My Issues
                </NavLink>

                <NavLink
                  to="/report"
                  className={navLinkClass}
                >
                  Report Issue
                </NavLink>
              </>
            )}

            {/* ADMIN */}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={navLinkClass}
              >
                Administration
              </NavLink>
            )}

          </div>

          {/* =========================
              RIGHT SECTION
          ========================= */}
          <div className="flex items-center gap-2">

            {user ? (
              <>
                {/* NOTIFICATION BUTTON */}
                <button
                  type="button"
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:text-civic-700 hover:bg-gray-100 transition"
                  aria-label="Notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082A23.848 23.848 0 0118 18c-1.5-1.5-2-3.5-2-6a4 4 0 10-8 0c0 2.5-.5 4.5-2 6a23.848 23.848 0 013.143-.918m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>

                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* PROFILE */}
                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen((prev) => !prev)
                    }
                    className="flex items-center gap-3 rounded-xl p-1.5 pr-3 hover:bg-gray-100 transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-civic-700 text-white flex items-center justify-center font-semibold">
                      {userInitial}
                    </div>

                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900 max-w-[140px] truncate">
                        {user.fullName}
                      </p>

                      <p className="text-[11px] text-gray-500 capitalize">
                        {user.role?.toLowerCase()}
                      </p>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`hidden lg:block w-4 h-4 text-gray-500 transition-transform ${
                        profileOpen
                          ? 'rotate-180'
                          : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* PROFILE DROPDOWN */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">

                      <div className="p-4 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {user.email}
                        </p>

                        <span className="inline-flex mt-3 px-2.5 py-1 rounded-full bg-civic-50 text-civic-700 text-xs font-semibold">
                          {user.role}
                        </span>
                      </div>

                      <div className="p-2">

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          Sign Out
                        </button>

                      </div>

                    </div>
                  )}

                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setMobileOpen((prev) => !prev)
                  }
                  className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </>
            ) : (
            <>
              {location.pathname === '/login' && (
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-civic-700 text-white text-sm font-semibold shadow-sm hover:bg-civic-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  Create Account

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                  
                  </span>
                </Link>
              )}

              {location.pathname === '/register' && (
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-civic-700 text-white text-sm font-semibold shadow-sm hover:bg-civic-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  Log In

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    
                  </span>
                </Link>
              )}

              {location.pathname !== '/login' &&
                location.pathname !== '/register' && (
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-civic-700 text-white text-sm font-semibold shadow-sm hover:bg-civic-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Log In

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                )}
            </>
          )}

          </div>

        </div>

        {/* =========================
            MOBILE NAVIGATION
        ========================= */}
        {user && mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">

            {(user.role === 'OFFICIAL' ||
              user.role === 'ADMIN') && (
              <NavLink
                to="/"
                end
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                Dashboard
              </NavLink>
            )}

            {user.role === 'CITIZEN' && (
              <>
                <NavLink
                  to="/my-issues"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  My Issues
                </NavLink>

                <NavLink
                  to="/report"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  Report Issue
                </NavLink>
              </>
            )}

            {user.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                Administration
              </NavLink>
            )}

          </div>
        )}

      </div>
    </nav>
  )
}