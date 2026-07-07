import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { issueAPI } from '../services/api'



const timelineColors = {
  PENDING: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
  },

  ASSIGNED: {
    dot: 'bg-purple-500',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },

  REASSIGNED: {
    dot: 'bg-orange-500',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
  },

  IN_PROGRESS: {
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },

  RESOLVED: {
    dot: 'bg-green-500',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
  },

  REJECTED: {
    dot: 'bg-red-500',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
  },
}






export default function IssueDetails() {
  const { id } = useParams()

  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setError('')

        const { data } = await issueAPI.getById(id)

        setIssue(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load issue details')
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Loading issue details...
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Issue not found'}
        </div>
      </div>
    )
  }

  // =========================
  // MERGE STATUS + ASSIGNMENT
  // HISTORY INTO ONE TIMELINE
  // =========================

  const statusEvents = (issue.statusHistory || []).map(
    (history) => ({
      type: 'STATUS',
      date: history.changedAt,
      status: history.status,
      changedByName: history.changedByName,
      remark: history.remark,
    })
  )

  const assignmentEvents = (
    issue.assignmentHistory || []
  ).map((history, index) => ({
    type: 'ASSIGNMENT',
    date: history.assignedAt,

    // First event = ASSIGNED
    // Later events = REASSIGNED
    label:
      index === 0
        ? 'ASSIGNED'
        : 'REASSIGNED',

    officialName: history.officialName,
    officialEmail: history.officialEmail,
    assignedByName: history.assignedByName,
  }))

  const timelineEvents = [
    ...statusEvents,
    ...assignmentEvents,
  ].sort((a, b) => {
    const dateA = a.date
      ? new Date(a.date).getTime()
      : 0

    const dateB = b.date
      ? new Date(b.date).getTime()
      : 0

    return dateA - dateB
  })

  const latestEvent =
  timelineEvents.length > 0
    ? timelineEvents[timelineEvents.length - 1]
    : null

const displayStatus = latestEvent
  ? latestEvent.type === 'ASSIGNMENT'
    ? latestEvent.label
    : latestEvent.status
  : issue.status

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <Link
      to="/"
      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:-translate-x-1 transition-all duration-200">
      <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">
        ←
      </span>

      <span>
        Back to Dashboard
      </span>
    </Link>

      <div className="bg-white shadow rounded-xl p-8 mt-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {issue.title}
            </h1>

            <p className="text-gray-500 mt-2">
              Reported by{' '}
              {issue.reportedByName || 'Unknown'}
            </p>
          </div>

          <span
          className={`px-4 py-2 rounded-full font-medium ${
            timelineColors[displayStatus]?.badge ||
            'bg-gray-100 text-gray-700'
          }`}
        >
          {displayStatus}
        </span>

        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">
            Description
          </h2>

          <p className="text-gray-700 mt-2 leading-7">
            {issue.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Category
            </p>

            <p className="font-semibold mt-1">
              {issue.category || '-'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Urgency
            </p>

            <p className="font-semibold mt-1">
              {issue.urgency || '-'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Address
            </p>

            <p className="font-semibold mt-1">
              {issue.address || '-'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Reported Date
            </p>

            <p className="font-semibold mt-1">
              {issue.createdAt
                ? new Date(
                    issue.createdAt
                  ).toLocaleString()
                : '-'}
            </p>
          </div>

        </div>

        {/* Combined Activity Timeline */}
        <div className="mt-10 border-t pt-8">

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Status History
          </h2>

          {timelineEvents.length > 0 ? (

            <div className="relative">

              {timelineEvents.map((event, index) => (

                <div
                  key={`${event.type}-${index}`}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >

                  {/* Vertical Timeline Line */}
                  {index !==
                    timelineEvents.length - 1 && (
                    <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-200" />
                  )}

                  {/* Timeline Dot */}

                  <div className="relative z-10 flex-shrink-0">

                    <div
                      className={`w-6 h-6 rounded-full border-4 border-white shadow ${
                        timelineColors[
                          event.type === 'ASSIGNMENT'
                            ? event.label
                            : event.status
                        ]?.dot || 'bg-gray-500'
                      }`}
                    />

                  </div>

                  {/* Event Information */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">

                    {event.type === 'STATUS' ? (

                      <>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                          <span
                          className={`font-semibold ${
                            timelineColors[event.status]?.text ||
                            'text-gray-900'
                          }`}
                        >
                          {event.status}
                        </span>

                          <span className="text-sm text-gray-500">
                            {event.date
                              ? new Date(
                                  event.date
                                ).toLocaleString()
                              : '-'}
                          </span>

                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                          Changed by{' '}
                          <span className="font-medium">
                            {event.changedByName ||
                              'Unknown'}
                          </span>
                        </p>

                        {event.remark && (
                          <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3">

                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Official Remark
                            </p>

                            <p className="text-sm text-gray-700 mt-1">
                              {event.remark}
                            </p>

                          </div>
                        )}
                      </>

                    ) : (

                      <>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                          <span
                            className={`font-semibold ${
                              timelineColors[event.label]?.text ||
                              'text-gray-900'
                            }`}
                          >
                            {event.label}
                          </span>

                      

                          <span className="text-sm text-gray-500">
                            {event.date
                              ? new Date(
                                  event.date
                                ).toLocaleString()
                              : '-'}
                          </span>

                        </div>

                        <p className="text-sm text-gray-700 mt-2">
                          Assigned to{' '}
                          <span className="font-semibold">
                            {event.officialName ||
                              'Unknown Official'}
                          </span>
                        </p>

                        {event.officialEmail && (
                          <p className="text-sm text-gray-500 mt-1">
                            {event.officialEmail}
                          </p>
                        )}

                        <p className="text-sm text-gray-600 mt-2">
                          Assigned by{' '}
                          <span className="font-medium">
                            {event.assignedByName ||
                              'Admin'}
                          </span>
                        </p>
                      </>

                    )}

                  </div>

                </div>
              ))}

            </div>

          ) : (

            <div className="bg-gray-50 rounded-lg p-5 text-gray-500">
              No history available for this issue.
            </div>

          )}

        </div>

      </div>
    </div>
  )
}