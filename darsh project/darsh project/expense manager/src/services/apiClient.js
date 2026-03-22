const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

const buildHeaders = (extra = {}) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...extra,
  });

  const token = localStorage.getItem('expenseManagerToken');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

const handleResponse = async response => {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message ?? 'Unable to complete the request.';
    throw new Error(message);
  }

  return data;
};

const request = async (endpoint, options = {}) => {
  const config = {
    method: options.method ?? 'GET',
    headers: buildHeaders(options.headers),
    credentials: 'include',
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

export const authApi = {
  login: credentials => request('/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  register: payload => request('/auth/register', {
    method: 'POST',
    body: payload,
  }),
  me: () => request('/auth/me'),
};

export const financeApi = {
  getSummary: () => request('/finance/summary'),
  getTransactions: () => request('/finance/transactions'),
  createTransaction: payload => request('/finance/transactions', {
    method: 'POST',
    body: payload,
  }),
  updateTransaction: (id, payload) => request(`/finance/transactions/${id}`, {
    method: 'PUT',
    body: payload,
  }),
  deleteTransaction: id => request(`/finance/transactions/${id}`, {
    method: 'DELETE',
  }),
  getBudget: () => request('/finance/budget'),
  updateBudget: payload => request('/finance/budget', {
    method: 'PUT',
    body: payload,
  }),
  getReports: params => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request(`/finance/reports${query}`);
  },
};

export const supportApi = {
  sendMessage: payload => request('/support/contact', {
    method: 'POST',
    body: payload,
  }),
};

export const saveSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem('expenseManagerToken', token);
  }
  if (user) {
    localStorage.setItem('expenseManagerUser', JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem('expenseManagerToken');
  localStorage.removeItem('expenseManagerUser');
};

