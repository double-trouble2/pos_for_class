import React from 'react';
import { Table, Card, Typography, List, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import dayjs from 'dayjs';

const { Text } = Typography;

const SalesHistory = () => {
  const { t } = useTranslation();
  const sales = useLiveQuery(() => db.sales.orderBy('timestamp').reverse().toArray()) || [];

  const columns = [
    { 
      title: t('timestamp'), 
      dataIndex: 'timestamp', 
      key: 'timestamp',
      render: (ts) => dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
    },
    { 
      title: t('products'), 
      dataIndex: 'items', 
      key: 'items',
      render: (items) => (
        <List
          size="small"
          dataSource={items}
          renderItem={item => (
            <div style={{ fontSize: '12px' }}>
              <Text strong>{item.name}</Text> x {item.quantity}
            </div>
          )}
        />
      )
    },
    { 
      title: t('total'), 
      dataIndex: 'total', 
      key: 'total',
      render: (total) => <Tag color="green" style={{ fontSize: '14px' }}>${total.toFixed(2)}</Tag>
    },
    {
      title: t('payment_method'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <Tag color="blue">{method ? t(method.toLowerCase()) : '-'}</Tag>
    }
  ];

  return (
    <Card title={t('sales_history')}>
      <Table columns={columns} dataSource={sales} rowKey="id" />
    </Card>
  );
};

export default SalesHistory;
