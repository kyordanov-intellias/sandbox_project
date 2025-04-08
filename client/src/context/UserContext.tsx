import React, { createContext, useState, useEffect, useContext } from "react";
import { getUser, logoutUser, getUserById } from "../services/userServices";
import { User } from "../interfaces/userInterfaces";

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

  const fetchUser = async () => {
    try {
      const authResponse = await getUser();
      if (authResponse.ok) {
        const authData = await authResponse.json();

        const profileResponse = await getUserById(authData.id);
        const profileData = await profileResponse.json();

        setUser({
          ...authData,
          profile: profileData,
        });
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
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  //TODO useCallback

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
