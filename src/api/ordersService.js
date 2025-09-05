import api from './axios';

export const getAllPendingOrders = () => api.get('/orders/pending');