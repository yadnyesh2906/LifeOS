import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import storage from '../utils/storage';
import STORAGE_KEYS from '../constants/storage';

// Get local development IP address dynamically for physical device testing
const getBaseUrl = () => {
  // If running in expo development, try to get host IP address
  const hostUri = Constants.expoConfig?.hostUri;
  if (__DEV__ && hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:8080/api`;
  }
  // Default fallbacks: Android emulator uses 10.0.2.2, iOS uses localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to automatically add JWT Token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to format responses and handle errors
api.interceptors.response.use(
  (response) => {
    // If the backend wraps the data in ApiResponse<T>, we can return it directly or return the wrapper
    return response;
  },
  (error) => {
    // Handle standard token expiration / unauthorized errors globally
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - session may have expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
