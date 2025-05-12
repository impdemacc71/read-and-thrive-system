
import React, { createContext, useContext, ReactNode } from 'react';
import { resources as initialResources, transactions as initialTransactions } from '@/data/mockData';
import { LibraryContextType } from './types';
import { useResourceManagement } from './useResourceManagement';
import { useTransactionManagement } from './useTransactionManagement';

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const resourceManagement = useResourceManagement(
    initialResources, 
    initialTransactions,
    () => {} // Placeholder to be updated after initialization
  );
  
  const { resources, setResources } = resourceManagement;
  
  const transactionManagement = useTransactionManagement(
    initialTransactions,
    resources,
    setResources
  );
  
  const { transactions, setTransactions } = transactionManagement;
  
  // Update the placeholder
  resourceManagement.setResources = setResources;
  
  return (
    <LibraryContext.Provider
      value={{
        resources,
        transactions,
        ...resourceManagement,
        ...transactionManagement,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
