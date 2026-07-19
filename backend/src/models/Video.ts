import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  duration: string;
  tags: string[];
  image: string;
  youtubeId: string;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, default: '0:00' },
    tags: { type: [String], default: [] },
    image: { type: String, required: true },
    youtubeId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Video = mongoose.model<IVideo>('Video', videoSchema);
