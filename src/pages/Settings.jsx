import React from 'react';
import { Card, Button, Typography, Space, message, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { db } from '../db/db';

const { Title, Paragraph, Text } = Typography;

const Settings = () => {
  const handleClearData = async () => {
    try {
      await db.products.clear();
      await db.sales.clear();
      await db.categories.clear();
      message.success('All data cleared successfully');
    } catch (error) {
      message.error('Failed to clear data');
    }
  };

  return (
    <Card title="System Settings">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>General Information</Title>
          <Paragraph>
            <Text strong>App Name:</Text> Market POS System<br />
            <Text strong>Version:</Text> 1.0.0<br />
            <Text strong>Database:</Text> IndexedDB (Local)
          </Paragraph>
        </div>
        
        <Divider />
        
        <div>
          <Title level={4} type="danger">Danger Zone</Title>
          <Paragraph>
            The following actions are irreversible. Please be careful.
          </Paragraph>
          <Popconfirm
            title="Clear all data?"
            description="This will delete all products and sales history. Are you sure?"
            onConfirm={handleClearData}
            okText="Yes, Clear Everything"
            cancelText="No"
            icon={<WarningOutlined style={{ color: 'red' }} />}
          >
            <Button danger icon={<DeleteOutlined />}>Reset All Data</Button>
          </Popconfirm>
        </div>
      </Space>
    </Card>
  );
};

export default Settings;
