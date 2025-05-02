import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  FileDoneOutlined, 
  FileSyncOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const DashboardPage = () => {
  // Sample data - replace with your actual data
  const dashboardData = {
    totalTemplates: 24,
    todayReviews: 8,
    allReviews: 142,
    totalUsers: 15
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
    </div>
  );
};

export default DashboardPage;