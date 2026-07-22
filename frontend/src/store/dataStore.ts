import { create } from 'zustand';
import { SchemeService } from '../services/schemeService';
import { VideoService } from '../services/videoService';
import { DoctorService } from '../services/doctorService';

export interface Doctor {
  id?: string | number;
  _id?: string;
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

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  createdAt: number;
}

export interface Scheme {
  id?: string | number;
  _id?: string;
  title: string;
  category: string;
  description: string;
  eligibility: string;
  iconName: string;
  link: string;
  imageUrl?: string;
}

export interface Video {
  id?: string | number;
  _id?: string;
  title: string;
  description: string;
  duration?: string;
  tags?: string[];
  image: string;
  youtubeId: string;
}

interface DataState {
  doctors: Doctor[];
  notifications: Notification[];
  schemes: Scheme[];
  videos: Video[];
  fetchDoctors: () => Promise<void>;
  addDoctor: (doctor: Omit<Doctor, 'id' | '_id'>) => Promise<void>;
  updateDoctor: (id: string | number, updates: Partial<Doctor>) => Promise<void>;
  addScheme: (scheme: Omit<Scheme, 'id' | '_id'>) => Promise<void>;
  updateScheme: (id: string | number, updates: Partial<Scheme>) => Promise<void>;
  fetchSchemes: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  addVideo: (video: Omit<Video, 'id' | '_id'>) => Promise<void>;
  updateVideo: (id: string | number, updates: Partial<Video>) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  clearNotifications: () => void;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    specialty: "Gynecologist & Obstetrician",
    experience: "15 years exp",
    rating: 4.9,
    reviews: 124,
    location: "Apollo Clinic, Andheri",
    distance: "2.5 km away",
    consultationFee: "₹800",
    languages: ["English", "Hindi", "Marathi"],
    isOnline: true
  },
  {
    id: 2,
    name: "Dr. Ritu Desai",
    specialty: "Pediatrician",
    experience: "10 years exp",
    rating: 4.8,
    reviews: 89,
    location: "Sunshine Children's Hospital",
    distance: "3.1 km away",
    consultationFee: "₹600",
    languages: ["English", "Gujarati"],
    isOnline: false
  },
  {
    id: 3,
    name: "Dr. Meera Reddy",
    specialty: "Psychiatrist (Women's Mental Health)",
    experience: "8 years exp",
    rating: 4.7,
    reviews: 56,
    location: "Mind Wellness Center",
    distance: "5.0 km away",
    consultationFee: "₹1000",
    languages: ["English", "Hindi", "Telugu"],
    isOnline: true
  }
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 1,
    title: "Janani Suraksha Yojana (JSY)",
    category: "Maternal Health",
    description: "A safe motherhood intervention under the National Health Mission (NHM) being implemented with the objective of reducing maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
    eligibility: "BPL pregnant women, age 19 and above.",
    iconName: "Baby",
    link: "https://nhm.gov.in/",
    imageUrl: "https://images.unsplash.com/photo-1555252115-ff99c4c1a5ed?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Beti Bachao Beti Padhao",
    category: "Child Welfare",
    description: "A joint initiative of Ministry of Women and Child Development, Ministry of Health and Family Welfare and Ministry of Human Resource Development to prevent gender biased sex selective elimination and ensure survival, protection, and education of the girl child.",
    eligibility: "All girl children in India.",
    iconName: "GraduationCap",
    link: "https://wcd.nic.in/bbbp-schemes",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Pradhan Mantri Matru Vandana Yojana",
    category: "Financial Aid",
    description: "A maternity benefit program providing conditional cash transfer to pregnant women and lactating mothers for the first living child of the family.",
    eligibility: "Pregnant Women and Lactating Mothers (PW&LM), excluding those in regular employment with the Central Government/State Governments/PSUs.",
    iconName: "Landmark",
    link: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Balika Samridhi Yojana",
    category: "Child Welfare",
    description: "Aimed at below-poverty-line (BPL) families, this scheme provides a one-time grant upon a girl's birth and annual scholarships during her schooling to reduce dropout rates.",
    eligibility: "Girl children born in BPL families on or after August 15, 1997.",
    iconName: "GraduationCap",
    link: "https://wcd.nic.in/schemes",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Sukanya Samriddhi Yojana (SSY)",
    category: "Financial Aid",
    description: "A premier savings scheme under the Beti Bachao Beti Padhao campaign. Parents can open an account in a post office or authorized bank for a girl under 10 years old. It offers higher interest rates, matures in 21 years (or at marriage after 18), and qualifies for Section 80C tax deductions.",
    eligibility: "Parents or legal guardians of a girl child below 10 years of age.",
    iconName: "Landmark",
    link: "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop"
  }
];

