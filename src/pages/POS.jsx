import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, List, Button, Typography, Space, message, Divider, Tag, Modal, Badge, Select, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCartOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  SearchOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CreditCardOutlined,
  DollarOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import './POS.css';

const { Title, Text } = Typography;
const { Option } = Select;

const POS = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  
  // New States
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  
  const products = useLiveQuery(() => 
    db.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase()) || (p.barcode && p.barcode.includes(searchText));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).toArray()
  , [searchText, selectedCategory]) || [];

  const categories = ['All', ...new Set(useLiveQuery(() => db.products.toArray())?.map(p => p.category) || [])];
  const customers = useLiveQuery(() => db.customers.toArray()) || [];

  const addToCart = (product) => {
    if (product.stock <= 0) {
      message.warning(t('out_of_stock'));
      return;
    }
    
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        message.warning(t('insufficient_stock'));
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxRate = 0.08; // 8% tax
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // Update stocks
      for (const item of cart) {
        const product = await db.products.get(item.id);
        await db.products.update(item.id, { stock: product.stock - item.quantity });
      }

      // Record sale
      const saleId = await db.sales.add({
        timestamp: new Date(),
        subtotal,
        discountAmount,
        taxAmount,
        total,
        items: cart,
        customerId: selectedCustomer,
        paymentMethod
      });

      setLastSale({ 
        id: saleId, 
        timestamp: new Date(), 
        subtotal, 
        discountAmount,
        taxAmount, 
        total, 
        items: cart,
        customer: customers.find(c => c.id === selectedCustomer),
        paymentMethod
      });
      
      message.success(t('complete_sale'));
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setIsReceiptModalVisible(true);
    } catch (error) {
      message.error('Checkout failed');
    }
  };

  return (
    <div className="pos-container">
      <Row gutter={24}>
        <Col span={15}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>{t('market_pos')}</Title>
            <Input 
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder={t('search_placeholder')} 
              onChange={e => setSearchText(e.target.value)} 
              style={{ width: 350, borderRadius: 10, height: 45 }}
              variant="filled"
            />
          </div>

          <div className="category-filter">
            {categories.map(cat => (
              <div 
                key={cat} 
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? t('all_categories') : cat}
              </div>
            ))}
          </div>

          <Row gutter={[16, 16]}>
            {products.map(item => (
              <Col span={8} key={item.id}>
                <div 
                  className="product-card" 
                  onClick={() => addToCart(item)}
                  style={{ cursor: item.stock <= 0 ? 'not-allowed' : 'pointer' }}
                >
                  <div className="product-image">
                    {item.name.charAt(0)}
                  </div>
                  <div className="product-info">
                    <span className="category-tag">{item.category}</span>
                    <span className="product-name">{item.name}</span>
                    <div className="product-footer">
                      <span className="product-price">${item.price.toFixed(2)}</span>
                      <Badge 
                        status={item.stock < 5 ? 'error' : 'success'} 
                        text={<span className="product-stock">{item.stock} {t('in_stock')}</span>}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={9}>
          <div className="cart-container">
            <div className="cart-header">
              <ShoppingCartOutlined style={{ fontSize: 24, color: '#10b981' }} />
              <Title level={4} style={{ margin: 0 }}>{t('current_order')}</Title>
              <Badge count={cart.reduce((a, b) => a + b.quantity, 0)} style={{ backgroundColor: '#10b981' }} />
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                  <ShoppingCartOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }} />
                  <p>{t('empty_cart')}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">${item.price.toFixed(2)} {t('per_unit')}</span>
                    </div>
                    <div className="cart-controls">
                      <Button size="small" shape="circle" icon={<MinusOutlined />} onClick={() => updateQuantity(item.id, -1)} />
                      <Text strong style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Text>
                      <Button size="small" shape="circle" icon={<PlusOutlined />} onClick={() => updateQuantity(item.id, 1)} />
                      <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)} />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-options">
              <div className="option-row">
                <span className="option-label"><UserOutlined /> {t('select_customer')}</span>
                <Select
                  showSearch
                  placeholder={t('walk_in_customer')}
                  style={{ width: '100%' }}
                  onChange={setSelectedCustomer}
                  value={selectedCustomer}
                  allowClear
                >
                  {customers.map(c => (
                    <Option key={c.id} value={c.id}>{c.name} ({c.phone})</Option>
                  ))}
                </Select>
              </div>

              <div className="option-row">
                <span className="option-label"><PercentageOutlined /> {t('discount')} (%)</span>
                <InputNumber
                  min={0}
                  max={100}
                  value={discount}
                  onChange={setDiscount}
                  style={{ width: '100%' }}
                  prefix={<PercentageOutlined />}
                />
              </div>

              <div className="option-row">
                <span className="option-label">{t('payment_method')}</span>
                <div className="payment-grid">
                  <div 
                    className={`payment-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Cash')}
                  >
                    <DollarOutlined /> {t('cash')}
                  </div>
                  <div 
                    className={`payment-btn ${paymentMethod === 'Card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Card')}
                  >
                    <CreditCardOutlined /> {t('card')}
                  </div>
                </div>
              </div>
            </div>

            <div className="cart-footer">
              <div className="summary-row">
                <span>{t('subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row" style={{ color: '#ef4444' }}>
                  <span>{t('discount')} ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>{t('tax')} (8%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>{t('total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button 
                type="primary" 
                size="large" 
                block 
                className="checkout-btn"
                onClick={handleCheckout} 
                disabled={cart.length === 0}
                icon={<CheckCircleOutlined />}
              >
                {t('complete_sale')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        title={t('sale_receipt')}
        open={isReceiptModalVisible}
        onOk={() => setIsReceiptModalVisible(false)}
        onCancel={() => setIsReceiptModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>{t('print_receipt')}</Button>,
          <Button key="close" type="primary" onClick={() => setIsReceiptModalVisible(false)}>{t('done')}</Button>
        ]}
      >
        {lastSale && (
          <div id="receipt-content" style={{ padding: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Title level={3}>{t('market_pos')}</Title>
              <Text type="secondary">{lastSale.timestamp.toLocaleString()}</Text>
              <br />
              <Text type="secondary">{t('order_id')}: #{lastSale.id}</Text>
              {lastSale.customer && (
                <div style={{ marginTop: 8 }}>
                  <Text strong>{t('customer')}: {lastSale.customer.name}</Text>
                </div>
              )}
            </div>
            <Divider />
            {lastSale.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text>{t('subtotal')}</Text>
              <Text>${lastSale.subtotal.toFixed(2)}</Text>
            </div>
            {lastSale.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text type="danger">{t('discount')}</Text>
                <Text type="danger">-${lastSale.discountAmount.toFixed(2)}</Text>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text>{t('tax')} (8%)</Text>
              <Text>${lastSale.taxAmount.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Title level={4}>{t('total')}</Title>
              <Title level={4}>${lastSale.total.toFixed(2)}</Title>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>{t('payment_method')}:</Text>
              <Text strong>{t(lastSale.paymentMethod.toLowerCase())}</Text>
            </div>
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <Text type="secondary">{t('thank_you')}</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default POS;
