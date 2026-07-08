import { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import { useAuth } from '../services/AuthContext'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const formatDateTime = (dateValue) => {
  if (!dateValue) return '-'

  try {
    const dateString = String(dateValue)

    const normalizedDate =
      dateString.endsWith('Z') ||
      /[+-]\d{2}:\d{2}$/.test(dateString)
        ? dateString
        : `${dateString}Z`

    const date = new Date(normalizedDate)

    if (Number.isNaN(date.getTime())) {
      return '-'
    }

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  } catch {
    return '-'
  }
}


export default function AdminDashboard() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('ALL')

  const fetchAdminData = async () => {
    try {
      setError('')

      const [usersResponse, analyticsResponse] =
        await Promise.all([
          adminAPI.getAllUsers(),
          adminAPI.getAnalytics(),
        ])

      setUsers(usersResponse.data)
      setAnalytics(analyticsResponse.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load admin dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId)
      setError('')

      const { data } = await adminAPI.updateUserRole(
        userId,
        newRole
      )

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? data : user
        )
      )
    } catch (err) {
      console.error(err)
      setError('Failed to update user role')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Loading admin dashboard...
      </div>
    )
  }

  // =========================
  // COUNTS
  // =========================

  const totalUsers =
    analytics?.totalUsers ?? users.length

  const totalIssues =
    analytics?.totalIssues ?? 0

  const assignedIssues =
    analytics?.assignedIssues ?? 0

  const notAssignedIssues =
    analytics?.unassignedIssues ??
    Math.max(totalIssues - assignedIssues, 0)

  const citizenCount = users.filter(
    (user) => user.role === 'CITIZEN'
  ).length

  const officialCount = users.filter(
    (user) => user.role === 'OFFICIAL'
  ).length

  const adminCount = users.filter(
    (user) => user.role === 'ADMIN'
  ).length

  // =========================
  // TOP CARDS
  // =========================

  const cards = [
    {
      label: 'Total Users',
      value: totalUsers,
      description: 'Registered platform users',
      boxClass: 'bg-blue-50 border-blue-200',
      valueClass: 'text-blue-700',
      iconClass: 'bg-blue-100 text-blue-700',
      icon: 'U',
    },
    {
      label: 'Assigned Issues',
      value: assignedIssues,
      description: 'Issues assigned to officials',
      boxClass: 'bg-emerald-50 border-emerald-200',
      valueClass: 'text-emerald-700',
      iconClass: 'bg-emerald-100 text-emerald-700',
      icon: 'A',
    },
    {
      label: 'Not Assigned',
      value: notAssignedIssues,
      description: 'Issues awaiting assignment',
      boxClass: 'bg-amber-50 border-amber-200',
      valueClass: 'text-amber-700',
      iconClass: 'bg-amber-100 text-amber-700',
      icon: 'N',
    },
  ]

  // =========================
  // DONUT CHART DATA
  // =========================

  const statusData = [
    {
      name: 'Pending',
      value: analytics?.pendingIssues ?? 0,
    },
    {
      name: 'In Progress',
      value: analytics?.inProgressIssues ?? 0,
    },
    {
      name: 'Resolved',
      value: analytics?.resolvedIssues ?? 0,
    },
    {
      name: 'Rejected',
      value: analytics?.rejectedIssues ?? 0,
    },
  ]

  const STATUS_COLORS = [
    '#F59E0B',
    '#3B82F6',
    '#10B981',
    '#EF4444',
  ]

  const filteredUsers = users.filter((user) => {
  const searchValue = userSearch
    .trim()
    .toLowerCase()

  const matchesSearch =
    !searchValue ||
    user.fullName
      ?.toLowerCase()
      .includes(searchValue) ||
    user.email
      ?.toLowerCase()
      .includes(searchValue)

  const matchesRole =
    userRoleFilter === 'ALL' ||
    user.role === userRoleFilter

  return matchesSearch && matchesRole
})

const userFilterCounts = {
  ALL: users.length,

  ADMIN: users.filter(
    (user) => user.role === 'ADMIN'
  ).length,

  OFFICIAL: users.filter(
    (user) => user.role === 'OFFICIAL'
  ).length,

  CITIZEN: users.filter(
    (user) => user.role === 'CITIZEN'
  ).length,
}

