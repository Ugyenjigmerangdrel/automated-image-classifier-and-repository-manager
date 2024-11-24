import { createContext, useReducer, useContext, useState } from "react";

const API_ROUTE = import.meta.env.VITE_API;
const AuthContext = createContext();

export const Authprovider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));

  const login = async (data) => {
    const response = await fetch(API_ROUTE + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status == 400) {
      const error = await response.json();
      return error.msg;
    }

    if (!response.ok) {
      const error = await response.json();
      return error.msg;
    }

    const resData = await response.json();

    const token = resData.token;
    localStorage.setItem("token", token);
    setUserToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserToken(localStorage.getItem("token"));
  };

  const ctxValue = {
    userToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
