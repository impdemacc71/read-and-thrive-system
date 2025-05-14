
import { useState, useEffect } from 'react';
import { useLibrary } from '@/contexts/library';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Resource } from '@/data/mockData';

const CatalogPage = () => {
  const { resources, searchResources } = useLibrary();
  const { currentUser, isAuthenticated } = useAuth();
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Extract unique categories and resource types
  const categories = Array.from(new Set(resources.map(resource => resource.category)));
  const resourceTypes = Array.from(new Set(resources.map(resource => resource.type)));

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setFilteredResources(resources);
      setLoading(false);
    }, 300); // Reduced loading time for better UX
    
    return () => clearTimeout(timer);
  }, [resources, isAuthenticated, navigate]);

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
    }, 200); // Faster search response for better UX
  };

  const handleResourceClick = (resourceId: string) => {
    navigate(`/book/${resourceId}`);
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-library-800 md:mb-8">UniLib Catalog</h1>
      
      <div className="mb-6 md:mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          categories={categories} 
          resourceTypes={resourceTypes}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-md h-64 sm:h-72 md:h-80 animate-pulse"></div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredResources.map((resource) => (
            <BookCard
              key={resource.id}
              book={resource}
              onBorrow={() => handleResourceClick(resource.id)}
              showBorrowButton={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No resources found matching your search criteria.</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setFilteredResources(resources);
                setLoading(false);
              }, 200);
            }}
          >
            Reset Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
