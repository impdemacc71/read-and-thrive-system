import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Resource, Transaction, ResourceType } from '@/data/mockData';

export function useTransactionManagement(
  initialTransactions: Transaction[],
  resources: Resource[],
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>
) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { toast } = useToast();

  const borrowResource = (userId: string, resourceId: string, selectedDueDate?: string) => {
    // Check if resource is available
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
      toast({
        title: "Error",
        description: "Resource not found.",
        variant: "destructive",
      });
      return;
    }
    
    // For physical resources, check quantity
    if (resource.type === 'book' || resource.type === 'journal') {
      // Physical resources should have quantity property
      if (!resource.digital && resource.quantity !== undefined && resource.quantity <= 0) {
        toast({
          title: "Error",
          description: "This physical resource is out of stock.",
          variant: "destructive",
        });
        return;
      }
    }

    // Create a new transaction
    const checkoutDate = new Date().toISOString().split('T')[0];
    
    // Set due date (default to 10 days if not provided)
    const dueDate = selectedDueDate ? new Date(selectedDueDate) : new Date();
    if (!selectedDueDate) {
      dueDate.setDate(dueDate.getDate() + 10); // Default to 10 days
    }
    
    const newTransaction: Transaction = {
      id: `${transactions.length + 1}`,
      userId,
      resourceId,
      checkoutDate,
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'borrowed',
    };

    // Update resource availability for physical resources
    setResources(prevResources =>
      prevResources.map(r => {
        if (r.id === resourceId) {
          // For physical resources, decrement quantity
          if ((r.type === 'book' || r.type === 'journal') && !r.digital) {
            const newQuantity = ((r.quantity !== undefined ? r.quantity : 1) - 1);
            // Resource is still available if there are copies left
            const available = newQuantity > 0;
            return { ...r, quantity: newQuantity, available };
          }
          // For e-resources, keep available as true since multiple people can access
          if (r.digital) {
            return r;
          }
          // Default behavior for other types
          return { ...r, available: false };
        }
        return r;
      })
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

    // Get the resource
    const resource = resources.find(r => r.id === transaction.resourceId);
    if (!resource) {
      toast({
        title: "Error",
        description: "Resource not found.",
        variant: "destructive",
      });
      return;
    }

    // Make the resource available again
    setResources(prevResources =>
      prevResources.map(r => {
        if (r.id === transaction.resourceId) {
          // For physical resources, increment quantity
          if ((r.type === 'book' || r.type === 'journal') && !r.digital) {
            const newQuantity = ((r.quantity !== undefined ? r.quantity : 0) + 1);
            return { ...r, quantity: newQuantity, available: true };
          }
          // For other resources, just make available
          return { ...r, available: true };
        }
        return r;
      })
    );
    
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

  const reserveResource = (userId: string, resourceId: string, fromDate?: string, toDate?: string) => {
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

    // Default dates if not provided
    const reservationFromDate = fromDate || new Date().toISOString().split('T')[0];
    const reservationToDate = toDate || (() => {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 10); // Default to 10 days
      return defaultDueDate.toISOString().split('T')[0];
    })();

    // Check if there's a conflict with existing transactions during the requested period
    const conflictingTransaction = transactions.find(t => 
      t.resourceId === resourceId && 
      t.status === 'borrowed' &&
      !t.returnDate &&
      // Check if the requested period overlaps with an existing transaction
      ((new Date(t.checkoutDate) <= new Date(reservationToDate) && new Date(t.dueDate) >= new Date(reservationFromDate)))
    );

    if (conflictingTransaction) {
      // If there's a conflict, we can still allow reservation but inform the user
      toast({
        title: "Resource Partially Available",
        description: `This resource is borrowed until ${conflictingTransaction.dueDate}. Your reservation will be queued.`,
        variant: "warning",
      });
    }

    // Create a reservation transaction
    const newTransaction: Transaction = {
      id: `${transactions.length + 1}`,
      userId,
      resourceId,
      checkoutDate: reservationFromDate,
      dueDate: reservationToDate,
      returnDate: null,
      status: 'reserved',
    };

    // Add transaction
    setTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Resource Reserved",
      description: `You have successfully reserved "${resource.title}" from ${new Date(reservationFromDate).toLocaleDateString()} to ${new Date(reservationToDate).toLocaleDateString()}.`,
    });
  };

  const getUserTransactions = (userId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.userId === userId);
  };

  return {
    transactions,
    setTransactions,
    borrowResource,
    returnResource,
    calculateFine,
    reserveResource,
    getUserTransactions
  };
}
