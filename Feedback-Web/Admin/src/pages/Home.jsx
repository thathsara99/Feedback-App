import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Rate,
  message
} from 'antd';
import dayjs from 'dayjs';
import { 
  FileTextOutlined, 
  FileDoneOutlined, 
  FileSyncOutlined, 
  UserOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import { useCompany } from "../contexts/CompanyContext";
import axios from 'axios';
const { Title } = Typography;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
});

const DashboardPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedCompany } = useCompany();

  const [dashboardData, setDashboardData] = useState({
    totalTemplates: 0,
    todayReviews: 0,
    allReviews: 0,
    totalUsers: 0,
  });

  const fetchDashboardData = async () => {
    if (!selectedCompany?.id) return;

    try {
      const res = await axiosInstance.get('/api/dashboardCounts', {
        params: { companyId: selectedCompany.id },
      });

      setDashboardData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      message.error('Failed to load dashboard data');
    }
  };

  const fetchReviews = async () => {
    if (!selectedCompany?.id) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get('/allReviewsForCompany', {
        params: { companyId: selectedCompany.id },
      });

      const formatted = res.data.map((review) => ({
        key: review.id,
        ...review,
      }));

      setReviews(formatted);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      message.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchReviews();
  }, [selectedCompany?.id]);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type?.charAt(0).toUpperCase() + type?.slice(1),
    },
    {
      title: 'Preview',
      key: 'preview',
      render: (_, record) => {
        const type = record.type || '';
        const data = record.data || {};

        switch (type.toLowerCase()) {
          case 'star':
            return (
              <>
                <span>Rating: </span>
                <Rate disabled value={data.rating || 0} />
              </>
            );
          case 'smile':
            return (
              <>
                <span>Feedback: </span>
                <Rate disabled value={data.smile || 0} character="😊" />
              </>
            );
          case 'questionnaire':
            return (
              <>
                {data.questions?.map((q, idx) => (
                  <div key={idx}>
                    <strong>{q.question}</strong>: {q.answer}
                  </div>
                )) || <span>No questions answered</span>}
              </>
            );
          default:
            return <span>No preview available</span>;
        }
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Date & Time',
      dataIndex: 'datetime',
      key: 'datetime',
      width: '200px',
      render: (datetime) => dayjs(datetime).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) =>
        dayjs(a.datetime).unix() - dayjs(b.datetime).unix(),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>Dashboard Overview</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Templates"
              value={dashboardData.totalTemplates}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Reviews"
              value={dashboardData.todayReviews}
              prefix={<FileSyncOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="All Reviews"
              value={dashboardData.allReviews}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={dashboardData.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Space style={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0' }}>
            <Title level={4}>Comments Table</Title>
            <Button type="primary" icon={<UploadOutlined />}>
              Push
            </Button>
          </Space>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={reviews}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;