import { api } from './api';

export const auditService = {
  async getAuditLogsByUHID(uhid: string, limit = 100) {
    const response = await api.get(`/audit/uhid/${uhid}`, { params: { limit } });
    return response.data;
  },

  async getAuditLogsByHospital(hospitalId: string, limit = 100) {
    const response = await api.get(`/audit/hospital/${hospitalId}`, { params: { limit } });
    return response.data;
  },

  async getAuditLogsByAction(action: string, limit = 100) {
    const response = await api.get(`/audit/action/${action}`, { params: { limit } });
    return response.data;
  },
};

