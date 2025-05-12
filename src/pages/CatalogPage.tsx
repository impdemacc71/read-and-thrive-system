
import { useState, useEffect } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { Book } from '@/data/mockData';

const CatalogPage = () => {
  const { books, borrowBook, searchBooks, getBooksByCategory } = useLibrary();
  const { currentUser, isAuthenticated } = useAuth();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Extract unique categories
  const categories = Array.from(new Set(books.map(book => book.category)));

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFilteredBooks(books);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [books]);

  const handleSearch = (query: string, category: string) => {
    setLoading(true);
    
    setTimeout(() => {
      let results = searchBooks(query);
      
      if (category !== 'All') {
        results = results.filter(book => book.category === category);
      }
      
      setFilteredBooks(results);
      setLoading(false);
    }, 300);
  };

  const handleBorrow = (bookId: string) => {
    if (currentUser) {
      borrowBook(currentUser.id, bookId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-library-800">Library Catalog</h1>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} categories={categories} />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-md h-80 animate-pulse"></div>
          ))}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={() => handleBorrow(book.id)}
              showBorrowButton={isAuthenticated}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No books found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
