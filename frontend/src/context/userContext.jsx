/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, createContext } from "react";
import fetchWithAuth from "../pages/auth-pages/fetchWithAuth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // NEU
  const [users, setUsers] = useState([]); // NEU: Zustand für alle Benutzer

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // WICHTIG: Sendet Cookies zum Backend
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error(" Invalid data format");
          setUsers([]);
        }
      } catch (error) {
        console.error("[ERROR] Fetch failed:", error);
        setUsers([]);
      }
    };
    if (isAuthenticated) {
      console.log("Fetching all users because user is authenticated");
      getAllUsers();
    }
  }, [isAuthenticated]); // Abhängigkeit hinzufügen, damit es nur bei Authentifizierung ausgeführt wird

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:3000/api/user/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log("Auth check response:", data);

        if (res.ok && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Define loggedIn and logout functions
  const loggedIn = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // WICHTIG: Sendet Cookies zum Backend
      });
      setUser(null); // User-State zurücksetzen
      setIsAuthenticated(false); // Authentifizierungsstatus zurücksetzen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loggedIn,
        logout,
        isLoading,
        users,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
