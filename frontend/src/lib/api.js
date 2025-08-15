import axios from 'axios'
const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
export const ingest = (payload) => axios.post(`${API}/api/ingest`, payload).then(r=>r.data)
export const search = (payload) => axios.post(`${API}/api/search`, payload).then(r=>r.data)
export const egoGraph = (params) => axios.get(`${API}/api/graph/ego`, { params }).then(r=>r.data)
export const getSeminal = (params) => axios.get(`${API}/api/seminal`, { params }).then(r=>r.data)
// lib/api.js
export const getTrends = () => axios.get(`${API}/api/trends`).then(r=>r.data);
