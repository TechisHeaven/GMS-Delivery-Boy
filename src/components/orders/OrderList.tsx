import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { Order, OrderStatus } from "../../types";
import OrderCard from "./OrderCard";
import Button from "../ui/Button";
import { fetchOrders } from "../../data/mockData";
import { OrderService } from "../service/order.service";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        let data;
        if (filter === "out_for_delivery" || filter === "delivered") {
          // Fetch only current user's orders for these statuses
          data = await OrderService.fetchOrders({
            status: filter,
          });
        } else if (filter === "all") {
          data = await OrderService.fetchOrders({});
        } else {
          data = await OrderService.fetchOrders({ status: filter });
        }
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [filter]);

  const handleOrderClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const filterButtons: { label: string; value: OrderStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Ready", value: "ready_for_pickup" },
    { label: "Picked Up", value: "out_for_delivery" },
    { label: "Delivered", value: "delivered" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage your delivery orders</p>
      </div>

      <div className="mb-6 flex items-center overflow-x-auto py-2">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            className={`px-4 py-2 mr-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === btn.value
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-500">
            {filter === "all"
              ? "There are no orders in the system."
              : `There are no orders with ${filter} status.`}
          </p>
        </div>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => handleOrderClick(order._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
