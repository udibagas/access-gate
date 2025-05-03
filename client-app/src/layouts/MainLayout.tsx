import { useState } from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, MenuProps, Modal, Space, theme, Typography } from 'antd';
import AppMenu from '../components/AppMenu';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { axiosInstance } from '../lib/api';

const queryClient = new QueryClient();
const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const navigate = useNavigate();
  const { user } = useLoaderData()

  const menuItems: MenuProps['items'] = [
    { key: "profile", label: 'Profile', icon: <UserOutlined />, onClick: () => navigate('/profile') },
    { key: "logout", label: 'Logout', icon: <LogoutOutlined />, onClick: logout },
  ]

  function logout() {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to logout?',
      icon: <LogoutOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        axiosInstance.post('/auth/logout').then(() => {
          navigate('/login');
        });
      },
    })
  }

  return (
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }} className='flex items-center justify-between'>
        <div>
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

          <span className='text-2xl font-bold'>Access Gate</span>
        </div>


        <Dropdown menu={{ items: menuItems }} placement="bottom" arrow className='mr-4'>
          <Space>
            <Avatar style={{ backgroundColor: 'black' }} size={40} icon={<UserOutlined />} />
            <div className='flex flex-col'>
              <Text strong>{user.name}</Text>
              <Text type="secondary">{user.email}</Text>
            </div>
          </Space>
        </Dropdown>
      </Header>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} theme='dark'>
          <AppMenu />
        </Sider>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </Content>
      </Layout>
    </Layout>
  )
}