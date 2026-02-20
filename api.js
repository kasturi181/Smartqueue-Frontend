const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
};

export const getStudent = (enrollmentNo) =>
  fetch(`${BASE}/student/${enrollmentNo}`).then(handle);

export const getServices = () =>
  fetch(`${BASE}/services/`).then(handle);

export const joinQueue = (enrollmentNo, service) =>
  fetch(`${BASE}/join-queue/?enrollment_no=${enrollmentNo}&service=${encodeURIComponent(service)}`, {
    method: 'POST'
  }).then(r => r.json());

export const getQueue = () =>
  fetch(`${BASE}/queue/`).then(handle);

export const getTokenStatus = (token) =>
  fetch(`${BASE}/queue/status/${token}`).then(handle);

export const callNext = () =>
  fetch(`${BASE}/call-next/`, { method: 'POST' }).then(handle);

export const skipToken = (id) =>
  fetch(`${BASE}/skip-token/${id}`, { method: 'POST' }).then(handle);

export const clearQueue = () =>
  fetch(`${BASE}/clear-queue/`, { method: 'DELETE' }).then(handle);

export const getStats = () =>
  fetch(`${BASE}/admin/stats/`).then(handle);

export const submitFeedback = (data) =>
  fetch(`${BASE}/feedback/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handle);

export const getAllFeedback = () =>
  fetch(`${BASE}/admin/feedback/`).then(handle);