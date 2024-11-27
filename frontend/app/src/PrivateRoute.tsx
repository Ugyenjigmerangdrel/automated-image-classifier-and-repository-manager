import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { isTokenExpired } from "./utils/authUtils";
import { useEffect } from "react";

const PrivateRoute: React.FC = () => {
  const { userToken, logout } = useAuth();

  useEffect(() => {
    if (userToken && isTokenExpired(userToken)) {
      logout();
    }
    
  }, [userToken, logout]);

  if (!userToken) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoute;
