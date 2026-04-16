import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data: { email: string; full_name: string; phone?: string; password: string }) =>
  api.post('/api/auth/register', data).then(r => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post('/api/auth/login', data).then(r => r.data);

export const getMe = () => api.get('/api/auth/me').then(r => r.data);

export const updateProfile = (data: object) => api.put('/api/users/me', data).then(r => r.data);

// Products
export const getProducts = (params?: object) => api.get('/api/products', { params }).then(r => r.data);
export const getProduct = (slug: string) => api.get(`/api/products/${slug}`).then(r => r.data);

// Categories
export const getCategories = () => api.get('/api/categories').then(r => r.data);

// Cart
export const getCart = () => api.get('/api/cart').then(r => r.data);
export const addToCart = (product_id: string, quantity = 1) =>
  api.post('/api/cart/items', { product_id, quantity }).then(r => r.data);
export const updateCartItem = (item_id: string, quantity: number) =>
  api.put(`/api/cart/items/${item_id}`, { quantity }).then(r => r.data);
export const removeCartItem = (item_id: string) =>
  api.delete(`/api/cart/items/${item_id}`).then(r => r.data);
export const clearCart = () => api.delete('/api/cart').then(r => r.data);

// Orders
export const createOrder = (data: object) => api.post('/api/orders', data).then(r => r.data);
export const getMyOrders = () => api.get('/api/orders/my').then(r => r.data);
export const getLastOrderAddress = () => api.get('/api/orders/my/last-address').then(r => r.data);
export const getOrder = (id: string) => api.get(`/api/orders/${id}`).then(r => r.data);
export const getOrderByNumber = (orderNumber: string) => api.get(`/api/orders/number/${orderNumber}`).then(r => r.data);

// Discounts
export const applyDiscount = (code: string, order_amount: number) =>
  api.post('/api/discounts/apply', { code, order_amount }).then(r => r.data);

// Settings
export const getPublicSettings = () =>
  api.get('/api/settings/public').then(r => r.data);

export const getSettings = () =>
  api.get('/api/settings').then(r => r.data);

export const updateSettings = (data: object) =>
  api.put('/api/settings', data).then(r => r.data);

export default api;
