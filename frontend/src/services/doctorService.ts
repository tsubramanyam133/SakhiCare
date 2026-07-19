import { apiClient } from './apiClient';

export interface DoctorDTO {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  consultationFee: string;
  languages: string[];
  isOnline: boolean;
}

export const DoctorService = {
  getAllDoctors: async () => {
    const response = await apiClient.get('/doctors');
    return response.data;
  },

  createDoctor: async (doctor: DoctorDTO) => {
    const response = await apiClient.post('/doctors', doctor);
    return response.data;
  },

  updateDoctor: async (id: string, doctor: Partial<DoctorDTO>) => {
    const response = await apiClient.put(`/doctors/${id}`, doctor);
    return response.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await apiClient.delete(`/doctors/${id}`);
    return response.data;
  }
};
