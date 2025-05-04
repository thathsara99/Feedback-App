import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Row,
  Col,
  Card,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const token = localStorage.getItem('token');

const CLOUD_NAME = 'dq6bxromn'; // Replace with your actual cloud name
const UPLOAD_PRESET = 'unsigned_profile_upload'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/api/profile');
      const { firstName, lastName, email, phoneNumber, profilePic } = res.data;
      form.setFieldsValue({ firstName, lastName, email, phoneNumber });
      setPreviewUrl(profilePic); // URL from backend
    } catch (err) {
      message.error('Failed to load profile');
    }
  };

  const handleImageChange = async (info) => {
    const file = info.file;
    if (!file) return;
  
    const originFile = file.originFileObj || file;
  
    const isJpgOrPng = originFile.type === 'image/jpeg' || originFile.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Only JPG/PNG files are allowed!');
      return;
    }
  
    const isLt2M = originFile.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', originFile);
    formData.append('upload_preset', UPLOAD_PRESET);
  
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.secure_url) {
        setProfilePic(data.secure_url);
        setPreviewUrl(data.secure_url);
        await axiosInstance.put('/api/profile', {
          profilePic: data.secure_url,
        });
        message.success('Image uploaded!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      message.error('Image upload failed');
    }
  };
  
  const onFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      formData.append(key, val);
    });

    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      setLoading(true);
      await axiosInstance.put('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Profile updated');
    } catch (err) {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="My Profile" style={{ maxWidth: 700, margin: 'auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar size={100} src={previewUrl} />
              <Upload
                key={Date.now()}
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />} size="small" style={{ marginTop: 10 }}>
                  Change Picture
                </Button>
              </Upload>
            </div>
          </Col>
          <Col span={16}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Enter first name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Enter last name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Enter phone number' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Profile
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ProfilePage;
