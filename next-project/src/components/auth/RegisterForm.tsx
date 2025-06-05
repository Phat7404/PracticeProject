'use client';

import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterData } from '@/utils/types/auth';

export const RegisterForm = () => {
  const { loading, handleRegister } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: RegisterData) => {
    handleRegister(values);
  };

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
      </div>
      <Form
        form={form}
        name="register"
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
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="bio"
        >
          <Input.TextArea
            placeholder="Bio (optional)"
            size="large"
            rows={3}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Sign up
          </Button>
        </Form.Item>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </div>
      </Form>
    </Card>
  );
}; 