// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "elvis",
    email: "elvis@example.com",
    roles: ["admin"],
    avatar: "/img/team-1.jpg" // optional profile image
  });

  const login = (credentials) => {
    // In a real app, you would verify credentials here
    setUser({
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