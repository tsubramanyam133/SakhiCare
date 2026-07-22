import { apiClient } from './apiClient';

export interface VideoDTO {
  title: string;
  description: string;
  duration?: string;
  tags?: string[];
  image: string;
  youtubeId: string;
}

export const VideoService = {
  getAllVideos: async () => {
    try {
      const response = await apiClient.get('/videos');
      return response.data?.data?.videos || response.data || [];
    } catch (e) {
      return [];
    }
  },

  createVideo: async (video: VideoDTO) => {
    const response = await apiClient.post('/videos', video);
    return response.data;
  },

  updateVideo: async (id: string, video: Partial<VideoDTO>) => {
    const response = await apiClient.put(`/videos/${id}`, video);
    return response.data;
  },

  deleteVideo: async (id: string) => {
    const response = await apiClient.delete(`/videos/${id}`);
    return response.data;
  }
};
