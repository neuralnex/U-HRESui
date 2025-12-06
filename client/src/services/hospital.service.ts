import { api } from './api';

export interface Hospital {
  id: string;
  hospitalCode: string;
  name: string;
  type: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  lga?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface CreateHospitalData {
  name: string;
  type: 'Public' | 'Private' | 'Clinic' | 'Laboratory' | 'Pharmacy';
  address: string;
  state: string;
  lga: string;
  email?: string;
  phoneNumber?: string;
}

export const hospitalService = {
  async getAllHospitals(params?: { type?: string; state?: string; isActive?: boolean }) {
    const response = await api.get('/hospitals', { params });
    return response.data;
  },

  async getHospitalById(id: string) {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  async createHospital(data: CreateHospitalData) {
    const response = await api.post('/hospitals', data);
    return response.data;
  },
};

