import { User } from "../../types";
import api from "../../utilts/api";

export const AuthService = {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> => {
    try {
      const { data } = await api.post("/api/delivery/auth/login", {
        email,
        password,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token: string): Promise<{ user: User }> => {
    try {
      const { data } = await api.get("/api/delivery/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
    phone: string,
    vehicle?: string
  ): Promise<{ token: string; user: User }> => {
    try {
      const { data } = await api.post("/api/delivery/auth/register", {
        fullName,
        email,
        password,
        phone,
        vehicle,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};
