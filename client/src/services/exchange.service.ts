import { api } from './api';

export const exchangeService = {
  async getAggregatedRecords(uhid: string) {
    const response = await api.get(`/exchange/patients/${uhid}`);
    return response.data;
  },

  async getRecordsFromHospital(uhid: string, hospitalId: string) {
    const response = await api.get(`/exchange/patients/${uhid}/from/${hospitalId}`);
    return response.data;
  },
};

