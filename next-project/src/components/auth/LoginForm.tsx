'use client';

import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types/auth';

export const LoginForm = () => {
  const { loading, handleLogin } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: LoginCredentials) => {
    handleLogin(values);
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
      </div>
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Sign in
          </Button>
        </Form.Item>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </div>
      </Form>
    </Card>
  );
}; 