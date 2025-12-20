import React, { createContext, useContext } from 'react';

// Mock Auth Context for the Preview
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  // Default mock values
  const mockUser = { name: "Guest User", email: "guest@example.com" };
  
  return (
    <AuthContext.Provider value={{ user: mockUser, isAdmin: false }}>
      {children}
    </AuthContext.Provider>
  );
}