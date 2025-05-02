import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  message,
  Row,
  Col,
  Modal,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  GoogleOutlined,
  FacebookOutlined,
  GlobalOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const platformIcons = {
  google: <GoogleOutlined />,
  tripAdvisor: <GlobalOutlined />,
  facebook: <FacebookOutlined />,
  other: <AppstoreAddOutlined />,
};

const platformLabels = {
  google: 'Google',
  tripAdvisor: 'TripAdvisor',
  facebook: 'Facebook',
  other: 'Other',
};

const CompanyPage = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get('/companies');
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch companies');
    }
  };

  const showDrawer = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        ...record.reviewOptions,
        reviewOptions: Object.keys(record.reviewOptions || {}),
      });
      setSelectedPlatforms(Object.keys(record.reviewOptions || {}));
      setEditingId(record._id);
    } else {
      form.resetFields();
      setSelectedPlatforms([]);
      setEditingId(null);
    }
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = async (values) => {
    const reviewOptions = {};
    selectedPlatforms.forEach((platform) => {
      if (platform !== 'other' && values[platform]) {
        reviewOptions[platform] = values[platform];
      }
    });

    const companyPayload = {
      name: values.name,
      email: values.email,
      address: values.address,
      reviewOptions,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/companies/${editingId}`, companyPayload);
        message.success('Company updated successfully');
      } else {
        await axiosInstance.post('/companies', companyPayload);
        message.success('Company added successfully');
      }
      fetchCompanies();
      setVisible(false);
    } catch (error) {
      message.error('Failed to save company');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/companies/${id}`);
      message.success('Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      message.error('Failed to delete company');
    }
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showDrawer(record)}
          >
            Edit
          </Button>

          <Button
            type="link"
            onClick={() => {
              setSelectedCompany(record);
              setPreviewVisible(true);
            }}
          >
            Preview
          </Button>

          <Popconfirm
            title="Are you sure to delete this company?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2>Companies</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showDrawer()}
          >
            Add New
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Drawer
        title={editingId ? 'Edit Company' : 'Add New Company'}
        width={500}
        onClose={onClose}
        open={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={() => form.submit()} type="primary">
              Submit
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea placeholder="Enter address" rows={3} />
          </Form.Item>

          <Form.Item label="Select Review Platforms">
            <Space wrap>
              {Object.keys(platformLabels).map((platform) => (
                <Tooltip
                key={platform}
                title={
                  platform === 'other' ? (
                    <span>
                      <b>{platformLabels[platform]}</b><br />
                      By selecting this, you will be able to add your own custom review option.
                    </span>
                  ) : (
                    <span>
                      <b>{platformLabels[platform]}</b><br />
                      Click to {selectedPlatforms.includes(platform) ? 'remove' : 'add'} this platform.<br />
                      You will be prompted to provide a review link.
                    </span>
                  )
                }
              >
                <Button
                  type={selectedPlatforms.includes(platform) ? 'primary' : 'default'}
                  shape="circle"
                  icon={platformIcons[platform]}
                  onClick={() => handlePlatformToggle(platform)}
                />
              </Tooltip>
              ))}
            </Space>
          </Form.Item>

          {selectedPlatforms.map((platform) =>
            platform !== 'other' ? (
              <Form.Item
                key={platform}
                name={platform}
                label={`${platformLabels[platform]} URL`}
                rules={[
                  { required: true, message: `Please enter ${platformLabels[platform]} URL` },
                ]}
              >
                <Input placeholder={`Enter ${platformLabels[platform]} review link`} />
              </Form.Item>
            ) : null
          )}
        </Form>
      </Drawer>

      <Modal
        title="Company Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        {selectedCompany && (
          <div>
            <h3>{selectedCompany.name}</h3>
            <p>
              <strong>Email:</strong> {selectedCompany.email}
            </p>
            <p>
              <strong>Address:</strong> {selectedCompany.address}
            </p>
            <p>
              <strong>Review Platforms:</strong>
            </p>
            <ul>
              {selectedCompany.reviewOptions &&
                Object.entries(selectedCompany.reviewOptions).map(
                  ([platform, url]) => (
                    <li key={platform}>
                      {platformLabels[platform] || platform}:{' '}
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  )
                )}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyPage;
