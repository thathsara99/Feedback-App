// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  Layout,
  Row,
  Col,
  message
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;

const ResetPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        newPassword: values.newPassword
      };

      await axios.post('http://localhost:5000/api/reset-password', payload);

      message.success('Your password has been successfully reset!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row justify="center" align="middle" style={{ height: '100%' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                <Title level={3} style={{ marginBottom: 0 }}>Reset Password</Title>
                <Text type="secondary">Enter your email and new password.</Text>
              </Space>

              <Divider />

              <Form
                form={form}
                name="resetPassword"
                onFinish={onFinish}
                layout="vertical"
                style={{ marginTop: 24 }}
              >
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="you@example.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: 'Please enter your new password!' },
                    { min: 6, message: 'Password must be at least 6 characters long!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="New Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      }
                    })
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Reset Password
                  </Button>
                </Form.Item>
              </Form>

              <Divider />

              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/login')}
                style={{ padding: 0 }}
              >
                Back to Login
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ResetPasswordPage;
