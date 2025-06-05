import axios, { AxiosError } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
    throw { message: 'An error occurred during login' };
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
    throw { message: 'An error occurred during registration' };
  }
}; 