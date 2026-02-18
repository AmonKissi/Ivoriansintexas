// src/lib/api-configs.ts

import axios from 'axios';

// 1. Define the Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 2. Map all endpoints to maintain consistency across the app
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    PASSWORD: '/users/profile/password',      // UPDATED
    DEACTIVATE: '/users/profile/deactivate',  // UPDATED
    SEARCH: '/users/search',
    REQUEST: '/users/request',                // Usage: `${ENDPOINTS.USERS.REQUEST}/${targetId}`
    ACCEPT: '/users/accept',                  // Usage: `${ENDPOINTS.USERS.ACCEPT}/${requesterId}`
    NOTIFICATIONS: '/users/notifications/read',
    UPLOAD_PICTURE: '/users/profile-picture',
  },
  POSTS: {
    FEED: '/posts',
    CREATE: '/posts',
    LIKE: (postId: string) => `/posts/${postId}/like`,
  },
  EVENTS: {
    BASE: '/events',
  }
};

// 3. Create the Axios Instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 4. Middleware: Attach JWT Token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// 5. Global Error Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized (token expired or invalid)
      localStorage.removeItem('token');
      // Redirecting here is optional; usually handled by your AuthContext
    }
    return Promise.reject(error);
  }
);

export default API;