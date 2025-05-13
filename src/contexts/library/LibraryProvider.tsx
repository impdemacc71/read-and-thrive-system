
import React, { createContext, useContext } from 'react';
import { mockResources, mockTransactions } from '@/data/mockData';
import { useResourceManagement } from './useResourceManagement';
import { useTransactionManagement } from './useTransactionManagement';
import { LibraryContextType } from './types';

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    resources,
    setResources,
    addResource,
    updateResource,
    searchResources,
    getResourceById,
    getResourcesByCategory,
    getResourcesByType,
    scanIdentifier
  } = useResourceManagement(mockResources, mockTransactions, setTransactions);

  const {
    transactions,
    setTransactions,
    borrowResource,
    returnResource,
    calculateFine,
    reserveResource,
    getUserTransactions
  } = useTransactionManagement(mockTransactions, resources, setResources);

  const value: LibraryContextType = {
    resources,
    transactions,
    addResource,
    updateResource,
    searchResources,
    getResourceById,
    getResourcesByCategory,
    getResourcesByType,
    borrowResource,
    returnResource,
    calculateFine,
    reserveResource,
    getUserTransactions,
    scanIdentifier
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
