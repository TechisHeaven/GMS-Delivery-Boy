import { Order, OrderStatus } from "../../types";
import api from "../../utilts/api";
import Cookies from "js-cookie";

type FetchOrderProps = {
  status?: OrderStatus;
};
export const OrderService = {
  fetchOrders: async ({
    status,
  }: FetchOrderProps): Promise<{ orders: Order[] }> => {
    try {
      const token = Cookies.get("delivery-token");
      const { data } = await api.get("/api/delivery/orders", {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: {
          status,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
  fetchOrderById: async (id: string): Promise<{ order: Order }> => {
    try {
      const token = Cookies.get("delivery-token");
      const { data } = await api.get(`/api/delivery/orders/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<{ order: Order }> => {
    try {
      const token = Cookies.get("delivery-token");
      const { data } = await api.put(
        `/api/delivery/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
};
