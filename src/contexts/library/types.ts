
import { Resource, Transaction } from '@/data/mockData';

export interface LibraryContextType {
  resources: Resource[];
  transactions: Transaction[];
  borrowResource: (userId: string, resourceId: string, dueDate?: string) => void;
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
