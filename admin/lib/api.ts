import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const adminLogin = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password }).then(r => r.data);
export const getMe = () => api.get('/api/auth/me').then(r => r.data);

// Products
export const getProducts = (params?: object) => api.get('/api/products', { params }).then(r => r.data);
export const createProduct = (data: object) => api.post('/api/products', data).then(r => r.data);
export const updateProduct = (id: string, data: object) => api.put(`/api/products/${id}`, data).then(r => r.data);
export const deleteProduct = (id: string) => api.delete(`/api/products/${id}`).then(r => r.data);
export const uploadProductImage = (productId: string, file: File, isPrimary = false) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post(`/api/upload/product/${productId}?is_primary=${isPrimary}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const deleteProductImage = (imageId: string) =>
  api.delete(`/api/upload/product-image/${imageId}`).then(r => r.data);

// Upload helpers
export const uploadCategoryImage = (categoryId: string, file: File) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post(`/api/upload/category/${categoryId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const uploadBanner = (file: File) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post('/api/upload/banner', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
export const uploadVideo = (file: File) => {
  const fd = new FormData(); fd.append('file', file);
  return api.post('/api/upload/video', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

// Categories
export const getCategories = () => api.get('/api/categories').then(r => r.data);
export const createCategory = (data: object) => api.post('/api/categories', data).then(r => r.data);
export const updateCategory = (id: string, data: object) => api.put(`/api/categories/${id}`, data).then(r => r.data);

// Orders
export const getOrders = (params?: object) => api.get('/api/orders', { params }).then(r => r.data);
export const updateOrderStatus = (id: string, data: object) => api.put(`/api/orders/${id}/status`, data).then(r => r.data);

// Discounts
export const getDiscounts = () => api.get('/api/discounts').then(r => r.data);
export const createDiscount = (data: object) => api.post('/api/discounts', data).then(r => r.data);
export const updateDiscount = (id: string, data: object) => api.put(`/api/discounts/${id}`, data).then(r => r.data);
export const deleteDiscount = (id: string) => api.delete(`/api/discounts/${id}`).then(r => r.data);

// Users
export const getUsers = (params?: object) => api.get('/api/users', { params }).then(r => r.data);
export const toggleUserActive = (id: string) => api.put(`/api/users/${id}/toggle-active`).then(r => r.data);

// Contact Queries
export const getContactQueries = () => api.get('/api/contact/queries').then(r => r.data);
export const markQueryViewed = (id: string) => api.put(`/api/contact/queries/${id}/viewed`).then(r => r.data);

// Newsletter
export const getNewsletterSignups = () => api.get('/api/contact/newsletter/list').then(r => r.data);
export const markNewsletterViewed = (id: string) => api.put(`/api/contact/newsletter/${id}/viewed`).then(r => r.data);

// Instagram Reels
export const getAdminReels = () => api.get('/api/reels/all').then(r => r.data);
export const addReel = (data: object) => api.post('/api/reels', data).then(r => r.data);
export const updateReel = (id: string, data: object) => api.put(`/api/reels/${id}`, data).then(r => r.data);
export const deleteReel = (id: string) => api.delete(`/api/reels/${id}`).then(r => r.data);

export default api;
