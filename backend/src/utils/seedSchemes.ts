import { Scheme } from '../models/Scheme';
import mongoose from 'mongoose';
import { logger } from './logger';

const INITIAL_SCHEMES = [
  {
    title: "Beti Bachao Beti Padhao",
    category: "Child Welfare",
    description: "A joint initiative of Ministry of Women and Child Development, Ministry of Health and Family Welfare and Ministry of Human Resource Development to prevent gender biased sex selective elimination and ensure survival, protection, and education of the girl child.",
    eligibility: "All girl children in India.",
    iconName: "GraduationCap",
    link: "https://en.wikipedia.org/wiki/Beti_Bachao_Beti_Padhao",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Pradhan Mantri Matru Vandana Yojana",
    category: "Financial Aid",
    description: "A maternity benefit program providing conditional cash transfer to pregnant women and lactating mothers for the first living child of the family.",
    eligibility: "Pregnant Women and Lactating Mothers (PW&LM), excluding those in regular employment with the Central Government/State Governments/PSUs.",
    iconName: "Landmark",
    link: "https://en.wikipedia.org/wiki/Pradhan_Mantri_Matri_Vandana_Yojana",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Janani Suraksha Yojana (JSY)",
    category: "Maternal Health",
    description: "A safe motherhood intervention under the National Health Mission (NHM) being implemented with the objective of reducing maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
    eligibility: "BPL pregnant women, age 19 and above.",
    iconName: "Baby",
    link: "https://www.studyiq.com/articles/janani-suraksha-yojana/?srsltid=AfmBOoqHpRzXVQDgrRBzXms8EzyBtmtD1681QQEo5--z_8F76RMnKA5S",
    imageUrl: "https://images.unsplash.com/photo-1555252115-ff99c4c1a5ed?q=80&w=600&auto=format&fit=crop"
  }
];

export const seedSchemes = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      logger.info('Skipping MongoDB seed as database is not connected.');
      return;
    }
    const count = await Scheme.countDocuments();
    if (count === 0) {
      logger.info('No schemes found in DB. Seeding initial government schemes...');
      await Scheme.insertMany(INITIAL_SCHEMES);
      logger.info('Successfully seeded government schemes.');
    }
  } catch (error) {
    logger.error(`Error seeding schemes: ${error}`);
  }
};
