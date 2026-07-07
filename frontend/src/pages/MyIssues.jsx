import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { issueAPI } from '../services/api'

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const urgencyColors = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
}

export default function MyIssues() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        setError('')

        const { data } = await issueAPI.getMyIssues()

        setIssues(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load your issues')
      } finally {
        setLoading(false)
      }
    }

    fetchMyIssues()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Loading your issues...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Issues
        </h1>

        <p className="text-gray-600 mt-2">
          Track civic issues reported by you
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!error && issues.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-xl font-semibold text-gray-900">
            No issues reported yet
          </h2>

          <p className="text-gray-500 mt-2">
            Report your first civic issue and track its progress here.
          </p>

          <Link
            to="/report"
            className="inline-block mt-5 bg-civic-600 text-white px-5 py-2 rounded-lg hover:bg-civic-700"
          >
            Report Issue
          </Link>

        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white rounded-xl shadow border border-gray-100 p-6"
          >

            <div className="flex justify-between items-start gap-4">

              <Link
                to={`/issues/${issue.id}`}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 hover:underline"
              >
                {issue.title}
              </Link>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  urgencyColors[issue.urgency] || ''
                }`}
              >
                {issue.urgency}
              </span>

            </div>

            <p className="text-gray-600 mt-3">
              {issue.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">

              <span className="text-xs px-3 py-1 rounded-full bg-civic-50 text-civic-700">
                {issue.category}
              </span>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  statusColors[issue.status] || ''
                }`}
              >
                {issue.status}
              </span>

            </div>

            <div className="mt-5 pt-4 border-t flex justify-between text-sm text-gray-500">

              <span>
                {issue.address || 'No address'}
              </span>

              <span>
                {issue.createdAt
                  ? new Date(issue.createdAt).toLocaleDateString()
                  : '-'}
              </span>

            </div>

            <Link
          to={`/issues/${issue.id}`}
          className="group mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all duration-300"
        >
          <span>View Details</span>

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

          </div>
        ))}

      </div>

    </div>
  )
} 