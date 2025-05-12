
import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Resource } from '@/data/mockData';

const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { resources, borrowResource, searchResources, getResourcesByCategory } = useLibrary();
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources.slice(0, 4));
  
  // Extract unique categories
  const categories = Array.from(new Set(resources.map(resource => resource.category)));

  const handleSearch = (query: string, category: string) => {
    let results = searchResources(query);
    
    if (category !== 'All') {
      results = getResourcesByCategory(category);
    }
    
    setFilteredResources(results);
  };

  const handleBorrow = (resourceId: string) => {
    if (currentUser) {
      borrowResource(currentUser.id, resourceId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-library-800">University Library System</h1>
        <p className="text-lg text-library-600 mb-8">
          Access thousands of books, journals, and resources to support your academic journey
        </p>
        
        {!isAuthenticated && (
          <Link to="/login">
            <Button className="bg-library-accent hover:bg-library-accent-dark">
              Log in to get started
            </Button>
          </Link>
        )}
      </section>

      {/* Search section */}
      <section className="mb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-library-700">Find Resources</h2>
          <SearchBar onSearch={handleSearch} categories={categories} />
        </div>
      </section>

      {/* Featured resources */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-library-700">
            {filteredResources.length < resources.length ? 'Search Results' : 'Featured Resources'}
          </h2>
          <Link to="/catalog">
            <Button variant="outline">View All Resources</Button>
          </Link>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.slice(0, 8).map((resource) => (
              <BookCard 
                key={resource.id} 
                book={resource} 
                onBorrow={() => handleBorrow(resource.id)}
                showBorrowButton={isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-library-500">No resources found matching your search criteria.</p>
            <Button className="mt-4" variant="outline" onClick={() => setFilteredResources(resources.slice(0, 4))}>
              Reset Search
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
