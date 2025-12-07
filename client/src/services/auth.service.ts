import { api } from './api';

export interface HospitalRegisterData {
  name: string;
  description?: string;
  type: 'Public' | 'Private' | 'Clinic' | 'Laboratory' | 'Pharmacy';
  address: string;
  state: string;
  lga: string;
  phoneNumber: string;
  email?: string;
  apiEndpoint?: string;
}

export interface HospitalLoginData {
  hospitalCode: string;
  apiKey?: string;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    hospital?: any;
    admin?: any;
    uhid?: any;
  };
  message?: string;
}

export const authService = {
  async registerHospital(data: HospitalRegisterData) {
    console.log('Registering hospital with data:', data);
    console.log('API base URL:', api.defaults.baseURL);
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  async loginHospital(data: HospitalLoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async loginAdmin(data: AdminLoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/admin/login', data);
    return response.data;
  },

  async refreshToken(token: string) {
    const response = await api.post('/auth/refresh', { token });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async forgotCode(email: string) {
    const response = await api.post('/auth/forgot-code', { email });
    return response.data;
  },

  async loginPatient(data: { uhid: string }): Promise<AuthResponse> {
    const response = await api.post('/auth/patient/login', data);
    return response.data;
  },

  async registerPatient(data: any): Promise<AuthResponse> {
    const response = await api.post('/auth/patient/register', data);
    return response.data;
  },
};

