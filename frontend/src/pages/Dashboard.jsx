import React, { useEffect, useMemo, useState } from 'react'
import { issueAPI, adminAPI } from '../services/api'
import { useAuth } from '../services/AuthContext'
import IssueCard from '../components/IssueCard'

export default function Dashboard() {
  const [issues, setIssues] = useState([])
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [summaryFilter, setSummaryFilter] = useState('ALL')

  const { user } = useAuth()

  const isOfficial = user?.role === 'OFFICIAL'
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    fetchIssues()

    if (isAdmin) {
      fetchOfficials()
    }
  }, [isAdmin, isOfficial])

  const fetchIssues = async () => {
    setLoading(true)

    try {
      let response

      if (isOfficial) {
        response = await issueAPI.getMyAssignedIssues()
      } else if (isAdmin) {
        response = await issueAPI.getAll()
      } else {
        setIssues([])
        return
      }

      setIssues(response.data)
    } catch (err) {
      console.error('Failed to load issues:', err)
      setIssues([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOfficials = async () => {
    try {
      const { data } = await adminAPI.getOfficials()
      setOfficials(data)
    } catch (err) {
      console.error('Failed to load officials:', err)
    }
  }

  const handleStatusChange = async (
    issueId,
    status,
    remark
  ) => {
    try {
      const { data: updatedIssue } =
        await issueAPI.updateStatus(
          issueId,
          status,
          remark
        )

      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? updatedIssue
            : issue
        )
      )
    } catch (err) {
      console.error(
        'Failed to update issue status:',
        err
      )

      throw err
    }
  }

  const handleAssignOfficial = async (
    issueId,
    officialId
  ) => {
    if (!officialId) {
      return
    }

    try {
      await issueAPI.assignOfficial(
        issueId,
        officialId
      )

      await fetchIssues()
    } catch (err) {
      console.error(
        'Failed to assign official:',
        err
      )
    }
  }

  const categories = useMemo(() => {
    return [
      ...new Set(
        issues
          .map((issue) => issue.category)
          .filter(Boolean)
      ),
    ].sort()
  }, [issues])

  const stats = useMemo(() => {
    return {
      total: issues.length,

      pending: issues.filter(
        (issue) => issue.status === 'PENDING'
      ).length,

      inProgress: issues.filter(
        (issue) => issue.status === 'IN_PROGRESS'
      ).length,

      resolved: issues.filter(
        (issue) => issue.status === 'RESOLVED'
      ).length,

      rejected: issues.filter(
        (issue) => issue.status === 'REJECTED'
      ).length,
    }
  }, [issues])

  const filteredIssues = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return issues.filter((issue) => {
      const title =
        issue.title?.toLowerCase() || ''

      const description =
        issue.description?.toLowerCase() || ''

      const address =
        issue.address?.toLowerCase() || ''

      const reportedBy =
        issue.reportedByName?.toLowerCase() || ''

      const assignedOfficial =
        issue.assignedOfficialName?.toLowerCase() || ''

      const matchesSearch =
        normalizedSearch === '' ||
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        address.includes(normalizedSearch) ||
        reportedBy.includes(normalizedSearch) ||
        assignedOfficial.includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'ALL' ||
        issue.status === statusFilter

      const matchesUrgency =
        urgencyFilter === 'ALL' ||
        issue.urgency === urgencyFilter

      const matchesCategory =
        categoryFilter === 'ALL' ||
        issue.category === categoryFilter

      const matchesSummary =
        summaryFilter === 'ALL' ||
        issue.status === summaryFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUrgency &&
        matchesCategory &&
        matchesSummary
      )
    })
  }, [
    issues,
    search,
    statusFilter,
    urgencyFilter,
    categoryFilter,
    summaryFilter,
  ])

  const hasActiveFilters =
    search.trim() !== '' ||
    statusFilter !== 'ALL' ||
    urgencyFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    summaryFilter !== 'ALL'

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('ALL')
    setUrgencyFilter('ALL')
    setCategoryFilter('ALL')
    setSummaryFilter('ALL')
  }

  const summaryCards = [
    {
      key: 'ALL',
      label: 'Total Issues',
      count: stats.total,
      description: 'All reported issues',
      countClass: 'text-violet-600',
      activeClass:
    '   bg-violet-50 border-violet-400 ring-1 ring-violet-300 shadow-md',
    },
    {
      key: 'PENDING',
      label: 'Pending',
      count: stats.pending,
      description: 'Awaiting action',
      countClass: 'text-amber-600',
      activeClass:
        'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-md',
    },
    {
      key: 'IN_PROGRESS',
      label: 'In Progress',
      count: stats.inProgress,
      description: 'Currently being handled',
      countClass: 'text-blue-600',
      activeClass:
        'bg-blue-50 border-blue-400 ring-1 ring-blue-400 shadow-md',
    },
    {
      key: 'RESOLVED',
      label: 'Resolved',
      count: stats.resolved,
      description: 'Successfully completed',
      countClass: 'text-emerald-600',
      activeClass:
        'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400 shadow-md',
    },
    {
      key: 'REJECTED',
      label: 'Rejected',
      count: stats.rejected,
      description: 'Reports not accepted',
      countClass: 'text-red-600',
      activeClass:
        'bg-red-50 border-red-400 ring-1 ring-red-400 shadow-md',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* DASHBOARD HEADER */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-50 text-civic-700 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-civic-600" />

              {isAdmin
                ? 'ADMIN CONTROL CENTER'
                : isOfficial
                  ? 'OFFICIAL WORKSPACE'
                  : 'CITIZEN PORTAL'}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {isAdmin
                ? 'Civic Operations Dashboard'
                : isOfficial
                  ? 'Assigned Issues Dashboard'
                  : 'My Civic Dashboard'}
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl leading-6">
              {isAdmin
                ? 'Monitor civic reports, track resolution progress, and coordinate issue assignments.'
                : isOfficial
                  ? 'Review assigned civic issues, update progress, and keep citizens informed.'
                  : 'Track your reported issues and stay informed about their resolution progress.'}
            </p>
          </div>

          

        </div>
      </div>

      {/* ONE SUMMARY SECTION ONLY */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

  {summaryCards.map((card) => {
    const isActive =
      summaryFilter === card.key

    return (
      <button
        key={card.key}
        type="button"
        onClick={() =>
          setSummaryFilter(card.key)
        }
        className={`text-left rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          isActive
            ? card.activeClass
            : 'bg-white border-gray-200 shadow-sm hover:border-gray-300'
        }`}
      >

        {/* CARD LABEL */}
        <p className="text-sm font-medium text-gray-600">
          {card.label}
        </p>

        {/* CARD NUMBER */}
        <p
          className={`text-3xl font-bold mt-3 ${card.countClass}`}
        >
          {card.count}
        </p>

        {/* CARD DESCRIPTION */}
        <p className="text-xs mt-4 text-gray-400">
          {card.description}
        </p>

      </button>
    )
  })}

</div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-8">

        <div className="mb-5">
          <label
            htmlFor="issue-search"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Search Issues
          </label>

          <input
            id="issue-search"
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by title, description, address, reporter, or assigned official..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500 focus:border-civic-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="RESOLVED">
                Resolved
              </option>

              <option value="REJECTED">
                Rejected
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="urgency-filter"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Urgency
            </label>

            <select
              id="urgency-filter"
              value={urgencyFilter}
              onChange={(e) =>
                setUrgencyFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="ALL">
                All Urgencies
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Category
            </label>

            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white"
            >
              <option value="ALL">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-5 pt-4 border-t border-gray-100">

          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {filteredIssues.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900">
              {issues.length}
            </span>{' '}
            issues
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-semibold transition"
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>
            {/* ISSUES SECTION */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Loading issues...
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

          <h2 className="text-xl font-semibold text-gray-900">
            No issues found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or filter options.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 bg-civic-600 text-white px-5 py-2.5 rounded-xl hover:bg-civic-700 transition"
            >
              Clear All Filters
            </button>
          )}

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">

          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* ISSUE CARD */}
              <div className="flex-1">
                <IssueCard
                  issue={issue}
                  canManage={isOfficial}
                  onStatusChange={handleStatusChange}
                />
              </div>

              {/* ADMIN ASSIGNMENT */}
              {isAdmin && (
                <div className="px-4 pb-4 mt-auto">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Official
                  </label>

                  <select
                    value={
                      issue.assignedOfficialId || ''
                    }
                    onChange={(e) =>
                      handleAssignOfficial(
                        issue.id,
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-civic-500"
                  >
                    <option value="">
                      Select Official
                    </option>

                    {officials.map((official) => (
                      <option
                        key={official.id}
                        value={official.id}
                      >
                        {official.fullName} - {official.email}
                      </option>
                    ))}
                  </select>

                  {issue.assignedOfficialName && (
                    <div className="mt-3 text-sm bg-blue-50 text-blue-700 rounded-xl p-3">
                      Assigned to:{' '}

                      <span className="font-semibold">
                        {issue.assignedOfficialName}
                      </span>
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  )
}