import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  Phone,
  Clock,
  ExternalLink,
  ArrowLeft,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Order } from "../../types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { updateOrderStatus } from "../../data/mockData";
import { OrderService } from "../service/order.service";
import toast from "react-hot-toast";

interface OrderDetailsProps {
  order: Order;
  onStatusUpdate: (updatedOrder: Order) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    setLoading(true);
    try {
      const updatedOrder = await OrderService.updateOrderStatus(
        order._id,
        newStatus
      );
      onStatusUpdate(updatedOrder.order);
      let message = "Order updated successfully!";
      if (newStatus === "out_for_delivery") {
        message = "Order picked up! Start delivering.";
      } else if (newStatus === "delivered") {
        message = "Order delivered successfully!";
      } else if (newStatus === "cancelled") {
        message = "Order delivery cancelled.";
      }
      toast.success(message);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const openMap = () => {
    const orderAddress = order.customer.shippingAddress;
    // Fall back to address
    const formattedAddress = encodeURIComponent(`${orderAddress}`);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${formattedAddress}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-xl font-bold text-gray-900">
            Order Number #{order?.orderNumber}
          </h2>
          <div className="ml-auto">
            <Badge status={order?.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order?.customer?.name}</p>
                <div className="flex items-center mt-2 text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {!order.customer.phone ? (
                    <p>Sorry you can't contact to user 😧</p>
                  ) : (
                    <a
                      href={`tel:${order?.customer?.phone}`}
                      className="text-blue-800 hover:underline"
                    >
                      {order?.customer.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{order?.customer?.shippingAddress}</p>
                {/* <p>
                  {order?.address?.city}, {order?.address?.state}{" "}
                  {order?.address?.zipCode}
                </p> */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={openMap}
                  className="mt-3"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Open Directions
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Created: {formatDate(order.createdAt)}</span>
                </div>

                {order.estimatedDeliveryTime && (
                  <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      Estimated Delivery:{" "}
                      {formatDate(order.estimatedDeliveryTime)}
                    </span>
                  </div>
                )}

                {order.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm mt-1">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex justify-between p-4"
                    >
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-3 text-blue-800" />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <img
                        width={30}
                        height={30}
                        className="aspect-square w-8 h-8 object-cover rounded-full"
                        src={item.product.images[0]}
                        alt={item.product.name}
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Delivery Actions</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {order.status === "ready_for_pickup" && (
                  <Button
                    variant="primary"
                    fullWidth
                    isLoading={loading}
                    onClick={() => handleStatusUpdate("out_for_delivery")}
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Pick Up Order
                  </Button>
                )}

                {order.status === "out_for_delivery" && (
                  <div className="space-y-3">
                    <Button
                      variant="success"
                      fullWidth
                      isLoading={loading}
                      onClick={() => handleStatusUpdate("delivered")}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Delivered
                    </Button>

                    <Button
                      variant="danger"
                      fullWidth
                      isLoading={loading}
                      onClick={() => handleStatusUpdate("cancelled")}
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Cancel Delivery
                    </Button>
                  </div>
                )}

                {(order.status === "delivered" ||
                  order.status === "cancelled") && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      This order is already {order.status}.
                    </p>
                  </div>
                )}

                {order.status === "pending" ||
                  (order.status === "being_packed" && (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500">
                        This order is not ready for pickup yet.
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
