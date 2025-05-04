import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
  Space,
  message,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useCompany } from "../contexts/CompanyContext";
import { Tooltip } from 'antd';
const token = localStorage.getItem('token');

const { Option } = Select;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const UsersPage = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedCompany } = useCompany();

  // Fetch user list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/users', {
        params: {
          companyId: selectedCompany?.id,
        },
      });
      const users = response.data.map((user) => ({
        ...user,
        key: user._id,
      }));
      setData(users);
    } catch (err) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    console.log('Selected company:', selectedCompany);
  },  [selectedCompany]);

  const showDrawer = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        status: record.active,
      });
      setEditingUser(record._id);
    } else {
      form.resetFields();
      setEditingUser(null);
    }
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  const onFinish = async (values) => {
    console.log('onFinish called with:', values);
    try {
      const payload = {
        ...values,
        status: values.status || false, // not `active`
        companyId: String(selectedCompany?.id),
      };

      if (editingUser) {
        await axiosInstance.put(`/api/users/${editingUser._id}`, payload);
        message.success('User updated successfully');
      } else {
        await axiosInstance.post('/api/users', payload);
        message.success('User created successfully');
      }

      fetchUsers();
      setVisible(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      message.success('User deleted');
      fetchUsers();
    } catch (err) {
      message.error('Delete failed');
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) =>
        role === 'company_admin' ? 'Company Admin' :
role === 'general_user' ? 'General User' : 'Unknown Role',

    },
    {
      title: 'Status',
      dataIndex: 'active',
      render: (active) =>
        active ? (
          <span style={{ color: 'green' }}>Active</span>
        ) : (
          <span style={{ color: 'red' }}>Inactive</span>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showDrawer(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link" icon={<DeleteOutlined />}>
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
          <h2>User Management</h2>
        </Col>
        <Col>
          <Tooltip
            title={!selectedCompany ? 'Please select a company to add users' : ''}
            placement="top"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showDrawer()}
              disabled={!selectedCompany}
            >
              Add New User
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 6 }}
          bordered
        />
      </Spin>

      <Drawer
        title={editingUser ? 'Edit User' : 'Add New User'}
        width={500}
        onClose={onClose}
        open={visible}
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
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Enter phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Select role' }]}
          >
            <Select>
              <Option value="company_admin">Company Admin</Option>
              <Option value="general_user">General User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UsersPage;
