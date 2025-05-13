
import React, { createContext, useContext, useState } from 'react';
import { resources, transactions } from '@/data/mockData';
import { useResourceManagement } from './useResourceManagement';
import { useTransactionManagement } from './useTransactionManagement';
import { LibraryContextType } from './types';

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateTransactions, setTransactions] = useState(transactions);
  const [stateResources, setResources] = useState(resources);

  const {
    resources: managedResources,
    addResource,
    updateResource,
    searchResources,
    getResourceById,
    getResourcesByCategory,
    getResourcesByType,
    scanIdentifier
  } = useResourceManagement(stateResources, stateTransactions, setTransactions);

  const {
    transactions: managedTransactions,
    borrowResource,
    returnResource,
    calculateFine,
    reserveResource,
    getUserTransactions
  } = useTransactionManagement(stateTransactions, managedResources, setResources);

  const value: LibraryContextType = {
    resources: managedResources,
    transactions: managedTransactions,
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
