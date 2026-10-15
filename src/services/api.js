import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Intercept requests to attach JWT authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const itemsAPI = {
  getItems: (params) => api.get('/items', { params }),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (data) => api.post('/items', data),
  getMyItems: () => api.get('/items/my-items'),
  updateStatus: (id, status) => api.patch(`/items/${id}/status`, { status }),
};

export const matchesAPI = {
  getMatchesForItem: (itemId) => api.get(`/matches/item/${itemId}`),
  getMyMatches: () => api.get('/matches/my-matches'),
  getTopMatches: (minScore = 55.0) => api.get('/matches/top', { params: { minScore } }),
  updateMatchStatus: (id, status) => api.patch(`/matches/${id}/status`, { status }),
  recalculate: () => api.post('/matches/recalculate'),
};

export const claimsAPI = {
  submitClaim: (data) => api.post('/claims', data),
  getMyClaims: () => api.get('/claims/my-claims'),
  getClaimsForItem: (itemId) => api.get(`/claims/item/${itemId}`),
  getPendingClaims: () => api.get('/claims/pending'),
  reviewClaim: (id, status, notes) => api.post(`/claims/${id}/review`, { status, notes }),
};

export default api;
