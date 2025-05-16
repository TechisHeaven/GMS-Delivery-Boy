import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "../types";
import { loginUser, registerUser } from "../data/mockData";
import Cookies from "js-cookie";
import { AuthService } from "../components/service/auth.service";

const initialAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to verify user with token if not authenticated
    const token = Cookies.get("delivery-token");
    if (token) {
      AuthService.verifyToken(token)
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          setUser(null);
          Cookies.remove("delivery-token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    console.log(user);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await AuthService.login(email, password);
      Cookies.set("delivery-token", data.token, { expires: 7 });
      setUser(data.user);
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error?.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    vehicle?: string
  ) => {
    setLoading(true);
    try {
      const data = await AuthService.register(
        name,
        email,
        password,
        phone,
        vehicle
      );
      Cookies.set("delivery-token", data.token, { expires: 7 });
      setUser(data.user);
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error?.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("delivery-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
