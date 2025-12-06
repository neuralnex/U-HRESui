import { api } from './api';

export interface AdminDashboardStats {
  totalHospitals: number;
  activeHospitals: number;
  verifiedHospitals: number;
  unverifiedHospitals: number;
  hospitalsByType: Record<string, number>;
}

export interface CreateAdminData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  permissions?: string[];
  isSuperAdmin?: boolean;
}

export interface BulkVerifyData {
  hospitalIds: string[];
}

export interface GenerateAPIKeyData {
  permissions?: string[];
}

export const adminService = {
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getPendingHospitals() {
    const response = await api.get('/admin/hospitals/pending');
    return response.data;
  },

  async createAdmin(data: CreateAdminData) {
    const response = await api.post('/admin/create', data);
    return response.data;
  },

  async getAllAdmins() {
    const response = await api.get('/admin/admins');
    return response.data;
  },

  async verifyHospital(id: string) {
    const response = await api.post(`/admin/hospitals/${id}/verify`);
    return response.data;
  },

  async bulkVerifyHospitals(data: BulkVerifyData) {
    const response = await api.post('/admin/hospitals/bulk-verify', data);
    return response.data;
  },

  async generateAPIKey(id: string, data?: GenerateAPIKeyData) {
    const response = await api.post(`/admin/hospitals/${id}/api-key`, data || {});
    return response.data;
  },
};

