import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      await register(
        form.fullName,
        form.email,
        form.password
      )

      navigate('/')
    } catch (err) {
      console.error('Registration failed:', err)

      setError(
        err.response?.data?.message ||
          'Registration failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2">

        {/* LEFT COMMUNITY PANEL */}
        <section className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50">

          {/* Decorative background */}
          <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-emerald-100/60" />
          <div className="absolute -bottom-48 -left-32 w-[520px] h-[520px] rounded-full bg-cyan-100/60" />

          <div className="relative z-10 w-full max-w-xl mx-auto px-12 py-14 flex flex-col justify-center">

            {/* HEADING */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                JOIN YOUR COMMUNITY
              </span>

              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-slate-900">
                Create Your Account
              </h1>

              <p className="mt-4 text-lg leading-8 text-slate-600 max-w-md">
                Join{' '}
                <span className="font-semibold text-blue-600">
                  CivicMind AI
                </span>{' '}
                and be a part of the change. Together,
                let&apos;s build better communities.
              </p>
            </div>

            {/* ENHANCED COMMUNITY ILLUSTRATION */}
            <div className="relative mt-8 h-64 overflow-hidden">

              {/* SUN */}
              <div className="absolute top-5 right-[16%] w-14 h-14 rounded-full bg-amber-100/80">
                <div className="absolute inset-2 rounded-full bg-amber-200/80" />
              </div>

              {/* CLOUD 1 */}
              <div className="absolute top-8 left-[2%]">
                <div className="relative w-24 h-9">
                  <div className="absolute bottom-0 left-0 w-24 h-5 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 left-4 w-9 h-9 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 right-4 w-8 h-8 bg-white/90 rounded-full" />
                </div>
              </div>

              {/* CLOUD 2 */}
              <div className="absolute top-16 right-[2%]">
                <div className="relative w-28 h-10">
                  <div className="absolute bottom-0 left-0 w-28 h-5 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 left-5 w-10 h-10 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 right-5 w-8 h-8 bg-white/90 rounded-full" />
                </div>
              </div>

              {/* BIRDS */}
              <svg
                className="absolute top-8 left-[43%] w-24 h-12 text-emerald-400"
                viewBox="0 0 100 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 15 Q12 8 19 15 Q26 8 33 15" />
                <path d="M55 25 Q62 18 69 25 Q76 18 83 25" />
              </svg>

              {/* BACKGROUND CITY BUILDINGS */}

              {/* Building 1 */}
              <div className="absolute bottom-10 left-[5%] w-10 h-20 bg-emerald-100 rounded-t-md">
                <div className="grid grid-cols-2 gap-1.5 p-2">
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              {/* Building 2 */}
              <div className="absolute bottom-10 left-[14%] w-14 h-28 bg-cyan-100 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                </div>
              </div>

              {/* Building 3 */}
              <div className="absolute bottom-10 left-[27%] w-12 h-24 bg-emerald-200 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              {/* Building 4 */}
              <div className="absolute bottom-10 left-[39%] w-16 h-36 bg-cyan-200 rounded-t-lg">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-1.5 h-5 bg-cyan-400" />

                <div className="grid grid-cols-3 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              {/* Building 5 */}
              <div className="absolute bottom-10 left-[55%] w-12 h-20 bg-emerald-100 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              {/* Building 6 */}
              <div className="absolute bottom-10 left-[66%] w-14 h-32 bg-cyan-100 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                  <span className="w-2 h-2 bg-white/90 rounded-sm" />
                </div>
              </div>

              {/* Building 7 */}
              <div className="absolute bottom-10 right-[5%] w-12 h-24 bg-emerald-200 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              {/* PARK TREE LEFT */}
              <div className="absolute bottom-10 left-[1%]">
                <div className="relative w-16 h-24">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-14 bg-amber-700/70 rounded-full" />
                  <div className="absolute bottom-10 left-0 w-14 h-14 bg-emerald-400 rounded-full" />
                  <div className="absolute bottom-14 left-6 w-12 h-12 bg-emerald-500 rounded-full" />
                </div>
              </div>

              {/* TREE CENTER */}
              <div className="absolute bottom-10 left-[31%]">
                <div className="relative w-12 h-20">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-12 bg-amber-700/70 rounded-full" />
                  <div className="absolute bottom-8 left-0 w-12 h-12 bg-emerald-400 rounded-full" />
                </div>
              </div>

              {/* TREE RIGHT */}
              <div className="absolute bottom-10 right-[1%]">
                <div className="relative w-16 h-24">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-14 bg-amber-700/70 rounded-full" />
                  <div className="absolute bottom-10 left-0 w-14 h-14 bg-emerald-400 rounded-full" />
                  <div className="absolute bottom-14 left-6 w-12 h-12 bg-emerald-500 rounded-full" />
                </div>
              </div>

              {/* PARK BENCH */}
              <div className="absolute bottom-11 left-[15%] w-20 h-12">
                <div className="absolute top-1 left-0 right-0 h-3 bg-emerald-700 rounded-md" />
                <div className="absolute top-6 left-0 right-0 h-3 bg-emerald-700 rounded-md" />
                <div className="absolute bottom-0 left-2 w-2 h-8 bg-slate-600 rounded-full" />
                <div className="absolute bottom-0 right-2 w-2 h-8 bg-slate-600 rounded-full" />
              </div>

              {/* LAMP POST */}
              <div className="absolute bottom-10 left-[52%] w-8 h-28">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-24 bg-slate-600 rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-700 rounded-t-full" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-100 rounded-full" />
              </div>

              {/* RECYCLE BIN 1 */}
              <div className="absolute bottom-10 left-[60%] w-10 h-14 bg-emerald-600 rounded-t-lg flex items-center justify-center text-white font-bold shadow-sm">
                ♻
              </div>

              {/* RECYCLE BIN 2 */}
              <div className="absolute bottom-10 left-[69%] w-10 h-14 bg-blue-600 rounded-t-lg flex items-center justify-center text-white font-bold shadow-sm">
                ♻
              </div>

              {/* GROUND */}
              <div className="absolute bottom-8 left-0 right-0 h-3 bg-emerald-200 rounded-full" />

              {/* FOREGROUND BUSHES */}
              <div className="absolute bottom-8 left-[8%] w-12 h-7 bg-emerald-500 rounded-t-full" />
              <div className="absolute bottom-8 left-[35%] w-14 h-8 bg-emerald-400 rounded-t-full" />
              <div className="absolute bottom-8 right-[15%] w-16 h-8 bg-emerald-500 rounded-t-full" />

            </div>

            {/* SECURITY CARD */}
            <div className="mt-3 max-w-sm rounded-2xl border border-emerald-200 bg-white/70 backdrop-blur-sm p-4 flex items-center gap-4 shadow-sm">

              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-7 h-7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3l7 3v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Your information is safe with us.
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-5">
                  We use secure technology to protect your data.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* RIGHT REGISTER PANEL */}
        <section className="flex items-center justify-center px-4 sm:px-6 py-10 bg-gradient-to-br from-white to-slate-50">

          <div className="w-full max-w-md">

            {/* Mobile heading */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Create Your Account
              </h1>

              <p className="text-slate-500 mt-2">
                Join CivicMind AI and be part of the change
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8">

              {/* ICON */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="9" cy="7" r="4" />
                  <path d="M2 21a7 7 0 0114 0" />
                  <path d="M19 8v6" />
                  <path d="M16 11h6" />
                </svg>
              </div>

              <div className="text-center mt-5 mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Create Account
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Fill in the details below to create your account
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* FULL NAME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 w-12 flex items-center justify-center text-slate-400 border-r border-slate-200">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0116 0" />
                      </svg>
                    </span>

                    <input
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="w-full h-12 pl-16 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 w-12 flex items-center justify-center text-slate-400 border-r border-slate-200">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                        <path d="M3 7l9 6 9-6" />
                      </svg>
                    </span>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="w-full h-12 pl-16 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 w-12 flex items-center justify-center text-slate-400 border-r border-slate-200">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 018 0v3" />
                      </svg>
                    </span>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password (min 6 characters)"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full h-12 pl-16 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                          <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5 9 5a16 16 0 01-2.1 2.7" />
                          <path d="M6.6 6.6C4.3 8.1 3 10 3 10s3.5 5 9 5c1 0 1.9-.2 2.7-.4" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="w-5 h-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Minimum 6 characters required
                  </p>
                </div>

                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="inline-flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <span>Register</span>
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </span>
                </button>

              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
                  or
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* LOGIN LINK */}
              <p className="text-sm text-center text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Log In
                </Link>
              </p>

            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              Your information is protected and securely handled
            </p>

          </div>
        </section>

      </div>
    </div>
  )
}