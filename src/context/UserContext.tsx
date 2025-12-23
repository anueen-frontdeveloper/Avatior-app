import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the Shape of the Data
interface UserData {
  name: string;
  id: string;
  balance: string;
  dob: string;
  country: string;
  phone: string;
  email: string;
  currency: string;
}

// 2. Define the Shape of the Context (Data + Functions)
interface UserContextType {
  userData: UserData;
  updateUser: (field: keyof UserData, value: string) => void;
  addToBalance: (amount: number) => void;
}

// 3. Create the Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. Create the Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initial Mock Data
  const [userData, setUserData] = useState<UserData>({
    name: 'Name click me',
    id: '50661927',
    balance: '0.00',
    dob: '01/01/1990',
    country: 'India',
    phone: '+91 1231231232',
    email: 'Test@gmail.com',
    currency: '₹'
  });

  // Function to update a single field
  const updateUser = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // Function to add money (e.g. from Referral Code)
  const addToBalance = (amount: number) => {
    setUserData(prev => {
      const currentBalance = parseFloat(prev.balance);
      const newBalance = (currentBalance + amount).toFixed(2);
      return { ...prev, balance: newBalance };
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, addToBalance }}>
      {children}
    </UserContext.Provider>
  );
};

// 5. Create a Custom Hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};