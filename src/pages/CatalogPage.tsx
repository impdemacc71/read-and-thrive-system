
import { useState, useEffect } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { Resource } from '@/data/mockData';

const CatalogPage = () => {
  const { resources, borrowResource, searchResources } = useLibrary();
  const { currentUser, isAuthenticated } = useAuth();
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Extract unique categories and resource types
  const categories = Array.from(new Set(resources.map(resource => resource.category)));
  const resourceTypes = Array.from(new Set(resources.map(resource => resource.type)));

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFilteredResources(resources);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [resources]);

  const handleSearch = (query: string, category: string, type: string) => {
    setLoading(true);
    
    setTimeout(() => {
      let results = searchResources(query);
      
      if (category !== 'All') {
        results = results.filter(resource => resource.category === category);
      }
      
      if (type !== 'All') {
        results = results.filter(resource => resource.type === type);
      }
      
      setFilteredResources(results);
      setLoading(false);
    }, 300);
  };

  const handleBorrow = (resourceId: string) => {
    if (currentUser) {
      borrowResource(currentUser.id, resourceId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-library-800">Library Catalog</h1>
      
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          categories={categories} 
          resourceTypes={resourceTypes}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-md h-80 animate-pulse"></div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <BookCard
              key={resource.id}
              book={resource}
              onBorrow={() => handleBorrow(resource.id)}
              showBorrowButton={isAuthenticated}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No resources found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
