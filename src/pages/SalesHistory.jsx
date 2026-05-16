import React, { useState } from 'react';
import { Table, Card, Typography, List, Tag, Row, Col, Statistic, Input, Space, Button, Popconfirm, message, Modal, Tooltip, Badge, Divider } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { 
  HistoryOutlined, 
  SearchOutlined, 
  DollarCircleOutlined, 
  ShoppingCartOutlined, 
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  AreaChartOutlined,
  PrinterOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const SalesHistory = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const sales = useLiveQuery(() => db.sales.orderBy('timestamp').reverse().toArray()) || [];

  // Calculate statistics
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalSalesCount = sales.length;
  const avgSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

  const handleDelete = async (id) => {
    try {
      await db.sales.delete(id);
      message.success(t('sale_deleted_success', 'Sale record deleted successfully'));
    } catch (error) {
      message.error(t('sale_delete_error', 'Failed to delete sale'));
    }
  };

  const showDetails = (sale) => {
    setSelectedSale(sale);
    setIsModalVisible(true);
  };

  const filteredSales = sales.filter(sale => 
    sale.id?.toString().includes(searchText) || 
    sale.items?.some(item => item.name?.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    { 
      title: t('order_id', 'Order ID'),
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text code>#{id}</Text>
    },
    { 
      title: t('timestamp', 'Date & Time'), 
      dataIndex: 'timestamp', 
      key: 'timestamp',
      render: (ts) => (
        <Space direction="vertical" size={0}>
          <Text strong>{dayjs(ts).format('MMM DD, YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(ts).format('HH:mm:ss')}</Text>
        </Space>
      )
    },
    { 
      title: t('items', 'Items'), 
      dataIndex: 'items', 
      key: 'items',
      render: (items) => (
        <Badge count={items?.length} color="#1890ff">
          <Button type="link" onClick={() => showDetails({ items })} icon={<ShoppingCartOutlined />}>
            {items?.length} {t('items_count', 'Items')}
          </Button>
        </Badge>
      )
    },
    { 
      title: t('total', 'Total Amount'), 
      dataIndex: 'total', 
      key: 'total',
      render: (total) => (
        <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
          ${total?.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: t('actions', 'Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Tooltip title={t('view_details', 'View Details')}>
            <Button 
              type="text" 
              icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => showDetails(record)} 
            />
          </Tooltip>
          <Popconfirm
            title={t('delete_confirm', 'Are you sure you want to delete this record?')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('yes', 'Yes')}
            cancelText={t('no', 'No')}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('delete', 'Delete')}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <HistoryOutlined className="mr-2 text-primary-500" />
            {t('sales_history', 'Sales History')}
          </Title>
          <Text type="secondary">{t('sales_history_subtitle', 'Manage and track your store performance')}</Text>
        </div>
        <Space>
          <Input 
            placeholder={t('search_order_placeholder', 'Search by ID or items...')}
            prefix={<SearchOutlined className="text-slate-400" />}
            className="w-72 rounded-lg"
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
          <Button icon={<ExportOutlined />}>{t('export', 'Export CSV')}</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t('total_revenue', 'Total Revenue')}
              value={totalRevenue}
              precision={2}
              prefix={<DollarCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t('sales_count', 'Total Orders')}
              value={totalSalesCount}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={t('avg_sale', 'Average Order Value')}
              value={avgSale}
              precision={2}
              prefix={<AreaChartOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card bordered={false} className="shadow-sm rounded-xl overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={filteredSales} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title={`${t('order_details', 'Order Details')} #${selectedSale?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            {t('close', 'Close')}
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}>
            {t('print_receipt', 'Print Receipt')}
          </Button>
        ]}
        width={600}
      >
        {selectedSale && (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <Text type="secondary">{t('timestamp', 'Date')}</Text>
              <Text strong>{dayjs(selectedSale.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </div>
            
            <List
              itemLayout="horizontal"
              dataSource={selectedSale.items}
              renderItem={item => (
                <List.Item
                  extra={<Text strong>${(item.price * item.quantity).toFixed(2)}</Text>}
                >
                  <List.Item.Meta
                    title={<Text strong>{item.name}</Text>}
                    description={`${item.quantity} x $${item.price.toFixed(2)}`}
                  />
                </List.Item>
              )}
            />
            
            <div className="flex justify-between pt-4 border-t">
              <Title level={4}>{t('total', 'Total')}</Title>
              <Title level={4} style={{ color: '#52c41a' }}>${selectedSale.total?.toFixed(2)}</Title>
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .custom-table :global(.ant-table-thead > tr > th) {
          background: #fafafa;
          font-weight: 600;
        }
        .custom-table :global(.ant-table-tbody > tr:hover > td) {
          background: #f0f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default SalesHistory;
