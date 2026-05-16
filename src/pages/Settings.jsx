import React from 'react';
import { Card, Button, Typography, Space, message, Popconfirm, Divider, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, WarningOutlined, GlobalOutlined } from '@ant-design/icons';
import { db } from '../db/db';

const { Title, Paragraph, Text } = Typography;

const Settings = () => {
  const { t, i18n } = useTranslation();

  const handleClearData = async () => {
    try {
      await db.products.clear();
      await db.sales.clear();
      await db.categories.clear();
      await db.customers.clear();
      message.success(t('done'));
    } catch (error) {
      message.error('Failed');
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Card title={t('settings')}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>{t('language')}</Title>
          <Select
            defaultValue={i18n.language}
            style={{ width: 200 }}
            onChange={changeLanguage}
            suffixIcon={<GlobalOutlined />}
          >
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="uz">O'zbekcha</Select.Option>
          </Select>
        </div>

        <Divider />

        <div>
          <Title level={4}>System Information</Title>
          <Paragraph>
            <Text strong>App Name:</Text> Market POS System<br />
            <Text strong>Version:</Text> 1.0.0<br />
            <Text strong>Database:</Text> IndexedDB (Local)
          </Paragraph>
        </div>
        
        <Divider />
        
        <div>
          <Title level={4} type="danger">Danger Zone</Title>
          <Popconfirm
            title="Clear all data?"
            onConfirm={handleClearData}
            okText="Yes"
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
