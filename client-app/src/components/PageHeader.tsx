import React from "react";
import { Typography, Space } from "antd";

const { Title, Text } = Typography;

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <Space align="center" style={{ justifyContent: 'space-between', width: '100%', marginBottom: '2rem' }}>
      <div>
        <Title level={3} style={{ marginBottom: 0 }}>{title}</Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
      <div className="flex justify-space-between items-center gap-2">
        {children}
      </div>
    </Space>
  );
};

export default PageHeader;
