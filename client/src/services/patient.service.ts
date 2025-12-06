import { api } from './api';

export interface CreateVisitData {
  visitDate: string;
  doctorId?: string;
  doctorName: string;
  doctorContact?: string;
  doctorEmail?: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  notes?: string;
  isEmergency: boolean;
}

export interface PatientRecord {
  id: string;
  uhid: string;
  hospitalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSummary {
  patient: PatientRecord;
  visits: any[];
  medicalHistory: any[];
  labResults: any[];
  prescriptions: any[];
}

export const patientService = {
  async getPatientRecord(uhid: string) {
    const response = await api.get(`/patients/${uhid}`);
    return response.data;
  },

  async getPatientSummary(uhid: string): Promise<{ success: boolean; data: PatientSummary }> {
    const response = await api.get(`/patients/${uhid}/summary`);
    return response.data;
  },

  async createVisit(uhid: string, data: CreateVisitData) {
    const response = await api.post(`/patients/${uhid}/visits`, data);
    return response.data;
  },

  async getPatientVisits(uhid: string, limit: number = 50) {
    const response = await api.get(`/patients/${uhid}/visits?limit=${limit}`);
    return response.data;
  },
};

