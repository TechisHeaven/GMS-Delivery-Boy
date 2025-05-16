import React from 'react';
import Layout from '../components/layout/Layout';
import OrderList from '../components/orders/OrderList';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <OrderList />
    </Layout>
  );
};

export default DashboardPage;