import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Scheme } from '../../models/Scheme';
import { AppError } from '../../utils/AppError';

const MOCK_SCHEMES = [
  {
    _id: "1",
    title: "Beti Bachao Beti Padhao",
    category: "Child Welfare",
    description: "A joint initiative of Ministry of Women and Child Development, Ministry of Health and Family Welfare and Ministry of Human Resource Development to prevent gender biased sex selective elimination and ensure survival, protection, and education of the girl child.",
    eligibility: "All girl children in India.",
    iconName: "GraduationCap",
    link: "https://en.wikipedia.org/wiki/Beti_Bachao_Beti_Padhao",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop"
  },
  {
    _id: "2",
    title: "Pradhan Mantri Matru Vandana Yojana",
    category: "Financial Aid",
    description: "A maternity benefit program providing conditional cash transfer to pregnant women and lactating mothers for the first living child of the family.",
    eligibility: "Pregnant Women and Lactating Mothers (PW&LM), excluding those in regular employment with the Central Government/State Governments/PSUs.",
    iconName: "Landmark",
    link: "https://en.wikipedia.org/wiki/Pradhan_Mantri_Matri_Vandana_Yojana",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop"
  },
  {
    _id: "3",
    title: "Janani Suraksha Yojana (JSY)",
    category: "Maternal Health",
    description: "A safe motherhood intervention under the National Health Mission (NHM) being implemented with the objective of reducing maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
    eligibility: "BPL pregnant women, age 19 and above.",
    iconName: "Baby",
    link: "https://www.studyiq.com/articles/janani-suraksha-yojana/?srsltid=AfmBOoqHpRzXVQDgrRBzXms8EzyBtmtD1681QQEo5--z_8F76RMnKA5S",
    imageUrl: "https://images.unsplash.com/photo-1555252115-ff99c4c1a5ed?q=80&w=600&auto=format&fit=crop"
  }
];

let inMemorySchemes = [...MOCK_SCHEMES];

export class SchemeController {
  static async getAllSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(200).json({
          status: 'success',
          results: inMemorySchemes.length,
          data: { schemes: inMemorySchemes },
        });
      }

      const schemes = await Scheme.find().sort({ createdAt: -1 });
      res.status(200).json({
        status: 'success',
        results: schemes.length,
        data: { schemes },
      });
    } catch (error) {
      next(error);
    }
  }

  static async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      if (mongoose.connection.readyState !== 1) {
        const newScheme = { ...req.body, _id: Date.now().toString() };
        inMemorySchemes.unshift(newScheme);
        return res.status(201).json({
          status: 'success',
          data: { scheme: newScheme },
        });
      }

      const newScheme = await Scheme.create(req.body);
      res.status(201).json({
        status: 'success',
        data: { scheme: newScheme },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateScheme(req: Request, res: Response, next: NextFunction) {
    try {
      if (mongoose.connection.readyState !== 1) {
        const index = inMemorySchemes.findIndex(s => s._id === req.params.id);
        if (index === -1) throw new AppError('No scheme found with that ID', 404);
        
        inMemorySchemes[index] = { ...inMemorySchemes[index], ...req.body };
        return res.status(200).json({
          status: 'success',
          data: { scheme: inMemorySchemes[index] },
        });
      }

      const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!scheme) {
        throw new AppError('No scheme found with that ID', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { scheme },
      });
    } catch (error) {
      next(error);
    }
  }
}
