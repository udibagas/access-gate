import { useEffect, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import { Camera, Cog, Database, Home, ScanQrCode, User } from 'lucide-react';
import { Link } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    type: 'group',
    key: "main-menu",
    label: "",
    children: [
      {
        label: <Link to="/">Home</Link>,
        key: "/",
        icon: <Home />,
      },
      {
        label: <Link to="/snapshot">Snapshot</Link>,
        key: "/snapshot",
        icon: <Camera />,
      },
      {
        label: <Link to="/members">Member</Link>,
        key: "/members",
        icon: <User />,
      },
      {
        label: <Link to="/gates">Gate</Link>,
        key: "/gates",
        icon: <Cog />,
      },
      {
        label: <Link to="/cameras">Camera</Link>,
        key: "/cameras",
        icon: <Camera />,
      },
      {
        label: <Link to="/readers">Card Reader</Link>,
        key: "/readers",
        icon: <ScanQrCode />,
      },
      {
        label: <Link to="/users">Users</Link>,
        key: "/users",
        icon: <User />,
      },
      {
        label: <Link to="/backup">Backup</Link>,
        key: "/backup",
        icon: <Database />,
      },
    ],
  },
];

export default function AppSideBar() {
  const pathname = window.location.pathname
  const [selectedKey, setSelectedKeys] = useState(pathname);

  useEffect(() => {
    setSelectedKeys(window.location.pathname);
  }, [pathname]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      items={menuItems}
    />
  );
};
