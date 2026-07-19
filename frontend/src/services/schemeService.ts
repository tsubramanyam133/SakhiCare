import { apiClient } from './apiClient';

export interface SchemeData {
  _id?: string;
  title: string;
  category: string;
  description: string;
  eligibility?: string;
  iconName?: string;
  link: string;
  imageUrl?: string;
}

export const SchemeService = {
  async getAllSchemes() {
    try {
      const response = await apiClient.get('/schemes');
      return response.data.data.schemes;
    } catch (e) {
      console.error("Failed to fetch schemes:", e);
      return [];
    }
  },

  async createScheme(schemeData: SchemeData) {
    const response = await apiClient.post('/schemes', schemeData);
    return response.data.data.scheme;
  },

  async updateScheme(id: string, schemeData: Partial<SchemeData>) {
    const response = await apiClient.put(`/schemes/${id}`, schemeData);
    return response.data.data.scheme;
  }
};
