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
    // Hardcoded schemes to ensure they are always visible on Vercel without relying on the backend
    return [
      {
        _id: "6a5b8027fd3acfc1f936270b",
        title: "Janani Suraksha Yojana (JSY)",
        category: "Maternal Health",
        description: "A safe motherhood intervention under the National Health Mission (NHM) being implemented with the objective of reducing maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
        eligibility: "BPL pregnant women, age 19 and above.",
        iconName: "Baby",
        link: "https://www.studyiq.com/articles/janani-suraksha-yojana/?srsltid=AfmBOoqHpRzXVQDgrRBzXms8EzyBtmtD1681QQEo5--z_8F76RMnKA5S",
        imageUrl: "https://res.cloudinary.com/djkz6gshk/image/upload/v1784467224/images_kckj5x.jpg"
      },
      {
        _id: "6a5b8027fd3acfc1f936270a",
        title: "Pradhan Mantri Matru Vandana Yojana",
        category: "Financial Aid",
        description: "A maternity benefit program providing conditional cash transfer to pregnant women and lactating mothers for the first living child of the family.",
        eligibility: "Pregnant women and lactating mothers.",
        iconName: "Landmark",
        link: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
        imageUrl: "https://res.cloudinary.com/djkz6gshk/image/upload/v1784465451/istockphoto-1152865917-612x612_c6idw1.jpg"
      },
      {
        _id: "6a5b8027fd3acfc1f936270c",
        title: "Beti Bachao Beti Padhao",
        category: "Child Welfare",
        description: "A campaign of the Government of India that aims to generate awareness and improve the efficiency of welfare services intended for girls in India.",
        eligibility: "Families with a girl child.",
        iconName: "GraduationCap",
        link: "https://wcd.nic.in/bbbp-schemes",
        imageUrl: "https://res.cloudinary.com/djkz6gshk/image/upload/v1784467364/1676634790-BBBP_g5yffo.jpg"
      }
    ];
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
