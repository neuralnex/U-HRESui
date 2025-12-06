import { api } from './api';

export interface AnalyzeTextData {
  text: string;
}

export interface AnalyzeImageData {
  image: File;
}

export interface AnalyzeMultimodalData {
  image: File;
  text: string;
}

export const aiService = {
  async analyzeText(data: AnalyzeTextData) {
    const response = await api.post('/ai/analyze-text', data);
    return response.data;
  },

  async analyzeImage(data: AnalyzeImageData) {
    const formData = new FormData();
    formData.append('image', data.image);
    const response = await api.post('/ai/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async analyzeMultimodal(data: AnalyzeMultimodalData) {
    const formData = new FormData();
    formData.append('image', data.image);
    if (data.text) {
      formData.append('text', data.text);
    }
    const response = await api.post('/ai/analyze-multimodal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async analyzeLabResult(uhid: string, labResultId: string) {
    const response = await api.post(`/ai/patients/${uhid}/analyze-lab-result`, { labResultId });
    return response.data;
  },

  async analyzeVisit(uhid: string, visitId: string) {
    const response = await api.post(`/ai/patients/${uhid}/analyze-visit`, { visitId });
    return response.data;
  },
};

