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
    BASE: '/users',                        // Added for general user routes
    PROFILE: '/users/profile',
    PASSWORD: '/users/profile/password',   // Matched to your updated controller
    DEACTIVATE: '/users/profile/deactivate',
    UPLOAD_PICTURE: '/users/profile-picture',
    SEARCH: '/users/search',
    REQUEST: '/users/request',
    ACCEPT: '/users/accept',
    NOTIFICATIONS: '/users/notifications/read',
  },
  POSTS: {
    BASE: '/posts',                        // Added for general post routes
    FEED: '/posts',
    CREATE: '/posts',
    LIKE: (postId: string) => `/posts/${postId}/like`,
    COMMENT: (postId: string) => `/posts/${postId}/comment`,
  },
  EVENTS: {
    BASE: '/events',
    SEARCH: '/events/search',              // Added for event search logic
    RSVP: (id: string) => `/events/${id}/rsvp`, // Added functional RSVP
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

  // Axios handles multipart/form-data boundaries automatically when sending FormData
  // It's often safer to let Axios set the Content-Type for FormData
  if (!(req.data instanceof FormData)) {
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
      // Optional: window.location.href = '/login';
    }
    
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.response?.status}:`, error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default API;