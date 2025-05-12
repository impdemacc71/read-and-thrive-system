
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { books as initialBooks, transactions as initialTransactions, Book, Transaction } from '../data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface LibraryContextType {
  books: Book[];
  transactions: Transaction[];
  borrowBook: (userId: string, bookId: string) => void;
  returnBook: (transactionId: string) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  searchBooks: (query: string) => Book[];
  getBookById: (id: string) => Book | undefined;
  getUserTransactions: (userId: string) => Transaction[];
  getBooksByCategory: (category: string) => Book[];
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
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { toast } = useToast();

  const borrowBook = (userId: string, bookId: string) => {
    // Check if book is available
    const book = books.find(b => b.id === bookId);
    if (!book || !book.available) {
      toast({
        title: "Error",
        description: "This book is not available for checkout.",
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
      bookId,
      checkoutDate,
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'borrowed',
    };

    // Update book availability
    setBooks(prevBooks =>
      prevBooks.map(b =>
        b.id === bookId ? { ...b, available: false } : b
      )
    );

    // Add transaction
    setTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Book Borrowed",
      description: `You have successfully borrowed "${book.title}". Due date: ${dueDate.toLocaleDateString()}`,
    });
  };

  const returnBook = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      toast({
        title: "Error",
        description: "Transaction not found.",
        variant: "destructive",
      });
      return;
    }

    // Update transaction status
    const returnDate = new Date().toISOString().split('T')[0];
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId
          ? { ...t, returnDate, status: 'returned' }
          : t
      )
    );

    // Make the book available again
    setBooks(prevBooks =>
      prevBooks.map(b =>
        b.id === transaction.bookId ? { ...b, available: true } : b
      )
    );

    const book = books.find(b => b.id === transaction.bookId);
    
    toast({
      title: "Book Returned",
      description: `You have successfully returned "${book?.title}".`,
    });
  };

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: `${books.length + 1}`,
    };

    setBooks(prev => [...prev, newBook]);

    toast({
      title: "Book Added",
      description: `"${bookData.title}" has been added to the library catalog.`,
    });
  };

  const searchBooks = (query: string): Book[] => {
    if (!query.trim()) return books;
    
    const lowerCaseQuery = query.toLowerCase();
    return books.filter(book =>
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      book.author.toLowerCase().includes(lowerCaseQuery) ||
      book.isbn.includes(lowerCaseQuery) ||
      book.category.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  const getUserTransactions = (userId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.userId === userId);
  };

  const getBooksByCategory = (category: string): Book[] => {
    if (category === 'All') return books;
    return books.filter(book => book.category === category);
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        transactions,
        borrowBook,
        returnBook,
        addBook,
        searchBooks,
        getBookById,
        getUserTransactions,
        getBooksByCategory,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
