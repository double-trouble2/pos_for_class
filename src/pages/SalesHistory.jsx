import React from 'react';
import { Table, Card, Typography, List, Tag } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import dayjs from 'dayjs';

const { Text } = Typography;

const SalesHistory = () => {
  const sales = useLiveQuery(() => db.sales.orderBy('timestamp').reverse().toArray()) || [];

  const columns = [
    { 
      title: 'Date & Time', 
      dataIndex: 'timestamp', 
      key: 'timestamp',
      render: (ts) => dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
    },
    { 
      title: 'Items', 
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
      title: 'Total Amount', 
      dataIndex: 'total', 
      key: 'total',
      render: (total) => <Tag color="green" style={{ fontSize: '14px' }}>${total.toFixed(2)}</Tag>
    },
  ];

  return (
    <Card title="Sales History">
      <Table columns={columns} dataSource={sales} rowKey="id" />
    </Card>
  );
};

export default SalesHistory;
