import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResourceById, borrowResource, transactions, reserveResource } = useLibrary();
  const { currentUser, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
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
  
  // Find if this book has a transaction that shows when it will be available again
  const bookTransaction = transactions.find(
    t => t.resourceId === book.id && t.status === 'borrowed' && !t.returnDate
  );
  
  const dueDate = bookTransaction ? new Date(bookTransaction.dueDate).toLocaleDateString() : null;
  
  const handleBorrow = () => {
    if (currentUser && selectedDate) {
      const dueDateString = selectedDate.toISOString().split('T')[0];
      borrowResource(currentUser.id, book.id, dueDateString);
    }
  };

  const handleReserve = () => {
    if (currentUser) {
      reserveResource(currentUser.id, book.id);
    }
  };

  // For date picker - limit to max 10 days from today
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 10);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-8">Please log in to view book details and borrow resources.</p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

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
          
          {book.available ? (
            <div className="mt-4">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Select due date (max 10 days):</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a return date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => 
                        date < today || 
                        date > maxDate
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button 
                className="w-full mt-2 bg-library-accent hover:bg-library-accent-dark"
                onClick={handleBorrow}
                disabled={!selectedDate}
              >
                Borrow this Resource
              </Button>
              {!selectedDate && (
                <p className="text-xs text-center mt-2 text-amber-600">Please select a return date</p>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <Button 
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50" 
                variant="outline"
                onClick={handleReserve}
              >
                Reserve this Resource
              </Button>
              <div className="text-center p-2 mt-2 bg-amber-50 border border-amber-200 rounded">
                <p className="text-amber-700">
                  {dueDate 
                    ? `This resource is not available until ${dueDate}`
                    : "This resource is currently unavailable"}
                </p>
              </div>
            </div>
          )}
          
          {/* Quantity for physical resources */}
          {book.type === 'physical' && (
            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <p className="font-medium">Availability</p>
              <p className="text-sm">
                {book.quantity !== undefined && book.quantity > 0 
                  ? `${book.quantity} copies available` 
                  : "Currently out of stock"}
              </p>
            </div>
          )}
        </div>
        
        {/* Book Details */}
        <div className="md:col-span-2">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-library-800">{book.title}</h1>
            <Badge 
              variant={book.available ? "default" : "outline"} 
              className={`ml-2 ${book.available ? "" : "bg-amber-50 text-amber-700 border-amber-200"}`}
            >
              {book.available ? "Available" : dueDate ? `Not Available until ${dueDate}` : "Not Available"}
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
