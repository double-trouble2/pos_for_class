import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  HistoryOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import './App.css';

const { Header, Sider, Content } = Layout;

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import SalesHistory from './pages/SalesHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: t('dashboard'),
    },
    {
      key: '/pos',
      icon: <ShoppingCartOutlined />,
      label: t('pos'),
    },
    {
      key: '/inventory',
      icon: <InboxOutlined />,
      label: t('inventory'),
    },
    {
      key: '/sales',
      icon: <HistoryOutlined />,
      label: t('sales_history'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('settings'),
    },
  ];

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)' }}>
        <div className="demo-logo-vertical" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#1890ff' }}>
          {collapsed ? 'POS' : t('market_pos')}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', paddingRight: '24px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ flex: 1 }} />
          <Space size="large">
            <Select
              defaultValue={i18n.language}
              style={{ width: 120 }}
              onChange={changeLanguage}
              suffixIcon={<GlobalOutlined />}
              variant="borderless"
            >
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="uz">O'zbekcha</Select.Option>
            </Select>
            <div style={{ fontWeight: 500 }}>Admin User</div>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<SalesHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;


