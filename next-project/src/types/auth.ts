export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  profilePic?: string;
  bio?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    profilePic?: string;
    bio?: string;
  };
} 