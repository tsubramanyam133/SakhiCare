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
    // Hardcoded doctors list to ensure they load on Vercel without API dependency
    return [
      {
        "_id": "6a5b80e650949e928f1cbaea",
        "name": "Dr. Ananya Sharma",
        "specialty": "Gynecologist & Obstetrician",
        "experience": "15 years exp",
        "rating": 4.9,
        "reviews": 124,
        "location": "Apollo Clinic, Andheri",
        "distance": "2.5 km away",
        "consultationFee": "₹800",
        "languages": ["English", "Hindi", "Marathi"],
        "isOnline": true
      },
      {
        "_id": "6a5b80e650949e928f1cbaec",
        "name": "Dr. Meera Reddy",
        "specialty": "Psychiatrist (Women's Mental Health)",
        "experience": "8 years exp",
        "rating": 4.7,
        "reviews": 56,
        "location": "Mind Wellness Center",
        "distance": "5.0 km away",
        "consultationFee": "₹1000",
        "languages": ["English", "Hindi", "Telugu"],
        "isOnline": true
      },
      {
        "_id": "6a5b80e650949e928f1cbaeb",
        "name": "Dr. Ritu Desai",
        "specialty": "Pediatrician",
        "experience": "10 years exp",
        "rating": 4.8,
        "reviews": 89,
        "location": "Sunshine Children's Hospital",
        "distance": "3.1 km away",
        "consultationFee": "₹600",
        "languages": ["English", "Gujarati"],
        "isOnline": false
      }
    ];
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
