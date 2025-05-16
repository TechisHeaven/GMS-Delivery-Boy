import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import OrderDetails from "../components/orders/OrderDetails";
import { Order } from "../types";
import { fetchOrders } from "../data/mockData";
import { OrderService } from "../components/service/order.service";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await OrderService.fetchOrderById(id!);
        if (!result) {
          setError("Order not found");
          return;
        }
        setOrder(result.order);
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id]);

  const handleStatusUpdate = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-800 font-medium hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <OrderDetails order={order} onStatusUpdate={handleStatusUpdate} />
    </Layout>
  );
};

export default OrderDetailsPage;
