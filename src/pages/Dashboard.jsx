import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { ShoppingOutlined, LineChartOutlined, InboxOutlined, DollarOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import dayjs from 'dayjs';

const { Title } = Typography;

const Dashboard = () => {
  const products = useLiveQuery(() => db.products.toArray()) || [];
  const sales = useLiveQuery(() => db.sales.toArray()) || [];

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSalesCount = sales.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  // Prepare chart data
  const salesByDate = sales.reduce((acc, sale) => {
    const date = dayjs(sale.timestamp).format('MM-DD');
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {});

  const chartData = Object.keys(salesByDate).map(date => ({
    date,
    revenue: salesByDate[date]
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#e6f7ff' }}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#096dd9' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#f6ffed' }}>
            <Statistic
              title="Sales Count"
              value={totalSalesCount}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#389e0d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fff7e6' }}>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#d46b08' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fff1f0' }}>
            <Statistic
              title="Low Stock Alert"
              value={lowStockProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Revenue Trend (Daily)">
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
