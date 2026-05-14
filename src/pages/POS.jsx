import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, List, Button, Typography, Space, message, Divider } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

const { Title, Text } = Typography;

const POS = () => {
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  const products = useLiveQuery(() => 
    db.products.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()) || (p.barcode && p.barcode.includes(searchText))).toArray()
  , [searchText]) || [];

  const addToCart = (product) => {
    if (product.stock <= 0) {
      message.warning('Out of stock!');
      return;
    }
    
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        message.warning('Insufficient stock!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        const product = products.find(p => p.id === id);
        if (newQty > 0 && (!product || newQty <= product.stock)) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // Update stocks
      for (const item of cart) {
        const product = await db.products.get(item.id);
        await db.products.update(item.id, { stock: product.stock - item.quantity });
      }

      // Record sale
      await db.sales.add({
        timestamp: new Date(),
        total,
        items: cart
      });

      message.success('Sale completed successfully!');
      setCart([]);
    } catch (error) {
      message.error('Checkout failed');
    }
  };

  return (
    <Row gutter={16}>
      <Col span={14}>
        <Card title="Products" extra={<Input.Search placeholder="Search name or barcode" onSearch={setSearchText} onChange={e => setSearchText(e.target.value)} style={{ width: 300 }} />}>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={products}
            renderItem={item => (
              <List.Item>
                <Card 
                  hoverable 
                  size="small" 
                  onClick={() => addToCart(item)}
                  style={{ opacity: item.stock <= 0 ? 0.5 : 1 }}
                >
                  <Title level={5} ellipsis>{item.name}</Title>
                  <Text type="secondary">{item.category}</Text>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>${item.price.toFixed(2)}</Text>
                    <Text type={item.stock < 5 ? 'danger' : 'secondary'}>Qty: {item.stock}</Text>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={10}>
        <Card title={<span><ShoppingCartOutlined /> Cart</span>} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, minHeight: '400px' }}>
            <List
              dataSource={cart}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Space>
                      <Button size="small" icon={<MinusOutlined />} onClick={() => updateQuantity(item.id, -1)} />
                      <Text>{item.quantity}</Text>
                      <Button size="small" icon={<PlusOutlined />} onClick={() => updateQuantity(item.id, 1)} />
                      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)} />
                    </Space>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`}
                  />
                </List.Item>
              )}
            />
          </div>
          <Divider />
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Title level={4}>Total:</Title>
              <Title level={4} type="success">${total.toFixed(2)}</Title>
            </div>
            <Button type="primary" size="large" block onClick={handleCheckout} disabled={cart.length === 0}>
              Checkout
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default POS;
