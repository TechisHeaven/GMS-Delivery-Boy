import React from "react";
import { Package, MapPin, Clock } from "lucide-react";
import { Order } from "../../types";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  // Helper to extract ISO date string from MongoDB date object
  const getDateString = (dateObj: any) => {
    if (typeof dateObj === "string") return dateObj;
    if (dateObj && dateObj.$date) return dateObj.$date;
    return "";
  };
  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(getDateString(dateString));
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Calculate a simple ETA if available
  const getETA = () => {
    if (!order.estimatedDeliveryTime) return "Not estimated";
    return formatDate(order.estimatedDeliveryTime);
  };

  // Format address for display
  const formatAddress = (shippingAddress: string) => {
    return shippingAddress;
  };

  // Format total price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <Card interactive onClick={onClick} className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {order.orderNumber || `Order #${order._id}`}
            </h3>
            <p className="text-gray-500 text-sm">{order.customer.name}</p>
          </div>
          <Badge status={order.status} />
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-2 text-blue-800" />
            <span>
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-800" />
            <span className="truncate">
              {formatAddress(order.customer?.shippingAddress)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-blue-800" />
            <span>ETA: {getETA()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
          <div className="text-xs text-gray-500">
            Created at {formatDate(order.createdAt)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
