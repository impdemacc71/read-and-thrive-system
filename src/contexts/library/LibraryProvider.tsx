
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { LibraryContextType } from './types';

// Convert Supabase database types to our app types
type SupabaseResource = {
  id: string;
  title: string;
  author: string;
  type: string;
  isbn: string | null;
  issn: string | null;
  doi: string | null;
  barcode: string | null;
  qr_id: string | null;
  publisher: string | null;
  published_date: string | null;
  category: string | null;
  cover: string | null;
  description: string | null;
  available: boolean | null;
  location: string | null;
  is_digital: boolean | null;
  url: string | null;
  file_format: string | null;
  language: string | null;
  edition: string | null;
  pages: number | null;
  keywords: string[] | null;
  quantity: number | null;
};

type SupabaseTransaction = {
  id: string;
  user_id: string;
  resource_id: string;
  checkout_date: string | null;
  due_date: string | null;
  return_date: string | null;
  status: string;
};

// Convert functions
const convertSupabaseResource = (resource: SupabaseResource): any => ({
  id: resource.id,
  title: resource.title,
  author: resource.author,
  type: resource.type,
  isbn: resource.isbn || '',
  issn: resource.issn || '',
  doi: resource.doi || '',
  barcode: resource.barcode || '',
  qrId: resource.qr_id || '',
  publisher: resource.publisher || '',
  publishedDate: resource.published_date || '',
  category: resource.category || '',
  cover: resource.cover || '/placeholder.svg',
  description: resource.description || '',
  available: resource.available ?? true,
  location: resource.location || '',
  digital: resource.is_digital ?? false,
  url: resource.url || '',
  fileFormat: resource.file_format || '',
  language: resource.language || '',
  edition: resource.edition || '',
  pages: resource.pages || 0,
  keywords: resource.keywords || [],
  quantity: resource.quantity || 1,
});

