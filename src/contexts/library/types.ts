
import { Resource, Transaction } from "@/data/mockData";

export interface LibraryContextType {
  resources: Resource[];
  transactions: Transaction[];
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, resource: Partial<Resource>) => boolean;
  searchResources: (query: string) => Resource[];
  getResourceById: (id: string) => Resource | undefined;
  getResourcesByCategory: (category: string) => Resource[];
  getResourcesByType: (type: string) => Resource[];
  borrowResource: (userId: string, resourceId: string, selectedDueDate?: string) => void;
  returnResource: (transactionId: string) => void;
  calculateFine: (transaction: Transaction) => number;
  reserveResource: (userId: string, resourceId: string) => void;
  getUserTransactions: (userId: string) => Transaction[];
  scanIdentifier: (identifier: string) => Resource | undefined;
}
