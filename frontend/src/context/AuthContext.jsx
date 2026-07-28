import {
  createContext,
  useContext,
  useState,
} from "react";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const getUserFromToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    if (
      decoded.exp &&
      decoded.exp * 1000 < Date.now()
    ) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");

  const initialUser = getUserFromToken(storedToken);

  const [token, setToken] = useState(
    initialUser ? storedToken : null
  );

  const [user, setUser] = useState(initialUser);

  const login = (newToken) => {
    const decodedUser = getUserFromToken(newToken);

    if (!decodedUser) {
      return null;
    }

    localStorage.setItem("token", newToken);

    setToken(newToken);
    setUser(decodedUser);

    return decodedUser;
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};