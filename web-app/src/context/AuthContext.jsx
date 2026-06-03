import React, { createContext, useState, useEffect } from 'react';
import { getMyProfile } from '../service/UserService';
import { logout as apiLogout } from '../service/AuthenticationService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await getMyProfile();
          setUser(profile);
          const userRole = profile.role || "USER";
          localStorage.setItem("role", userRole);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch(err) {
      console.error(err);
    }
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
