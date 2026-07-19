import mongoose, { Document, Schema } from 'mongoose';

export interface IScheme extends Document {
  title: string;
  category: string;
  description: string;
  eligibility: string;
  iconName: string;
  link: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schemeSchema = new Schema<IScheme>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String, default: '' },
    iconName: { type: String, default: 'Landmark' },
    link: { type: String, required: true },
    imageUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Scheme = mongoose.model<IScheme>('Scheme', schemeSchema);
