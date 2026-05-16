import React from 'react';
import { Form, Input, Button, Typography, Space, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { UserOutlined, GlobalOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './Login.css';
import illustration from '../assets/login-illustration.png';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const { t, i18n } = useTranslation();

  const onFinish = (values) => {
    console.log('Success:', values);
    onLogin(); // Simplified for demo
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="login-page">
      <div className="lang-switch-login">
        <Select
          defaultValue={i18n.language}
          style={{ width: 120 }}
          onChange={changeLanguage}
          suffixIcon={<GlobalOutlined />}
          variant="borderless"
        >
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="uz">O'zbekcha</Select.Option>
        </Select>
      </div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="login-illustration">
          <motion.img 
            src={illustration} 
            alt="POS Illustration" 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          />
        </div>

        <div className="login-form-container">
          <div className="login-header">
            <motion.div 
              className="login-logo"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ShoppingCartOutlined /> {t('market_pos')}
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{t('welcome_back')}</Title>
              <Text className="login-subtitle">{t('login_subtitle')}</Text>
            </motion.div>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Form.Item
                name="username"
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
                  placeholder={t('username')} 
                  className="login-input"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button type="primary" htmlType="submit" block className="login-btn">
                {t('login')}
              </Button>
            </motion.div>
          </Form>

          <motion.div 
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {t('login_footer')}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
