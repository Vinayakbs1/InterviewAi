// Configuration file for API URLs and other environment variables

// Get the API base URL from environment variables
// In development, this will use localhost
// In production, it will use the URL from .env.production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Interview endpoints
  INTERVIEW_BASE: `${API_URL}/api/v1/interview`,
  USER_INTERVIEWS: `${API_URL}/api/v1/interview/user-interviews`,
  INTERVIEW: `${API_URL}/api/v1/interview/interview`,
  
  // User endpoints
  USER_BASE: `${API_URL}/api/v1/user`,
  LOGIN: `${API_URL}/api/v1/user/login`,
  REGISTER: `${API_URL}/api/v1/user/register`,
  LOGOUT: `${API_URL}/api/v1/user/logout`,
  VERIFY_TOKEN: `${API_URL}/api/v1/user/verify-token`,
  GET_TOKEN: `${API_URL}/api/v1/user/getToken`,
};