import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the authentication context
interface AuthContextType {
  userToken: string | null;
  login: (data: LoginData) => Promise<string | void>;
  logout: () => void;
}

// Define the shape of the login data
interface LoginData {
  email: string;
  password: string;
}

// Define the API route from environment variables
const API_ROUTE = import.meta.env.VITE_API as string;

// Create the AuthContext with an undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider's props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem("token"));

  const login = async (data: LoginData): Promise<string | void> => {
    const response = await fetch(`${API_ROUTE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 400) {
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

  const logout = (): void => {
    localStorage.removeItem("token");
    setUserToken(localStorage.getItem("token"));
  };

  const ctxValue: AuthContextType = {
    userToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
