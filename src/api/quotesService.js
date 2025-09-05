import api from './axios';

export const getAllPendingQuotes = (status) => api.get(`/quotes/by-status?status=${status}`);