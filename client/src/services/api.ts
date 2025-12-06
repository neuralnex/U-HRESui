import axios, { type AxiosInstance, type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const baseURL = API_BASE_URL?.trim() || '';
    
    console.log('API Base URL:', baseURL);
    console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
    
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.instance;