export const useDataStore = create<DataState>((set) => ({
  doctors: [],
  schemes: [],
  videos: [],
  notifications: [],
  fetchDoctors: async () => {
    try {
      const doctors = await DoctorService.getAllDoctors();
      if (doctors && doctors.length > 0) {
        const mapped = doctors.map((d: any) => ({ ...d, id: d._id }));
        set({ doctors: mapped });
      } else {
        set({ doctors: MOCK_DOCTORS });
      }
    } catch (error) {
      set({ doctors: MOCK_DOCTORS });
    }
  },
  addDoctor: async (doctor) => {
    try {
      const newDoc = await DoctorService.createDoctor(doctor);
      newDoc.id = newDoc._id;
      set((state) => ({
        doctors: [...state.doctors, newDoc]
      }));
    } catch (error) {
      console.error('Failed to create doctor:', error);
      throw error;
    }
  },
  updateDoctor: async (id, updates) => {
    try {
      const updated = await DoctorService.updateDoctor(id.toString(), updates);
      updated.id = updated._id;
      set((state) => ({
        doctors: state.doctors.map(doc => (doc.id === id || doc._id === id) ? updated : doc)
      }));
    } catch (error) {
      console.error('Failed to update doctor:', error);
      throw error;
    }
  },
  fetchSchemes: async () => {
    try {
      const schemes = await SchemeService.getAllSchemes();
      if (schemes && schemes.length > 0) {
        const mapped = schemes.map((s: any) => ({ ...s, id: s._id }));
        set({ schemes: mapped });
      } else {
        set({ schemes: MOCK_SCHEMES });
      }
    } catch (error) {
      set({ schemes: MOCK_SCHEMES });
    }
  },
  addScheme: async (scheme) => {
    try {
      const newScheme = await SchemeService.createScheme(scheme);
      newScheme.id = newScheme._id;
      set((state) => ({
        schemes: [...state.schemes, newScheme]
      }));
    } catch (error) {
      console.error('Failed to create scheme:', error);
      throw error;
    }
  },
  updateScheme: async (id, updates) => {
    try {
      const updated = await SchemeService.updateScheme(id.toString(), updates);
      updated.id = updated._id;
      set((state) => ({
        schemes: state.schemes.map(sch => (sch.id === id || sch._id === id) ? updated : sch)
      }));
    } catch (error) {
      console.error('Failed to update scheme:', error);
      throw error;
    }
  },
  fetchVideos: async () => {
    try {
      const videos = await VideoService.getAllVideos();
      if (Array.isArray(videos)) {
        const mapped = videos.map((v: any) => ({ ...v, id: v._id }));
        set({ videos: mapped });
      }
    } catch (error) {
      // Graceful fallback
    }
  },
  addVideo: async (video) => {
    try {
      const newVideo = await VideoService.createVideo(video);
      newVideo.id = newVideo._id;
      set((state) => ({
        videos: [...state.videos, newVideo]
      }));
    } catch (error) {
      console.error('Failed to create video:', error);
      throw error;
    }
  },
  updateVideo: async (id, updates) => {
    try {
      const updated = await VideoService.updateVideo(id.toString(), updates);
      updated.id = updated._id;
      set((state) => ({
        videos: state.videos.map(vid => (vid.id === id || vid._id === id) ? updated : vid)
      }));
    } catch (error) {
      console.error('Failed to update video:', error);
      throw error;
    }
  },
  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: Date.now().toString(), createdAt: Date.now() }, ...state.notifications]
  })),
  clearNotifications: () => set({ notifications: [] }),
}));
