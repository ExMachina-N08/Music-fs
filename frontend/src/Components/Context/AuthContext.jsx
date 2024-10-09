import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null); // State to store user role
  const navigate = useNavigate();

  // Use data from localStorage when the component mounts
  useEffect(() => {
    const saveUser = localStorage.getItem("userData");
    const saveToken = localStorage.getItem("authToken");
    const saveRefreshToken = localStorage.getItem("authRefreshToken");
    const saveRole = localStorage.getItem("userRole");

    if (saveUser && saveToken && saveRefreshToken && saveRole) {
      setUser(JSON.parse(saveUser));
      setToken(saveToken);
      setRefreshToken(saveRefreshToken);
      setRole(saveRole); // Set role from localStorage
    }
  }, []);

  // Function to fetch user role from backend
  const fetchUserRole = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/user/${userId}/profile?showDetail=true`
      );
      const userRole = response.data.role;

      setRole(userRole); // Set role state
      localStorage.setItem("userRole", userRole); // Save role to localStorage
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // Login function to save user data, auth token, and refresh token
  const login = async (userData, authToken, authRefreshToken) => {
    setUser(userData);
    setToken(authToken);
    setRefreshToken(authRefreshToken);

    // Save user and token in localStorage for persistence
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("authRefreshToken", authRefreshToken);

    // Fetch and store the user role
    await fetchUserRole(userData._id);

    // Navigate to the home page after login
    navigate("/");
  };

  // Logout function to clear user data and tokens
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setRole(null); // Clear role state

    // Remove user and token from localStorage
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRefreshToken");
    localStorage.removeItem("userRole"); // Remove role from localStorage

    // Navigate to login page
    navigate("/auth/login");
  };

  // Check if the user is authenticated
  const isAuthenticated = !!user && !!token;

  // Provide context values
  const value = {
    user,
    token,
    refreshToken,
    role,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
