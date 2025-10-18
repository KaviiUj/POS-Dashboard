import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.get('/auth/logout'),
  getProfile: (userId) => api.get(`/auth/profile/${userId}`),
};

export const categoryAPI = {
  getAll: () => api.get('/category/all'),
  getActive: () => api.get('/category/active'),
  add: (categoryData) => api.post('/category/add', categoryData),
  update: (categoryData) => api.post('/category/update', categoryData),
  updateStatus: (statusData) => api.post('/category/status', statusData),
};

export const itemAPI = {
  getAll: () => api.get('/item/all'),
  getActive: () => api.get('/item/active'),
  getByCategory: (categoryId) => api.get(`/item/category?categoryId=${categoryId}`),
  add: (itemData) => api.post('/item/add', itemData),
  update: (itemData) => api.post('/item/update', itemData),
  updateStatus: (statusData) => api.post('/item/status', statusData),
  delete: (itemData) => api.post('/item/delete', itemData),
};

export const staffAPI = {
  getAll: () => api.get('/staff/all'),
  getActive: () => api.get('/staff/active'),
  create: (staffData) => api.post('/staff/create', staffData),
  update: (staffData) => api.post('/staff/update', staffData),
  updateStatus: (statusData) => api.post('/staff/status', statusData),
  delete: (staffData) => api.post('/staff/delete', staffData),
};

export const tableAPI = {
  getAll: () => api.get('/table/all'),
  create: (tableData) => api.post('/table/create', tableData),
  delete: (tableData) => api.post('/table/delete', tableData),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;
