import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

const Inventory = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const products = useLiveQuery(() => db.products.toArray()) || [];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await db.products.delete(id);
      message.success(t('done'));
    } catch (error) {
      message.error('Failed');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await db.products.update(editingId, values);
        message.success(t('done'));
      } else {
        await db.products.add(values);
        message.success(t('done'));
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const columns = [
    { title: t('name'), dataIndex: 'name', key: 'name' },
    { title: t('barcode'), dataIndex: 'barcode', key: 'barcode' },
    { title: t('category'), dataIndex: 'category', key: 'category' },
    { title: t('price'), dataIndex: 'price', key: 'price', render: (price) => `$${price.toFixed(2)}` },
    { title: t('stock'), dataIndex: 'stock', key: 'stock' },
    {
      title: t('actions'),
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title={t('inventory')} extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>{t('add_product')}</Button>}>
        <Table columns={columns} dataSource={products} rowKey="id" />
      </Card>

      <Modal
        title={editingId ? t('edit_product') : t('add_product')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={t('save')}
        cancelText={t('cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="barcode" label={t('barcode')}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label={t('category')}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label={t('price')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label={t('stock')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;
