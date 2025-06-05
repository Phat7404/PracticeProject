export interface Track {
  _id: string;
  title: string;
  description?: string;
  audioFile?: string;
  coverArt?: string;
  duration: number;
  genre?: string;
  tags: string[];
  plays: number;
  likes: number;
  reposts: number;
  comments: number;
  private: boolean;
  userId: {
    _id: string;
    username: string;
    profilePic: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackData {
  title: string;
  description?: string;
  audioFile: File;
  coverArt?: File;
  genre?: string;
  tags?: string[];
  private?: boolean;
}

export interface TrackResponse {
  message: string;
  track: Track;
}

export interface PaginatedTracksResponse {
  message: string;
  tracks: Track[];
  totalItems: number;
  totalPages: number;
  current: number;
  pageSize: number;
} 