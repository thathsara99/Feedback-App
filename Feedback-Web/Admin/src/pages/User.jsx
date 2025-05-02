import React, { useState } from 'react';
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
} from '@ant-design/icons';

const { Option } = Select;

const TemplatesPage = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [data, setData] = useState([
    {
      key: '1',
      templateName: 'Star Rating Template',
      type: 'StarRating',
      requireComment: true,
      requireUsername: false,
    },
    {
      key: '2',
      templateName: 'Smile Rating Template',
      type: 'SmileRating',
      requireComment: false,
      requireUsername: true,
    },
    {
      key: '3',
      templateName: 'Customer Feedback',
      type: 'Questionnaire',
      requireComment: true,
      requireUsername: true,
      config: {
        questions: [
          { question: 'How was our service?', type: 'text' },
          { question: 'Rate the cleanliness.', type: 'rating' },
        ],
      },
    },
  ]);

  const showDrawer = (record = null) => {
    if (record) {
      form.setFieldsValue(record);
      setEditingId(record.key);
    } else {
      form.resetFields();
      setEditingId(null);
    }
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    if (editingId) {
      // Update existing record
      setData((prev) =>
        prev.map((item) =>
          item.key === editingId
            ? { ...item, ...values }
            : item
        )
      );
      message.success('Template updated successfully');
    } else {
      // Add new record
      const newRecord = {
        ...values,
        key: Date.now().toString(),
      };

      // Add dummy config if type is Questionnaire
      if (newRecord.type === 'Questionnaire') {
        newRecord.config = {
          questions: [
            { question: 'New question 1?', type: 'text' },
            { question: 'New question 2?', type: 'rating' },
          ],
        };
      }

      setData((prev) => [...prev, newRecord]);
      message.success('Template added successfully');
    }
    setVisible(false);
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Template deleted successfully');
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
              setSelectedTemplate(record);
              setPreviewVisible(true);
            }}
          >
            Preview
          </Button>

          <Popconfirm
            title="Are you sure to delete this template?"
            onConfirm={() => handleDelete(record.key)}
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
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Drawer Form */}
      <Drawer
        title={editingId ? 'Edit Template' : 'Add New Template'}
        width={500}
        onClose={onClose}
        visible={visible}
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
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select template type' }]}
          >
            <Select placeholder="Select template type">
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
        </Form>
      </Drawer>

      {/* Preview Modal */}
      <Modal
        title="Template Preview"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        {selectedTemplate && (
          <div>
            <h3>{selectedTemplate.templateName}</h3>
            <p>
              <strong>Type:</strong> {selectedTemplate.type}
            </p>

            {selectedTemplate.type === 'Questionnaire' &&
              selectedTemplate.config?.questions?.length > 0 && (
                <div>
                  {selectedTemplate.config.questions.map((q, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                      <p>
                        <strong>Q{index + 1}:</strong> {q.question}
                      </p>
                      {q.type === 'text' ? (
                        <Input placeholder="Your answer..." disabled />
                      ) : null}
                      {q.type === 'rating' ? (
                        <div>⭐ ⭐ ⭐ ⭐ ⭐</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

            {selectedTemplate.type === 'StarRating' && (
              <div style={{ fontSize: '20px' }}>⭐ ⭐ ⭐ ⭐ ⭐</div>
            )}

            {selectedTemplate.type === 'SmileRating' && (
              <div style={{ fontSize: '24px' }}>😞 😐 😀</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplatesPage;
