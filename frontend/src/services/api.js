import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// =========================
// JWT TOKEN INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicmind_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// =========================
// AUTH API
// =========================
export const authAPI = {
  register: (data) =>
    api.post('/auth/register', data),

  login: (data) =>
    api.post('/auth/login', data),
}

// =========================
// ISSUE API
// =========================
export const issueAPI = {

  getAll: () =>
    api.get('/issues'),

  getById: (id) =>
    api.get(`/issues/${id}`),

  getMyIssues: () =>
    api.get('/issues/my'),

  getMine: () =>
    api.get('/issues/my'),

  getMyAssignedIssues: () =>
    api.get('/issues/assigned-to-me'),

  getByStatus: (status) =>
    api.get(`/issues/status/${status}`),

  create: (data) =>
    api.post('/issues', data),

  updateStatus: (
    id,
    status,
    remark
  ) =>
    api.patch(
      `/issues/${id}/status`,
      null,
      {
        params: {
          status,
          remark,
        },
      }
    ),

  // =========================
  // ADMIN ASSIGNS ISSUE
  // TO OFFICIAL
  // =========================
  assignOfficial: (
    issueId,
    officialId
  ) =>
    api.patch(
      `/issues/${issueId}/assign`,
      null,
      {
        params: {
          officialId,
        },
      }
    ),

  remove: (id) =>
    api.delete(`/issues/${id}`),
}

// =========================
// ADMIN API
// =========================
export const adminAPI = {

  getAllUsers: () =>
    api.get('/admin/users'),

  getAnalytics: () =>
    api.get('/admin/analytics'),

  // Get OFFICIAL users only
  getOfficials: () =>
    api.get('/admin/officials'),

  updateUserRole: (
    id,
    role
  ) =>
    api.patch(
      `/admin/users/${id}/role`,
      null,
      {
        params: {
          role,
        },
      }
    ),
}

export default api