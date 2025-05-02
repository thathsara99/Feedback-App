import React, { useState } from "react";
import { Layout, Menu, Switch, Avatar, Typography, Space, Divider, Dropdown } from "antd";
import { UserOutlined, HomeOutlined, InfoCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Header background colors (using blue shades for both modes)
  const headerBgColor = darkMode ? '#001529' : '#001529';
  const headerTextColor = 'rgba(255, 255, 255, 0.85)';

  const handleLogout = () => {
    // Clear token from localStorage
  localStorage.removeItem("token");
  
  // Redirect to login page
  navigate('/login');
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Profile',
          icon: <UserOutlined />,
          onClick: () => navigate('/profile')
        },
        {
          type: 'divider',
        },
        {
          key: '2',
          label: 'Logout',
          icon: <LogoutOutlined />,
          onClick: handleLogout
        }
      ]}
    />
  );

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff', // Consistent blue in both modes
          borderRadius: 8,
        }
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header 
          style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            padding: '0 24px',
            height: 64,
            lineHeight: '64px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1,
            backgroundColor: headerBgColor
          }}
        >
          <Space>
            <Title 
              level={4} 
              style={{ 
                color: headerTextColor,
                margin: 0,
                cursor: 'pointer'
              }}
            >
              <Link to="/" style={{ color: 'inherit' }}>FeedbackApp</Link>
            </Title>
            <Divider type="vertical" style={{ height: 32, margin: 0, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <Menu
              theme="dark" // Always dark menu for contrast against header
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              style={{ 
                borderBottom: 'none',
                lineHeight: '62px',
                backgroundColor: 'transparent'
              }}
              items={[
                { 
                  key: "1", 
                  label: <Link to="/" style={{ color: headerTextColor }}>Dashboard</Link>,
                  icon: <HomeOutlined style={{ color: headerTextColor }} />
                },
                { 
                  key: "2", 
                  label: <Link to="/templates" style={{ color: headerTextColor }}>Templates</Link>,
                  icon: <InfoCircleOutlined style={{ color: headerTextColor }} />
                },
                { 
                  key: "3", 
                  label: <Link to="/companies" style={{ color: headerTextColor }}>Company</Link>,
                  icon: <InfoCircleOutlined style={{ color: headerTextColor }} />
                },
                { 
                  key: "4", 
                  label: <Link to="/users" style={{ color: headerTextColor }}>User</Link>,
                  icon: <UserOutlined style={{ color: headerTextColor }} />
                },
              ]}
            />
          </Space>
          
          <Space size="middle">
            <Switch 
              checked={darkMode} 
              onChange={setDarkMode} 
              checkedChildren="🌙" 
              unCheckedChildren="☀️"
              style={{
                backgroundColor: darkMode ? '#1890ff' : '#1890ff'
              }} 
            />
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Avatar 
                src="https://i.pravatar.cc/40" 
                icon={<UserOutlined />} 
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: '#1890ff',
                  ':hover': {
                    boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                  }
                }}
              />
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: "24px 16px", 
          padding: 24,
          minHeight: 280,
          background: darkMode ? "#141414" : "#fff",
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
          {children}
        </Content>
        
        <Footer style={{ 
          textAlign: 'center',
          background: darkMode ? '#1f1f1f' : '#f0f2f5',
          padding: '16px 0',
          borderTop: `1px solid ${darkMode ? '#303030' : '#e8e8e8'}`,
          color: darkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
        }}>
          FeedbackApp ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;