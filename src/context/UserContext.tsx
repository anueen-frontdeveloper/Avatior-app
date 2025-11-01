// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!username) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const randomName = `USER_${randomNumber}_INR`;
      setUsername(randomName);
    }
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
