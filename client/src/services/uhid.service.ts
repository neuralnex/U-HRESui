import { api } from './api';

export interface CreateUHIDData {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber?: string;
  email?: string;
  address?: string;
  state?: string;
  lga?: string;
  profilePicture?: string;
  // Identity Verification
  ninNumber?: string;
  // Medical Background
  bloodGroup?: string;
  genotype?: string;
  allergies?: string;
  underlyingConditions?: string;
  emergencyMedicalNotes?: string;
  // Emergency Contacts
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  // Optional fields (for profile section)
  smokingStatus?: string;
  alcoholUse?: string;
  exerciseLevel?: string;
  dietaryPreferences?: string;
  healthInsuranceProvider?: string;
  insurancePolicyNumber?: string;
  employmentStatus?: string;
  educationLevel?: string;
  maritalStatus?: string;
  householdSize?: number;
}

export interface UHID {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  state?: string;
  lga?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const uhidService = {
  async createUHID(data: CreateUHIDData) {
    const response = await api.post('/uhid', data);
    return response.data;
  },

  async getUHID(uhid: string) {
    const response = await api.get(`/uhid/${uhid}`);
    return response.data;
  },

  async updateUHID(uhid: string, data: Partial<CreateUHIDData>) {
    const response = await api.put(`/uhid/${uhid}`, data);
    return response.data;
  },

  async deactivateUHID(uhid: string) {
    const response = await api.delete(`/uhid/${uhid}`);
    return response.data;
  },
};

