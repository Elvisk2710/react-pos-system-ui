// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'id_user1',
    name: "elvis",
    email: "elvis@example.com",
    roles: ["admin"],
    avatar: "/img/team-1.jpg", // optional profile image
    permissions: {
      inventory: true,
      sales: true,
      reporting: true,
      userManagement: true
    }
  });

  const login = (credentials) => {
    // In a real app, you would verify credentials here
    setUser({
      id: 'id_user1',
      name: "elvis",
      email: "elvis@example.com",
      roles: ["admin"],
      avatar: "/img/team-1.jpg"
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};