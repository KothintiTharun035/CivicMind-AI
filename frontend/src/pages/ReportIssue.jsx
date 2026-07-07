import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { issueAPI } from '../services/api'

export default function ReportIssue() {
  const [form, setForm] = useState({ title: '', description: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await issueAPI.create(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit issue. Please log in first.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Report a Civic Issue</h1>
      <p className="text-gray-500 text-sm mb-6">
        Describe the issue. Our AI will automatically categorize it and assign an urgency level.
      </p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            placeholder="e.g. Large pothole on Main Street"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border rounded p-2"
            placeholder="Describe the issue in detail..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address (optional)</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Street, locality"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-civic-600 text-white px-4 py-2 rounded hover:bg-civic-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  )
}
