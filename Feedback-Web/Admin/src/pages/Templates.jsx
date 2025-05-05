import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Checkbox,
  Popconfirm,
  Space,
  message,
  Row,
  Col,
  Modal,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useCompany } from '../contexts/CompanyContext';

const { Option } = Select;

const TemplatesPage = () => {
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [data, setData] = useState([]);
  const { selectedCompany } = useCompany();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const fetchTemplates = async () => {
    if (!selectedCompany?.id) return;
    try {
      const res = await axiosInstance.get(`/api/templatesByCompany`, {
        params: { id: selectedCompany.id },
      });
      const templates = Array.isArray(res.data) ? res.data : [res.data];
      const mapped = templates.map((t) => ({ ...t, key: t.id }));
      setData(mapped);
    } catch (err) {
      console.error(err);
      message.error('Failed to load templates');
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCompany]);

  const showDrawer = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        questions: record.config?.questions || [],
      });
      setSelectedType(record.type);
      setEditingId(record.id);
    } else {
      form.resetFields();
      setSelectedType(null);
      setEditingId(null);
    }
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const onFinish = async (values) => {
    try {
      const newTemplate = {
        companyId: selectedCompany.id,
        templateName: values.templateName,
        type: values.type,
        requireComment: !!values.requireComment,
        requireUsername: !!values.requireUsername,
        config:
          values.type === 'Questionnaire' ? { questions: values.questions || [] } : {},
      };

      console.log('Submitting template:', newTemplate);

      if (editingId) {
        newTemplate.id = editingId;
        await axiosInstance.put('/api/templates', newTemplate);
        message.success('Template updated');
      } else {
        await axiosInstance.post('/api/templates', newTemplate);
        message.success('Template added');
      }

      onClose();
      fetchTemplates();
    } catch (err) {
      console.error(err);
      message.error('Error saving template');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/templates/${id}`);
      message.success('Template deleted');
      fetchTemplates();
    } catch (err) {
      console.error(err);
      message.error('Error deleting template');
    }
  };

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showDrawer(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => {
            setSelectedTemplate(record);
            setPreviewVisible(true);
          }}>
            Preview
          </Button>
          <Popconfirm
            title="Are you sure to delete this template?"
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
          <h2>Templates</h2>
        </Col>
        <Col>
        <Tooltip
        title={!selectedCompany ? 'Please select a company to add Template' : ''}
        placement="top">
          <Button type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showDrawer()}
                        disabled={!selectedCompany}>
            Add New
          </Button>
          </Tooltip>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} bordered pagination={{ pageSize: 5 }} />

      <Drawer
        title={editingId ? 'Edit Template' : 'Add New Template'}
        width={600}
        open={drawerOpen}
        onClose={onClose}
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
            name="templateName"
            label="Template Name"
            rules={[{ required: true, message: 'Please enter template name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select template type' }]}
          >
            <Select onChange={(value) => setSelectedType(value)}>
              <Option value="StarRating">Star Rating</Option>
              <Option value="SmileRating">Smile Rating</Option>
              <Option value="Questionnaire">Questionnaire</Option>
            </Select>
          </Form.Item>

          <Form.Item name="requireComment" valuePropName="checked">
            <Checkbox>Require Comment</Checkbox>
          </Form.Item>

          <Form.Item name="requireUsername" valuePropName="checked">
            <Checkbox>Require Username</Checkbox>
          </Form.Item>

          {selectedType === 'Questionnaire' && (
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <>
                  <h4>Questions</h4>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'question']}
                        rules={[{ required: true, message: 'Enter question' }]}
                      >
                        <Input placeholder="Question" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        rules={[{ required: true, message: 'Select type' }]}
                      >
                        <Select placeholder="Type" style={{ width: 120 }}>
                          <Option value="text">Text</Option>
                          <Option value="rating">Rating</Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Question
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
        </Form>
      </Drawer>

      <Modal
        title="Template Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        {selectedTemplate && (
          <div>
            <h3>{selectedTemplate.templateName}</h3>
            <p><strong>Type:</strong> {selectedTemplate.type}</p>
            {selectedTemplate.type === 'Questionnaire' && (
              <div>
                {selectedTemplate.config?.questions?.map((q, i) => (
                  <div key={i}>
                    <p><strong>Q{i + 1}:</strong> {q.question}</p>
                    {q.type === 'text' ? (
                      <Input placeholder="Answer..." disabled />
                    ) : (
                      <p>⭐ Rating Input (disabled)</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplatesPage;
