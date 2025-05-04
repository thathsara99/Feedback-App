import React, { useState, useEffect } from "react";
import {
  Layout, Menu, Switch, Avatar, Typography, Space, Divider, Dropdown, Button,
} from "antd";
import {
  UserOutlined, HomeOutlined, InfoCircleOutlined,
  LogoutOutlined, DownOutlined, CheckOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import axios from "axios";
import { useCompany } from "../contexts/CompanyContext";


const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const baseURL= 'http://localhost:5000/api';

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const { selectedCompany, setSelectedCompany } = useCompany();

  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseURL}/my-companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setCompanyList(response.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const items = companyList;

  const companyMenu = (
    <Menu
      style={{
        backgroundColor: "#1f1f1f",
        color: "#fff",
        borderRadius: 8,
        padding: "4px 0",
      }}
    >
     {items.map((item) => (
      <Menu.Item
        key={item._id}
        onClick={() => setSelectedCompany(item)}
        icon={selectedCompany?.name === item.name ? <CheckOutlined /> : null}
        style={{
          backgroundColor: "transparent",
          color: "#fff",
          padding: "8px 16px",
        }}
      >
        {item.name}
      </Menu.Item>
    ))}
    </Menu>
  );

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Profile",
          icon: <UserOutlined />,
          onClick: () => navigate("/profile"),
        },
        {
          type: "divider",
        },
        {
          key: "2",
          label: "Logout",
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        },
      ]}
    />
  );

  const headerBgColor = "#001529";
  const headerTextColor = "rgba(255, 255, 255, 0.85)";

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            height: 64,
            lineHeight: "64px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            backgroundColor: headerBgColor,
          }}
        >
          <Space>
            <Title
              level={4}
              style={{ color: headerTextColor, margin: 0, cursor: "pointer" }}
            >
              <Link to="/" style={{ color: "inherit" }}>
                FeedbackApp
              </Link>
            </Title>

            <Divider
              type="vertical"
              style={{
                height: 32,
                margin: 0,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            />

            <Dropdown overlay={companyMenu} trigger={["click"]}>
              <Button
                style={{
                  backgroundColor: "#1f1f1f",
                  color: "#fff",
                  borderColor: "#333",
                  padding: "6px 12px",
                  borderRadius: 6,
                }}
              >
                {selectedCompany?.name || "Select Company"} <DownOutlined />
              </Button>
            </Dropdown>

            <Divider
              type="vertical"
              style={{
                height: 32,
                margin: 0,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            />

            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              style={{
                borderBottom: "none",
                backgroundColor: "transparent",
                lineHeight: "62px",
                width:'600px'
              }}
              items={[
                {
                  key: "1",
                  label: (
                    <Link to="/home" style={{ color: headerTextColor }}>
                      Dashboard
                    </Link>
                  ),
                  icon: <HomeOutlined style={{ color: headerTextColor }} />,
                },
                {
                  key: "2",
                  label: (
                    <Link to="/templates" style={{ color: headerTextColor }}>
                      Templates
                    </Link>
                  ),
                  icon: <InfoCircleOutlined style={{ color: headerTextColor }} />,
                },
                {
                  key: "3",
                  label: (
                    <Link to="/companies" style={{ color: headerTextColor }}>
                      Company
                    </Link>
                  ),
                  icon: <InfoCircleOutlined style={{ color: headerTextColor }} />,
                },
                {
                  key: "4",
                  label: (
                    <Link to="/users" style={{ color: headerTextColor }}>
                      User
                    </Link>
                  ),
                  icon: <UserOutlined style={{ color: headerTextColor }} />,
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
              style={{ backgroundColor: "#1890ff" }}
            />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Avatar
                src="https://i.pravatar.cc/40"
                icon={<UserOutlined />}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#1890ff",
                }}
              />
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: darkMode ? "#141414" : "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: darkMode ? "#1f1f1f" : "#f0f2f5",
            padding: "16px 0",
            borderTop: `1px solid ${darkMode ? "#303030" : "#e8e8e8"}`,
            color: darkMode
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(0, 0, 0, 0.65)",
          }}
        >
          FeedbackApp ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
