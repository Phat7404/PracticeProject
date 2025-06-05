import axios, { AxiosError } from 'axios';
import { Track, CreateTrackData, TrackResponse, PaginatedTracksResponse } from '@/types/track';

const API_URL = 'http://localhost:8080/api/v1';

export const uploadTrack = async (data: CreateTrackData): Promise<TrackResponse> => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('audioFile', data.audioFile);
    if (data.coverArt) formData.append('coverArt', data.coverArt);
    if (data.genre) formData.append('genre', data.genre);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.private !== undefined) formData.append('private', String(data.private));

    const response = await axios.post<TrackResponse>(`${API_URL}/tracks`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || { message: 'An error occurred during track upload' };
    }
    throw { message: 'An error occurred during track upload' };
  }
};

export const getTracks = async (): Promise<Track[]> => {
  try {
    console.log('Fetching tracks from:', `${API_URL}/tracks`);
    const response = await axios.get<PaginatedTracksResponse>(`${API_URL}/tracks`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.tracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    if (error instanceof AxiosError) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      throw error.response?.data || { message: 'An error occurred while fetching tracks' };
    }
    throw { message: 'An error occurred while fetching tracks' };
  }
}; 