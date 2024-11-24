import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { isTokenExpired } from "./utils/authUtils";
import { useEffect } from "react";

export default function PrivateRoute() {
  const { userToken, logout } = useAuth();
  useEffect(() => {
    if (isTokenExpired(userToken)) {
      logout();
    }
  }, [userToken]);

  if (!userToken) return <Navigate to="/" />;
  return <Outlet />;
}
