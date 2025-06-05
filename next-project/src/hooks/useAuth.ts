import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { login, register } from '@/lib/api/auth';
import type { LoginCredentials, RegisterData } from '@/types/auth';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await login(credentials);
      localStorage.setItem('token', response.access_token);
      message.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      setLoading(true);
      await register(data);
      message.success('Registration successful! Please login.');
      router.push('/auth/login');
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return {
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}; 