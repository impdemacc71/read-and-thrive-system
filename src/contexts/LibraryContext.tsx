
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { resources as initialResources, transactions as initialTransactions, Resource, Transaction } from '../data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface LibraryContextType {
  resources: Resource[];
  transactions: Transaction[];
  borrowResource: (userId: string, resourceId: string) => void;
  returnResource: (transactionId: string) => void;
  addResource: (resource: Omit<Resource, 'id'>) => void;
  searchResources: (query: string) => Resource[];
  getResourceById: (id: string) => Resource | undefined;
  getUserTransactions: (userId: string) => Transaction[];
  getResourcesByCategory: (category: string) => Resource[];
  getResourcesByType: (type: string) => Resource[];
  scanIdentifier: (identifier: string) => Resource | undefined;
  reserveResource: (userId: string, resourceId: string) => void;
  calculateFine: (transaction: Transaction) => number;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { toast } = useToast();

  const borrowResource = (userId: string, resourceId: string) => {
    // Check if resource is available
    const resource = resources.find(r => r.id === resourceId);
    if (!resource || !resource.available) {
      toast({
        title: "Error",
        description: "This resource is not available for checkout.",
        variant: "destructive",
      });
      return;
    }

    // Create a new transaction
    const checkoutDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now
    
    const newTransaction: Transaction = {
      id: `${transactions.length + 1}`,
      userId,
      resourceId,
      checkoutDate,
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'borrowed',
    };

    // Update resource availability
    setResources(prevResources =>
      prevResources.map(r =>
        r.id === resourceId ? { ...r, available: false } : r
      )
    );

    // Add transaction
    setTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Resource Borrowed",
      description: `You have successfully borrowed "${resource.title}". Due date: ${dueDate.toLocaleDateString()}`,
    });
  };

  const returnResource = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      toast({
        title: "Error",
        description: "Transaction not found.",
        variant: "destructive",
      });
      return;
    }

    // Calculate fine if overdue
    const fine = calculateFine(transaction);
    const returnDate = new Date().toISOString().split('T')[0];

    // Update transaction status
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId
          ? { ...t, returnDate, status: 'returned' }
          : t
      )
    );

    // Make the resource available again
    setResources(prevResources =>
      prevResources.map(r =>
        r.id === transaction.resourceId ? { ...r, available: true } : r
      )
    );

    const resource = resources.find(r => r.id === transaction.resourceId);
    
    if (fine > 0) {
      toast({
        title: "Resource Returned with Fine",
        description: `You have returned "${resource?.title}". A fine of $${fine.toFixed(2)} has been applied for late return.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Resource Returned",
        description: `You have successfully returned "${resource?.title}".`,
      });
    }
  };

  const calculateFine = (transaction: Transaction): number => {
    if (transaction.status !== 'borrowed' || transaction.returnDate) return 0;
    
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    
    if (today <= dueDate) return 0;
    
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
    return daysOverdue * 1; // $1 per day
  };

  const reserveResource = (userId: string, resourceId: string) => {
    // Check if resource exists
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
      toast({
        title: "Error",
        description: "This resource does not exist.",
        variant: "destructive",
      });
      return;
    }

    // Check if there's an active transaction for this resource
    const activeTransaction = transactions.find(
      t => t.resourceId === resourceId && t.status === 'borrowed' && !t.returnDate
    );

    if (!activeTransaction) {
      toast({
        title: "Error",
        description: "This resource is not currently borrowed. You can borrow it directly.",
        variant: "destructive",
      });
      return;
    }

    // Create a reservation transaction
    const reservationDate = new Date().toISOString().split('T')[0];
    
    const newTransaction: Transaction = {
      id: `${transactions.length + 1}`,
      userId,
      resourceId,
      checkoutDate: activeTransaction.dueDate, // Will be available after due date
      dueDate: '', // Will be set when actually borrowed
      returnDate: null,
      status: 'reserved',
    };

    // Add transaction
    setTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Resource Reserved",
      description: `You have successfully reserved "${resource.title}". You will be notified when it becomes available.`,
    });
  };

  const addResource = (resourceData: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: `${resources.length + 1}`,
    };

    setResources(prev => [...prev, newResource]);

    toast({
      title: "Resource Added",
      description: `"${resourceData.title}" has been added to the library catalog.`,
    });
  };

  const searchResources = (query: string): Resource[] => {
    if (!query.trim()) return resources;
    
    const lowerCaseQuery = query.toLowerCase();
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(lowerCaseQuery) ||
      resource.author.toLowerCase().includes(lowerCaseQuery) ||
      (resource.isbn && resource.isbn.includes(lowerCaseQuery)) ||
      (resource.issn && resource.issn.includes(lowerCaseQuery)) ||
      (resource.doi && resource.doi.includes(lowerCaseQuery)) ||
      (resource.barcode && resource.barcode.includes(lowerCaseQuery)) ||
      resource.publisher.toLowerCase().includes(lowerCaseQuery) ||
      resource.category.toLowerCase().includes(lowerCaseQuery) ||
      resource.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const getResourceById = (id: string): Resource | undefined => {
    return resources.find(resource => resource.id === id);
  };

  const getUserTransactions = (userId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.userId === userId);
  };

  const getResourcesByCategory = (category: string): Resource[] => {
    if (category === 'All') return resources;
    return resources.filter(resource => resource.category === category);
  };

  const getResourcesByType = (type: string): Resource[] => {
    if (type === 'All') return resources;
    return resources.filter(resource => resource.type === type);
  };

  const scanIdentifier = (identifier: string): Resource | undefined => {
    // Check different identifiers (ISBN, ISSN, DOI, barcode)
    return resources.find(
      resource =>
        resource.isbn === identifier ||
        resource.issn === identifier ||
        resource.doi === identifier ||
        resource.barcode === identifier
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        resources,
        transactions,
        borrowResource,
        returnResource,
        addResource,
        searchResources,
        getResourceById,
        getUserTransactions,
        getResourcesByCategory,
        getResourcesByType,
        scanIdentifier,
        reserveResource,
        calculateFine,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