const convertSupabaseTransaction = (transaction: SupabaseTransaction): any => ({
  id: transaction.id,
  userId: transaction.user_id,
  resourceId: transaction.resource_id,
  checkoutDate: transaction.checkout_date?.split('T')[0] || '',
  dueDate: transaction.due_date?.split('T')[0] || '',
  returnDate: transaction.return_date?.split('T')[0] || null,
  status: transaction.status,
});

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  const [resources, setResources] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch resources from Supabase
  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('title');

      if (error) throw error;

      const convertedResources = data.map(convertSupabaseResource);
      setResources(convertedResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources from database.",
        variant: "destructive",
      });
    }
  };

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('checkout_date', { ascending: false });

      if (error) throw error;

      const convertedTransactions = data.map(convertSupabaseTransaction);
      setTransactions(convertedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions from database.",
        variant: "destructive",
      });
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchResources(), fetchTransactions()]);
      setLoading(false);
    };

    initializeData();
  }, []);

  // Add resource
  const addResource = async (resourceData: any) => {
    try {
      const supabaseResource = {
        title: resourceData.title,
        author: resourceData.author,
        type: resourceData.type,
        isbn: resourceData.isbn || null,
        issn: resourceData.issn || null,
        doi: resourceData.doi || null,
        barcode: resourceData.barcode || null,
        qr_id: resourceData.qrId || null,
        publisher: resourceData.publisher || null,
        published_date: resourceData.publishedDate || null,
        category: resourceData.category || null,
        cover: resourceData.cover || null,
        description: resourceData.description || null,
        available: resourceData.available ?? true,
        location: resourceData.location || null,
        is_digital: resourceData.digital ?? false,
        url: resourceData.url || null,
        file_format: resourceData.fileFormat || null,
        language: resourceData.language || null,
        edition: resourceData.edition || null,
        pages: resourceData.pages || null,
        keywords: resourceData.keywords || null,
        quantity: resourceData.quantity || 1,
      };

      const { data, error } = await supabase
        .from('resources')
        .insert([supabaseResource])
        .select()
        .single();

      if (error) throw error;

      const convertedResource = convertSupabaseResource(data);
      setResources(prev => [...prev, convertedResource]);

      toast({
        title: "Resource Added",
        description: `"${resourceData.title}" has been added to the library catalog.`,
      });
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource to database.",
        variant: "destructive",
      });
    }
  };

  // Update resource
  const updateResource = async (id: string, resourceData: Partial<any>) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({
          title: resourceData.title,
          author: resourceData.author,
          type: resourceData.type,
          isbn: resourceData.isbn || null,
          description: resourceData.description || null,
          // Add other fields as needed
        })
        .eq('id', id);

      if (error) throw error;

      setResources(prev =>
        prev.map(resource =>
          resource.id === id ? { ...resource, ...resourceData } : resource
        )
      );

      toast({
        title: "Resource Updated",
        description: `Resource has been updated successfully.`,
      });

      return true;
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Search resources
  const searchResources = (query: string) => {
    if (!query.trim()) return resources;
    
    const lowerCaseQuery = query.toLowerCase();
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(lowerCaseQuery) ||
      resource.author.toLowerCase().includes(lowerCaseQuery) ||
      (resource.isbn && resource.isbn.includes(lowerCaseQuery)) ||
      (resource.category && resource.category.toLowerCase().includes(lowerCaseQuery))
    );
  };

  // Get resource by ID
  const getResourceById = (id: string) => {
    return resources.find(resource => resource.id === id);
  };

  // Get resources by category
  const getResourcesByCategory = (category: string) => {
    if (category === 'All') return resources;
    return resources.filter(resource => resource.category === category);
  };

  // Get resources by type
  const getResourcesByType = (type: string) => {
    if (type === 'All') return resources;
    return resources.filter(resource => resource.type === type);
  };

  // Borrow resource
  const borrowResource = async (userId: string, resourceId: string, selectedDueDate?: string) => {
    try {
      const dueDate = selectedDueDate ? new Date(selectedDueDate) : new Date();
      if (!selectedDueDate) {
        dueDate.setDate(dueDate.getDate() + 14); // Default to 14 days
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          resource_id: resourceId,
          due_date: dueDate.toISOString(),
          status: 'borrowed'
        }])
        .select()
        .single();

      if (error) throw error;

      const convertedTransaction = convertSupabaseTransaction(data);
      setTransactions(prev => [...prev, convertedTransaction]);

      // Update resource availability
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        const newQuantity = Math.max(0, (resource.quantity || 1) - 1);
        await supabase
          .from('resources')
          .update({ 
            quantity: newQuantity,
            available: newQuantity > 0 
          })
          .eq('id', resourceId);

        setResources(prev =>
          prev.map(r =>
            r.id === resourceId
              ? { ...r, quantity: newQuantity, available: newQuantity > 0 }
              : r
          )
        );

        toast({
          title: "Resource Borrowed",
          description: `You have successfully borrowed "${resource.title}".`,
        });
      }
    } catch (error) {
      console.error('Error borrowing resource:', error);
      toast({
        title: "Error",
        description: "Failed to borrow resource.",
        variant: "destructive",
      });
    }
  };

  // Return resource
  const returnResource = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          return_date: new Date().toISOString(),
          status: 'returned'
        })
        .eq('id', transactionId);

      if (error) throw error;

      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        setTransactions(prev =>
          prev.map(t =>
            t.id === transactionId
              ? { ...t, returnDate: new Date().toISOString().split('T')[0], status: 'returned' }
              : t
          )
        );

        // Update resource availability
        const resource = resources.find(r => r.id === transaction.resourceId);
        if (resource) {
          const newQuantity = (resource.quantity || 0) + 1;
          await supabase
            .from('resources')
            .update({ 
              quantity: newQuantity,
              available: true 
            })
            .eq('id', transaction.resourceId);

          setResources(prev =>
            prev.map(r =>
              r.id === transaction.resourceId
                ? { ...r, quantity: newQuantity, available: true }
                : r
            )
          );

          toast({
            title: "Resource Returned",
            description: `You have successfully returned "${resource.title}".`,
          });
        }
      }
    } catch (error) {
      console.error('Error returning resource:', error);
      toast({
        title: "Error",
        description: "Failed to return resource.",
        variant: "destructive",
      });
    }
  };

  // Calculate fine
  const calculateFine = (transaction: any): number => {
    if (transaction.status !== 'borrowed' || transaction.returnDate) return 0;
    
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    
    if (today <= dueDate) return 0;
    
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
    return daysOverdue * 1; // $1 per day
  };

  // Reserve resource
  const reserveResource = async (userId: string, resourceId: string, fromDate?: string, toDate?: string) => {
    // Implementation similar to borrowResource but with 'reserved' status
    console.log('Reserve resource not fully implemented yet');
  };

  // Get user transactions
  const getUserTransactions = (userId: string) => {
    return transactions.filter(transaction => transaction.userId === userId);
  };

  // Scan identifier
  const scanIdentifier = (identifier: string) => {
    return resources.find(
      resource =>
        resource.isbn === identifier ||
        resource.issn === identifier ||
        resource.doi === identifier ||
        resource.barcode === identifier ||
        resource.qrId === identifier
    );
  };

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
