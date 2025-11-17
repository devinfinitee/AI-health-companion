import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

// API base URL - uses environment variable or defaults to localhost:5001
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  // Check for existing session on mount
  // Retrieves user data and token from localStorage if they exist
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * LOGIN FUNCTION
   * Sends login request to backend API
   * Stores user data and JWT token in localStorage on success
   */
  const login = async (email: string, password: string) => {
    try {
      // Send POST request to login endpoint
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parse response data
      const data = await response.json();

      // If login failed, throw error with message from server
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Create user object from response data
      const userData: User = {
        id: data.data.user.id,
        email: data.data.user.email,
        fullName: data.data.user.name,
      };

      // Store user data and token in state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.data.token);
    } catch (error) {
      // Re-throw error to be handled by the component
      throw error;
    }
  };

  /**
   * SIGNUP FUNCTION
   * Sends registration request to backend API
   * Stores user data and JWT token in localStorage on success
   */
  const signup = async (fullName: string, email: string, password: string) => {
    try {
      // Send POST request to signup endpoint
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: fullName, 
          email, 
          password 
        }),
      });

      // Parse response data
      const data = await response.json();

      // If signup failed, throw error with message from server
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Signup failed");
      }

      // Create user object from response data
      const userData: User = {
        id: data.data.user.id,
        email: data.data.user.email,
        fullName: data.data.user.name,
      };

      // Store user data and token in state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.data.token);
    } catch (error) {
      // Re-throw error to be handled by the component
      throw error;
    }
  };

  /**
   * LOGOUT FUNCTION
   * Clears user data and token from state and localStorage
   * Redirects to landing page
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLocation("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
