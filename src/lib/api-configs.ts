// src/lib/api-configs.ts

import axios from 'axios';

// 1. Define the Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// 2. Map all endpoints to maintain consistency across the app
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  USERS: {
    BASE: '/users',
    // UPDATED: Function to handle both /profile (self) and /profile/:id (others)
    PROFILE: (userId?: string) => userId ? `/users/profile/${userId}` : '/users/profile',
    PASSWORD: '/users/profile/password',
    DEACTIVATE: '/users/profile/deactivate',
    UPLOAD_PICTURE: '/users/profile-picture',
    SEARCH: '/users/search',
    REQUEST: (id: string) => `/users/request/${id}`, // Now takes ID
    ACCEPT: (id: string) => `/users/accept/${id}`,   // Now takes ID
    UNFRIEND: (id: string) => `/users/connection/${id}`, // New!
    NOTIFICATIONS: '/users/notifications/read',
  },
  POSTS: {
    BASE: '/posts',
    FEED: '/posts',
    CREATE: '/posts',
    // Logic for likes and comments
    LIKE: (postId: string) => `/posts/${postId}/like`,
    COMMENT: (postId: string) => `/posts/${postId}/comments`,
    DELETE: (postId: string) => `/posts/${postId}`,
  },
  EVENTS: {
    BASE: '/events',
    GET_ALL: "/events",
    SEARCH: '/events/search',              
    RSVP: (id: string) => `/events/${id}/rsvp`, 
    DELETE: (id: string) => `/events/${id}`,
  }
};

// 3. Create the Axios Instance
const API = axios.create({
  baseURL: API_BASE_URL,
});

// 4. Middleware: Attach JWT Token and Handle Content-Type
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  // Auto-detect FormData to let browser set boundary
  if (req.data instanceof FormData) {
    delete req.headers['Content-Type'];
  } else {
    req.headers['Content-Type'] = 'application/json';
  }

  return req;
});

// 5. Global Error Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Prevent infinite loops by checking current path
      if (!window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;