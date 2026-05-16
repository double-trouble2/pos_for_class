import React, { useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, 
  Space, message, Card, Tabs, Select, Tag, Typography 
} from 'antd';
import { 
  PlusOutlined, 
  ImportOutlined, 
  UserOutlined, 
  HistoryOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Warehouse = () => {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [stockForm] = Form.useForm();
  const [supplierForm] = Form.useForm();

  // Queries
  const products = useLiveQuery(() => db.products.toArray()) || [];
  const suppliers = useLiveQuery(() => db.suppliers.toArray()) || [];
  const logs = useLiveQuery(() => db.warehouse_logs.orderBy('timestamp').reverse().toArray()) || [];

  // Handlers
  const handleAddStock = async () => {
    try {
      const values = await stockForm.validateFields();
      const product = products.find(p => p.id === values.productId);
      
      if (!product) {
        message.error('Product not found');
        return;
      }

      // Update product stock
      const newStock = product.stock + values.quantity;
      await db.products.update(values.productId, { stock: newStock });

      // Add log
      await db.warehouse_logs.add({
        productId: values.productId,
        productName: product.name,
        type: 'IN',
        quantity: values.quantity,
        supplierId: values.supplierId,
        timestamp: new Date().getTime()
      });

      message.success(`Added ${values.quantity} to ${product.name}`);
      setIsStockModalOpen(false);
      stockForm.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSupplier = async () => {
    try {
      const values = await supplierForm.validateFields();
      await db.suppliers.add(values);
      message.success('Supplier added successfully');
      setIsSupplierModalOpen(false);
      supplierForm.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  const logColumns = [
    { 
      title: 'Vaqt', 
      dataIndex: 'timestamp', 
      key: 'timestamp',
      sorter: (a, b) => a.timestamp - b.timestamp,
      render: (t) => dayjs(t).format('DD.MM.YYYY HH:mm')
    },
    { title: 'Mahsulot', dataIndex: 'productName', key: 'productName', sorter: (a, b) => a.productName.localeCompare(b.productName) },
    { 
      title: 'Tur', 
      dataIndex: 'type', 
      key: 'type',
      filters: [
        { text: 'Kirish', value: 'IN' },
        { text: 'Chiqish', value: 'OUT' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={type === 'IN' ? 'green' : 'red'}>
          {type === 'IN' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {type === 'IN' ? 'Kirish' : 'Chiqish'}
        </Tag>
      )
    },
    { title: 'Miqdor', dataIndex: 'quantity', key: 'quantity', sorter: (a, b) => a.quantity - b.quantity },
    { 
      title: 'Yetkazib beruvchi', 
      dataIndex: 'supplierId', 
      key: 'supplierId',
      render: (sid) => suppliers.find(s => s.id === sid)?.name || 'Noma\'lum'
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record) => (
        <Button 
          danger 
          size="small" 
          icon={<DeleteOutlined />} 
          onClick={() => {
            Modal.confirm({
              title: 'Harakatni o\'chirish',
              content: 'Haqiqatan ham ushbu logni o\'chirmoqchimisiz? (Bu ombordagi miqdorni o\'zgartirmaydi)',
              onOk: () => db.warehouse_logs.delete(record.id)
            });
          }}
        />
      )
    }
  ];

  const supplierColumns = [
    { title: 'Nomi', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Telefon', dataIndex: 'phone', key: 'phone' },
    { title: 'Mas\'ul shaxs', dataIndex: 'contactPerson', key: 'contactPerson' },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => {
              supplierForm.setFieldsValue(record);
              setIsSupplierModalOpen(true);
            }} 
          />
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />} 
            onClick={() => {
              Modal.confirm({
                title: 'Yetkazib beruvchini o\'chirish',
                content: 'Ushbu yetkazib beruvchini o\'chirmoqchimisiz?',
                onOk: () => db.suppliers.delete(record.id)
              });
            }}
          />
        </Space>
      )
    }
  ];

  const items = [
    {
      key: '1',
      label: (
        <span>
          <HistoryOutlined />
          Ombor Harakati
        </span>
      ),
      children: (
        <Card 
          title="Ombor Harakati (Logs)" 
          extra={
            <Button type="primary" icon={<ImportOutlined />} onClick={() => setIsStockModalOpen(true)}>
              Yangi Yuk Qabul Qilish
            </Button>
          }
        >
          <Table columns={logColumns} dataSource={logs} rowKey="id" />
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <UserOutlined />
          Yetkazib Beruvchilar
        </span>
      ),
      children: (
        <Card 
          title="Yetkazib Beruvchilar Ro'yxati" 
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSupplierModalOpen(true)}>
              Yetkazib Beruvchi Qo'shish
            </Button>
          }
        >
          <Table columns={supplierColumns} dataSource={suppliers} rowKey="id" />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      <Title level={2}>Omborxonani Boshqarish</Title>
      <Tabs defaultActiveKey="1" items={items} />

      {/* Stock Entry Modal */}
      <Modal
        title="Yangi Yuk Qabul Qilish"
        open={isStockModalOpen}
        onOk={handleAddStock}
        onCancel={() => setIsStockModalOpen(false)}
      >
        <Form form={stockForm} layout="vertical">
          <Form.Item name="productId" label="Mahsulotni Tanlang" rules={[{ required: true }]}>
            <Select showSearch placeholder="Mahsulot qidirish..." filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
              {products.map(p => <Option key={p.id} value={p.id}>{p.name} (Hozir: {p.stock})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Miqdor" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="supplierId" label="Yetkazib Beruvchi" rules={[{ required: true }]}>
            <Select placeholder="Yetkazib beruvchini tanlang">
              {suppliers.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Supplier Modal */}
      <Modal
        title="Yangi Yetkazib Beruvchi Qo'shish"
        open={isSupplierModalOpen}
        onOk={handleAddSupplier}
        onCancel={() => setIsSupplierModalOpen(false)}
      >
        <Form form={supplierForm} layout="vertical">
          <Form.Item name="name" label="Kompaniya Nomi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Telefon Raqami">
            <Input />
          </Form.Item>
          <Form.Item name="contactPerson" label="Mas'ul Shaxs">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Warehouse;
