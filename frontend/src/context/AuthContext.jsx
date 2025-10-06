import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; 
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded token in AuthContext:", decoded);

        // Optional: token expiry check
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("⚠️ Token expired");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("❌ Invalid token in AuthContext:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (userData) => {
    console.log("✅ Setting user from login:", userData);
    setUser(userData);
  };

  const logout = () => {
    console.log("👋 Logging out");
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateUser = async (updatedFields) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch("http://localhost:8080/api/auth/user", updatedFields, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data.user);
  } catch (error) {
    console.error("Update user failed:", error.response?.data || error.message);
    throw error;  
  } // <-- missing closing brace added here
};

const updatePassword = async ({ currentPassword, newPassword }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      "http://localhost:8080/api/auth/password",
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update password failed:", error.response?.data || error.message);
    throw error;
  }
};

const deleteUser = async ({ password }) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete("http://localhost:8080/api/auth/user", {
      data: { password },
      headers: { Authorization: `Bearer ${token}` },
    });
    logout();
  } catch (error) {
    console.error("Delete user failed:", error.response?.data || error.message);
    throw error;
  }
};


  return (
    <AuthContext.Provider value={{ user, login, logout , updateUser , deleteUser , updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
