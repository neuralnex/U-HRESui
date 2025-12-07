import { api } from './api';

export interface PatientLoginData {
  uhid: string;
}

export interface PatientRegisterData {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  lga?: string;
  ninNumber?: string;
  bloodGroup?: string;
  genotype?: string;
  allergies?: string;
  underlyingConditions?: string;
  emergencyMedicalNotes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export const patientAuthService = {
  async login(data: PatientLoginData) {
    const response = await api.post('/auth/patient/login', data);
    return response.data;
  },

  async register(data: PatientRegisterData) {
    const response = await api.post('/auth/patient/register', data);
    return response.data;
  },

  async getRecords() {
    const response = await api.get('/patients/records');
    return response.data;
  },

  async downloadRecords(format: 'json' | 'pdf' = 'json') {
    const response = await api.get(`/patients/download?format=${format}`);
    
    if (response.data && response.data.success) {
      const data = response.data.data || response.data;
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient-records-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/patients/profile');
    return response.data;
  },
};

