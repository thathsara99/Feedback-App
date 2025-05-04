import React, { useState } from 'react';
import { Card, Row, Col, Statistic,Table, Button, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { 
  FileTextOutlined, 
  FileDoneOutlined, 
  FileSyncOutlined, 
  UserOutlined,UploadOutlined
} from '@ant-design/icons';
const { Title } = Typography;
const data = [
  {
    key: '1',
    comment: 'Import icons from @ant-design/icons, component name of icons with different theme is the icon name suffixed by the theme name. Specify the spin property to show the spinning animation.',
    datetime: '2025-05-01 14:32:00',
  },
  {
    key: '2',
    comment: 'Second comment',
    datetime: '2025-05-03 09:15:00',
  },
  {
    key: '3',
    comment: 'Another one',
    datetime: '2025-04-30 17:45:00',
  },
];



const DashboardPage = () => {
  // Sample data - replace with your actual data
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dashboardData = {
    totalTemplates: 24,
    todayReviews: 8,
    allReviews: 142,
    totalUsers: 15
  };

  const columns = [
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Date & Time',
      dataIndex: 'datetime',
      key: 'datetime',
      width:'200px',
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
        {/* Total Templates Card */}
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

        {/* Today's Reviews Card */}
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

        {/* All Reviews Card */}
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

        {/* Total Users Card */}
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
      <Col xs={24} sm={24} md={24} lg={24}>
     
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Comments Table</Title>
        <Button type="primary" icon={<UploadOutlined />}>
            Push
          </Button>
      </Space>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
  
      </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;