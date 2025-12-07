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

  async createPrescription(uhid: string, data: CreatePrescriptionData) {
    const response = await api.post(`/patients/${uhid}/prescriptions`, data);
    return response.data;
  },

  async getPatientPrescriptions(uhid: string, limit: number = 50) {
    const response = await api.get(`/patients/${uhid}/prescriptions?limit=${limit}`);
    return response.data;
  },

  async createLabResult(uhid: string, data: CreateLabResultData) {
    const response = await api.post(`/patients/${uhid}/lab-results`, data);
    return response.data;
  },

  async getPatientLabResults(uhid: string, limit: number = 50) {
    const response = await api.get(`/patients/${uhid}/lab-results?limit=${limit}`);
    return response.data;
  },

  async getTodayPatients() {
    const response = await api.get('/patients/today');
    return response.data;
  },

  async dispensePrescription(prescriptionId: string, pharmacyId?: string) {
    const response = await api.post(`/patients/prescriptions/${prescriptionId}/dispense`, { pharmacyId });
    return response.data;
  },

  async getPendingPrescriptions() {
    const response = await api.get('/patients/prescriptions/pending');
    return response.data;
  },

  async getPendingLabResults() {
    const response = await api.get('/patients/lab-results/pending');
    return response.data;
  },
};

export interface CreatePrescriptionData {
  prescriptionDate: string;
  medicationName: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity?: number;
  route?: string;
  instructions?: string;
  prescribedBy?: string;
}

export interface CreateLabResultData {
  testDate: string;
  testName: string;
  testType: string;
  result?: string;
  unit?: string;
  referenceRange?: string;
  status?: string;
  labTechnicianId?: string;
  reviewedBy?: string;
  notes?: string;
}

