import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)

      if (data.role === 'CITIZEN') {
        navigate('/my-issues', { replace: true })
      } else if (
        data.role === 'OFFICIAL' ||
        data.role === 'ADMIN'
      ) {
        navigate('/', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      console.error('Login failed:', err)
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2">

        {/* LEFT WELCOME PANEL */}
        <section className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">

          {/* Decorative background */}
          <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-blue-100/60" />
          <div className="absolute -bottom-48 -left-32 w-[520px] h-[520px] rounded-full bg-cyan-100/50" />

          <div className="relative z-10 w-full max-w-xl mx-auto px-12 py-14 flex flex-col justify-center">

            {/* Heading */}
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                SMART CIVIC PLATFORM
              </span>

              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-slate-900">
                Welcome Back!
              </h1>

              <p className="mt-4 text-lg leading-8 text-slate-600 max-w-md">
                Login to continue improving your community with{' '}
                <span className="font-semibold text-blue-600">
                  CivicMind AI.
                </span>
              </p>
            </div>

            {/* FEATURES */}
            <div className="space-y-5">

              {/* Feature 1 */}
              <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/70 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3l7 3v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6l7-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Report Issues
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Help us identify and resolve civic issues
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/70 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 11l2 2 4-4" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Track Progress
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Monitor the status of your reported issues
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/70 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 21h18" />
                    <path d="M5 21V10h14v11" />
                    <path d="M3 10l9-6 9 6" />
                    <path d="M8 14v3M12 14v3M16 14v3" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Better Communities
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Together we build better, smarter cities
                  </p>
                </div>
              </div>

            </div>

            {/* ENHANCED CIVIC CITY ILLUSTRATION */}
            <div className="relative mt-8 h-52 overflow-hidden">

              {/* Clouds */}
              <div className="absolute top-5 left-[3%]">
                <div className="relative w-20 h-8">
                  <div className="absolute bottom-0 left-0 w-20 h-5 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 left-3 w-8 h-8 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 right-3 w-7 h-7 bg-white/90 rounded-full" />
                </div>
              </div>

              <div className="absolute top-8 right-[5%]">
                <div className="relative w-24 h-8">
                  <div className="absolute bottom-0 left-0 w-24 h-5 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 left-4 w-8 h-8 bg-white/90 rounded-full" />
                  <div className="absolute bottom-1 right-4 w-7 h-7 bg-white/90 rounded-full" />
                </div>
              </div>

              {/* Birds */}
              <svg
                className="absolute top-8 left-[55%] w-20 h-10 text-blue-400"
                viewBox="0 0 100 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 15 Q12 8 19 15 Q26 8 33 15" />
                <path d="M55 25 Q62 18 69 25 Q76 18 83 25" />
              </svg>

              {/* Far city buildings */}
              <div className="absolute bottom-6 left-[4%] w-9 h-20 bg-blue-100 rounded-t-md">
                <div className="grid grid-cols-2 gap-1 p-2">
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-1.5 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[12%] w-12 h-28 bg-blue-200 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[23%] w-14 h-20 bg-blue-300 rounded-t-lg">
                <div className="grid grid-cols-3 gap-1.5 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[35%] w-11 h-32 bg-blue-200 rounded-t-lg">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-1 h-5 bg-blue-400" />
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[47%] w-16 h-24 bg-blue-400 rounded-t-lg">
                <div className="grid grid-cols-3 gap-2 p-2">
                  <span className="w-2 h-2 bg-blue-50 rounded-sm" />
                  <span className="w-2 h-2 bg-blue-50 rounded-sm" />
                  <span className="w-2 h-2 bg-blue-50 rounded-sm" />
                  <span className="w-2 h-2 bg-blue-50 rounded-sm" />
                  <span className="w-2 h-2 bg-blue-50 rounded-sm" />
                  <span className="w-2 h-2 bg-blue-50 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[63%] w-11 h-36 bg-blue-300 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[75%] w-14 h-24 bg-blue-200 rounded-t-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                  <span className="w-2 h-2 bg-white/80 rounded-sm" />
                </div>
              </div>

              <div className="absolute bottom-6 right-[2%] w-10 h-20 bg-blue-100 rounded-t-lg" />

              {/* Wind turbine */}
              <div className="absolute bottom-6 left-[57%]">
                <div className="relative w-20 h-32">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-24 bg-blue-400 rounded-full" />

                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 z-10" />

                  <div className="absolute top-[25px] left-[38px] w-16 h-1.5 bg-blue-400 origin-left rotate-[-25deg] rounded-full" />

                  <div className="absolute top-[29px] left-[38px] w-16 h-1.5 bg-blue-400 origin-left rotate-[95deg] rounded-full" />

                  <div className="absolute top-[28px] left-[38px] w-16 h-1.5 bg-blue-400 origin-left rotate-[210deg] rounded-full" />
                </div>
              </div>

              {/* Trees */}
              <div className="absolute bottom-6 left-[1%]">
                <div className="relative w-14 h-20">
                  <div className="absolute bottom-0 left-1/2 w-2 h-12 bg-blue-700 rounded-full" />
                  <div className="absolute bottom-8 left-0 w-12 h-12 bg-blue-500 rounded-full" />
                  <div className="absolute bottom-11 left-5 w-10 h-10 bg-blue-400 rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-6 left-[29%]">
                <div className="relative w-12 h-16">
                  <div className="absolute bottom-0 left-1/2 w-2 h-10 bg-blue-700 rounded-full" />
                  <div className="absolute bottom-7 left-0 w-11 h-11 bg-blue-500 rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-6 right-[14%]">
                <div className="relative w-14 h-20">
                  <div className="absolute bottom-0 left-1/2 w-2 h-12 bg-blue-700 rounded-full" />
                  <div className="absolute bottom-8 left-0 w-12 h-12 bg-blue-500 rounded-full" />
                  <div className="absolute bottom-11 left-5 w-10 h-10 bg-blue-400 rounded-full" />
                </div>
              </div>

              {/* Ground */}
              <div className="absolute bottom-5 left-0 right-0 h-2 bg-blue-300 rounded-full" />

              {/* Small foreground bushes */}
              <div className="absolute bottom-5 left-[18%] w-10 h-6 bg-blue-500 rounded-t-full" />
              <div className="absolute bottom-5 left-[41%] w-12 h-7 bg-blue-500 rounded-t-full" />
              <div className="absolute bottom-5 right-[3%] w-11 h-7 bg-blue-500 rounded-t-full" />

            </div>

          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="flex items-center justify-center px-4 sm:px-6 py-10 bg-gradient-to-br from-white to-slate-50">

          <div className="w-full max-w-md">

            {/* Mobile heading */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome Back!
              </h1>

              <p className="text-slate-500 mt-2">
                Continue improving your community
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8">

              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3l7 3v5c0 4.8-2.9 8.3-7 10-4.1-1.7-7-5.2-7-10V6l7-3z" />
                  <path d="M10 12h5" />
                  <path d="M13 9l3 3-3 3" />
                </svg>
              </div>

              <div className="text-center mt-5 mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Log In
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Enter your credentials to access your account
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
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0116 0" />
                      </svg>
                    </span>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      autoComplete="email"
                      className="w-full h-12 pl-16 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      autoComplete="current-password"
                      className="w-full h-12 pl-16 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
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
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="inline-flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <span>Log In</span>
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

              {/* REGISTER LINK */}
              <p className="text-sm text-center text-slate-600">
                No account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Register
                </Link>
              </p>

            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              Secure access to your CivicMind AI account
            </p>

          </div>
        </section>

      </div>
    </div>
  )
}