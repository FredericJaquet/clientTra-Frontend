import api from './axios';

export const getCashingReport = () => api.get('/reports/pending/income');
export const getPaymentgReport = () => api.get('/reports/pending/outcome');
export const getCashflowInReport = (initDate, endDate) => 
  api.get(`/reports/cash-flow/income?initDate=${initDate}&endDate=${endDate}`);
export const getCashflowOutReport = (initDate, endDate) => 
  api.get(`/reports/cash-flow/outcome?initDate=${initDate}&endDate=${endDate}`);