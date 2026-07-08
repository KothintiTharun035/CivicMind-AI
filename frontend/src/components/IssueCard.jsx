import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../utils/dateTime'


const urgencyColors = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
}

const statusColors = {
  PENDING: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function IssueCard({
  issue,
  onStatusChange,
  canManage,
}) {
  const [selectedStatus, setSelectedStatus] =
    useState(issue.status)

  const [remark, setRemark] = useState('')
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setSelectedStatus(issue.status)
  }, [issue.status])

  const handleUpdateStatus = async () => {
    if (selectedStatus === issue.status) {
      setError('Please select a different status')
      return
    }

    try {
      setUpdating(true)
      setError('')

      await onStatusChange(
        issue.id,
        selectedStatus,
        remark
      )

      setRemark('')
    } catch (err) {
      console.error(err)

      setError(
        err?.response?.data?.message ||
          'Failed to update issue status'
      )
    } finally {
      setUpdating(false)
    }
  }

        return (
          <div
        className={`p-4 ${
          canManage
            ? 'h-full flex flex-col'
            : ''
        }`}
      >

      {/* =========================
          ISSUE INFORMATION
      ========================= */}
      <div className="flex flex-col">

        {/* TITLE + URGENCY */}
        <div className="flex justify-between items-start gap-3">

          <Link
            to={`/issues/${issue.id}`}
            className="font-semibold text-lg text-gray-900 hover:text-blue-600 hover:underline line-clamp-2 min-h-[56px] flex-1"
          >
            {issue.title}
          </Link>

          <span
            className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
              urgencyColors[issue.urgency] || ''
            }`}
          >
            {issue.urgency}
          </span>

        </div>

        {/* DESCRIPTION - ONLY 2 LINES */}
        <p className="text-gray-600 text-sm leading-5 line-clamp-2 min-h-[40px] mt-1">
          {issue.description}
        </p>

        {/* CATEGORY + STATUS */}
        <div className="flex gap-2 flex-wrap text-xs mt-3">

          <span className="px-2 py-1 rounded-full bg-civic-50 text-civic-700">
            {issue.category}
          </span>

          <span
            className={`px-2 py-1 rounded-full ${
              statusColors[issue.status] || ''
            }`}
          >
            {issue.status}
          </span>

        </div>

        {/* REPORTED BY + DATE */}
        <div className="flex justify-between items-center text-xs text-gray-400 mt-3">

          <span className="truncate pr-3">
            Reported by{' '}
            {issue.reportedByName || 'Anonymous'}
          </span>

          <span className="flex-shrink-0">
            {formatDateTime(issue.createdAt)}
          </span>

        </div>

      </div>

      {/* =========================
          OFFICIAL STATUS UPDATE
      ========================= */}
      {canManage && (
        <div className="mt-auto pt-4">

          <p className="text-sm font-semibold text-gray-700 mb-2">
            Update Issue Status
          </p>

          <select
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            value={selectedStatus}
            disabled={updating}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setError('')
            }}
          >
            <option value="PENDING">
              PENDING
            </option>

            <option value="IN_PROGRESS">
              IN_PROGRESS
            </option>

            <option value="RESOLVED">
              RESOLVED
            </option>

            <option value="REJECTED">
              REJECTED
            </option>
          </select>

          <textarea
            value={remark}
            disabled={updating}
            onChange={(e) =>
              setRemark(e.target.value)
            }
            placeholder="Add official remark (optional)"
            rows="3"
            maxLength="500"
            className="mt-3 w-full h-[84px] border border-gray-300 rounded-lg p-2 text-sm resize-none"
          />

          <div className="h-[20px] flex justify-between items-center mt-1">

            <span className="text-xs text-gray-400">
              {remark.length}/500
            </span>

          </div>

          {/* FIXED ERROR AREA */}
          <div className="min-h-[20px]">

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={
              updating ||
              selectedStatus === issue.status
            }
            className="mt-2 w-full bg-civic-600 text-white py-2 rounded-lg hover:bg-civic-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating
              ? 'Updating...'
              : 'Update Status'}
          </button>

        </div>
      )}

    </div>
  )
}