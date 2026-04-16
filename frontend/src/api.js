import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api'
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config
})

// ── STUDENT PROFILE ──────────────────────────────────────────
export const getProfile    = ()     => API.get('/student/profile/')
export const updateProfile = (data) => API.put('/student/profile/', data)

// ── SEARCH OFFERS ─────────────────────────────────────────────
export const searchOffers = (params) => API.get('/offers/', { params })
export const applyToOffer = (offer_id) => API.post('/student/apply/', { offer_id })

// ── MY APPLICATIONS ───────────────────────────────────────────
export const getMyApplications = () => API.get('/student/applications/')

export default API