
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResourceById, borrowResource } = useLibrary();
  const { currentUser, isAuthenticated } = useAuth();
  
  const book = id ? getResourceById(id) : undefined;
  
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
        <p className="mb-8">The resource you are looking for does not exist.</p>
        <Button onClick={() => navigate('/catalog')}>Return to Catalog</Button>
      </div>
    );
  }
  
  const handleBorrow = () => {
    if (currentUser) {
      borrowResource(currentUser.id, book.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="rounded-md overflow-hidden shadow-md h-[400px]">
            <img 
              src={book.cover} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {isAuthenticated && book.available && (
            <Button 
              className="w-full mt-4 bg-library-accent hover:bg-library-accent-dark"
              onClick={handleBorrow}
            >
              Borrow this Resource
            </Button>
          )}
          
          {!book.available && (
            <div className="mt-4 text-center p-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-amber-700">This resource is currently unavailable</p>
            </div>
          )}
        </div>
        
        {/* Book Details */}
        <div className="md:col-span-2">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-library-800">{book.title}</h1>
            <Badge variant={book.available ? "default" : "outline"} className="ml-2">
              {book.available ? "Available" : "Borrowed"}
            </Badge>
          </div>
          
          <h2 className="text-xl text-library-600 mt-2">by {book.author}</h2>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <DetailItem label="Type" value={book.type.charAt(0).toUpperCase() + book.type.slice(1)} />
            <DetailItem label="Published" value={new Date(book.published).toLocaleDateString()} />
            <DetailItem label="Category" value={book.category} />
            <DetailItem label="Location" value={book.location} />
            {book.isbn && <DetailItem label="ISBN" value={book.isbn} />}
            {book.issn && <DetailItem label="ISSN" value={book.issn} />}
            {book.doi && <DetailItem label="DOI" value={book.doi} />}
          </div>
          
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-library-600">{book.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default BookDetailsPage;
