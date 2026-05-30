import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000'

export async function getStoreMetrics(storeId = 1) {
  const res = await axios.get(`${API_BASE}/stores/${storeId}/metrics`)
  return res.data
}

export async function getStoreFunnel(storeId = 1) {
  const res = await axios.get(`${API_BASE}/stores/${storeId}/funnel`)
  return res.data
}

export async function getStoreAnomalies(storeId = 1) {
  const res = await axios.get(`${API_BASE}/stores/${storeId}/anomalies`)
  return res.data
}
