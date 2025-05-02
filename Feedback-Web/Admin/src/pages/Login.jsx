import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Divider, 
  Space,
  Checkbox,
  Layout,
  Row,
  Col,
  message,
  Image
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

//import logo from './logo.svg'; // Replace with your logo

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/Home");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/login`, {
        email: values.username,
        password: values.password,
      });

      localStorage.setItem("token", response.data.token);
      message.success("Login successful!");
      navigate("/Home");
    } catch (error) {
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row justify="center" align="middle" style={{ height: '100%' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card
              style={{
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
              
                <Title level={3} style={{ marginBottom: '8px' }}>
                  Welcome Back
                </Title>
                <Text type="secondary">
                  Please enter your credentials to login
                </Text>
              </Space>

              <Divider />

              <Form
                form={form}
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                style={{ marginTop: '24px' }}
              >
                <Form.Item
                  name="username"
                  label="Username or Email"
                  rules={[
                    { required: true, message: 'Please input your username or email!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Enter your username or email" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Enter your password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Link href="/forgot-password">Forgot password?</Link>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>

             
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginPage;