import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return api.post('/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const signup = (email, name, password) => {
  return api.post('/signup', { email, name, password });
};

export const getMe = () => {
  return api.get('/users/me');
};

export const getLogs = () => {
  return api.get('/get-data');
};

export const addLog = (logData) => {
  return api.post('/add-data', logData);
};

export const getGoal = () => {
  return api.get('/goal');
};

export const updateGoal = (goalData) => {
  return api.post('/goal', goalData);
};

export const getInsights = () => {
  return api.get('/predict');
};

export default api;
