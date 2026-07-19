import { Request, Response } from 'express';
import { Video } from '../../models/Video';

export const createVideo = async (req: Request, res: Response) => {
  try {
    const video = new Video(req.body);
    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(id, req.body, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
