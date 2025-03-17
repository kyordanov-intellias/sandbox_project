import React, { createContext, useState, useEffect, useContext } from "react";

// Define User type
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user from backend
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:4001/auth/me", {
        method: "GET",
        credentials: "include", // ✅ Important to send cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:4001/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
