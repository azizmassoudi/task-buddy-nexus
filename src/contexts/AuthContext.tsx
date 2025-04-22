
import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export type UserRole = "admin" | "subcontractor" | "client" | null;

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
}

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=6b46c1&color=fff"
  },
  {
    id: "2",
    name: "John Contractor",
    email: "contractor@example.com",
    role: "subcontractor",
    avatar: "https://ui-avatars.com/api/?name=John+Contractor&background=9b87f5&color=fff"
  },
  {
    id: "3",
    name: "Alice Client",
    email: "client@example.com",
    role: "client",
    avatar: "https://ui-avatars.com/api/?name=Alice+Client&background=b794f4&color=fff"
  }
];

// Create the auth context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Create the auth provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(null);

  // Check if there's a stored user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setCurrentRole(parsedUser.role);
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string, role: UserRole) => {
    // Find the user with the matching email and role
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.role === role
    );

    if (!foundUser) {
      throw new Error("Invalid credentials or user not found");
    }

    // Set the user state
    setUser(foundUser);
    setCurrentRole(foundUser.role);

    // Store the user in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(foundUser));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setCurrentRole(null);
    localStorage.removeItem("user");
  };

  // Function to switch between roles (useful for testing)
  const switchRole = (role: UserRole) => {
    if (!user) return;

    // Find a user with the selected role
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      setCurrentRole(userWithRole.role);
      localStorage.setItem("user", JSON.stringify(userWithRole));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        login,
        logout,
        currentRole,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);