const userRoleTabs = [
  {
    key: 'ALL',
    label: 'All Users',
  },
  {
    key: 'ADMIN',
    label: 'Admins',
  },
  {
    key: 'OFFICIAL',
    label: 'Officials',
  },
  {
    key: 'CITIZEN',
    label: 'Citizens',
  },
]

  // =========================
  // OFFICIAL WORKLOAD
  // =========================

  const officials = users.filter(
    (user) => user.role === 'OFFICIAL'
  )

  const officialWorkload =
    analytics?.officialWorkload ?? []

  const getOfficialIssueCount = (official) => {
    const workload = officialWorkload.find(
      (item) =>
        item.officialId === official.id ||
        item.id === official.id ||
        item.email === official.email ||
        item.officialEmail === official.email
    )

    return (
      workload?.count ??
      workload?.issueCount ??
      workload?.activeIssues ??
      0
    )
  }

  const maxWorkload = Math.max(
    ...officials.map((official) =>
      getOfficialIssueCount(official)
    ),
    1
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-purple-600" />
          ADMINISTRATION CENTER
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Manage users, assignments, roles, and official workload
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* TOP ADMINISTRATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.boxClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.label}
                </p>

                <p
                  className={`text-3xl font-bold mt-3 ${card.valueClass}`}
                >
                  {card.value}
                </p>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${card.iconClass}`}
              >
                {card.icon}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {card.description}
            </p>
          </div>
        ))}
      </div>

            {/* ANALYTICS + ADMINISTRATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 items-stretch">

        {/* ISSUE STATUS DONUT CHART */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full">

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Issue Status Distribution
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Current distribution of civic issue statuses
            </p>
          </div>

          <div className="relative w-full h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={78}
                  outerRadius={118}
                  paddingAngle={3}
                  cornerRadius={8}
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[
                          index % STATUS_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow:
                      '0 10px 25px rgba(0,0,0,0.08)',
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={20}
                  iconType="circle"
                  formatter={(value) => (
                    <span
                      style={{
                        color: '#4b5563',
                        fontSize: '13px',
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TOTAL */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center -mt-10">
                <p className="text-4xl font-bold text-gray-900">
                  {totalIssues}
                </p>

                <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wide">
                  Total Issues
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ADMINISTRATION OVERVIEW */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Administration Overview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Overview of registered users by application role
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* USERS */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    Users
                  </p>

                  <p className="text-2xl font-bold text-blue-800 mt-2">
                    {totalUsers}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  U
                </div>
              </div>

              <p className="text-xs text-blue-600 mt-3">
                Registered accounts
              </p>
            </div>

            {/* ADMINS */}
            <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                    Admins
                  </p>

                  <p className="text-2xl font-bold text-purple-800 mt-2">
                    {adminCount}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  A
                </div>
              </div>

              <p className="text-xs text-purple-600 mt-3">
                Active admin accounts
              </p>
            </div>

            {/* OFFICIALS */}
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    Officials
                  </p>

                  <p className="text-2xl font-bold text-amber-800 mt-2">
                    {officialCount}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  O
                </div>
              </div>

              <p className="text-xs text-amber-600 mt-3">
                Active official accounts
              </p>
            </div>

            {/* CITIZENS */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    Citizens
                  </p>

                  <p className="text-2xl font-bold text-emerald-800 mt-2">
                    {citizenCount}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  C
                </div>
              </div>

              <p className="text-xs text-emerald-600 mt-3">
                Registered citizen accounts
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* OFFICIAL WORKLOAD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Official Workload
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Assignment load across official accounts
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            {officialCount} Officials
          </div>
        </div>

        {officials.length > 0 ? (
          <div className="space-y-5">
            {officials.map((official) => {
              const issueCount =
                getOfficialIssueCount(official)

              const workloadWidth =
                (issueCount / maxWorkload) * 100

              return (
                <div
                  key={official.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {official.fullName}
                      </p>

                      <p className="text-xs text-gray-500 truncate mt-1">
                        {official.email}
                      </p>
                    </div>

                    <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      {issueCount} Issues
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${workloadWidth}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No official accounts found
          </div>
        )}

      </div>

            {/* USER MANAGEMENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              User Management
            </h2>

            <p className="text-gray-500 mt-1">
              View users and manage application roles
            </p>
          </div>

          <p className="text-sm text-gray-500">
            {users.length} registered users
          </p>

        </div>

        {/* SEARCH + USER ROLE FILTERS */}
<div className="mb-6">

  {/* SEARCH BAR */}
  <div className="relative mb-4">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
      />
    </svg>

    <input
      type="text"
      value={userSearch}
      onChange={(e) =>
        setUserSearch(e.target.value)
      }
      placeholder="Search users by name or email..."
      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
    />

  </div>

  {/* ROLE FILTER BUTTONS */}
  <div className="flex flex-wrap gap-3">

    {userRoleTabs.map((tab) => {
      const isActive =
        userRoleFilter === tab.key

      return (
        <button
          key={tab.key}
          type="button"
          onClick={() =>
            setUserRoleFilter(tab.key)
          }
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <span>
            {tab.label}
          </span>

          <span
            className={`min-w-[24px] h-6 px-1.5 rounded-lg flex items-center justify-center text-xs font-bold ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {userFilterCounts[tab.key]}
          </span>
        </button>
      )
    })}

  </div>

</div>

        {/* TABLE CONTAINER */}
        <div className="rounded-xl border border-gray-200 overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                  Created
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredUsers.map((user) => {
                const isCurrentUser =
                  user.email === currentUser?.email

                const initial =
                  user.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || 'U'

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >

                    {/* NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                          {initial}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.fullName}
                          </p>

                          {isCurrentUser && (
                            <p className="text-xs text-blue-600 mt-0.5">
                              Current account
                            </p>
                          )}
                        </div>

                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-4 text-gray-600">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={
                          updatingId === user.id ||
                          isCurrentUser
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value
                          )
                        }
                        className="border border-gray-200 rounded-xl px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <option value="CITIZEN">
                          CITIZEN
                        </option>

                        <option value="OFFICIAL">
                          OFFICIAL
                        </option>

                        <option value="ADMIN">
                          ADMIN
                        </option>
                      </select>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-gray-600">
                      {formatDateTime(user.createdAt)}
                    </td>

                  </tr>
                )
              })}

            </tbody>
          </table>

          {filteredUsers.length === 0 && (
          <div className="text-center py-12">

            <p className="font-semibold text-gray-700">
              No users found
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Try changing the search or user filter
            </p>

          </div>
        )}

        </div>
      </div>

    </div>
  )
}