export const formatDateTime = (dateValue) => {
  if (!dateValue) return '-'

  try {
    const value = String(dateValue)

    // If backend timestamp has no timezone,
    // treat it as UTC because Render runs in UTC
    const normalizedValue =
      value.endsWith('Z') ||
      /[+-]\d{2}:\d{2}$/.test(value)
        ? value
        : `${value}Z`

    const date = new Date(normalizedValue)

    if (Number.isNaN(date.getTime())) {
      return '-'
    }

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return '-'
  }
}