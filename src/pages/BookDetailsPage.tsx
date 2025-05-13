
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/library';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Edit, BookmarkPlus } from 'lucide-react';
import EditResourceDialog from '@/components/EditResourceDialog';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getResourceById, borrowResource, reserveResource } = useLibrary();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const resource = getResourceById(id || '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 10))
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
        <p className="mb-8">The resource you are looking for does not exist.</p>
        <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
      </div>
    );
  }

  const handleBorrow = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const dueDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;
    borrowResource(currentUser.id, resource.id, dueDateString);
  };

  const handleReserve = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    reserveResource(currentUser.id, resource.id);
  };

  // Maximum due date is 10 days from today
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);

  const isResourceAvailable = () => {
    if (resource.digital) return true;
    
    if ((resource.type === 'book' || resource.type === 'journal') && !resource.digital) {
      return resource.quantity !== undefined && resource.quantity > 0;
    }
    
    return resource.available;
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'librarian';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap md:flex-nowrap gap-8">
        {/* Left column - Resource image */}
        <div className="w-full md:w-1/3">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={resource.cover} 
              alt={resource.title} 
              className="w-full object-cover" 
            />
          </div>
        </div>
        
        {/* Right column - Resource details */}
        <div className="w-full md:w-2/3">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-library-800">{resource.title}</h1>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            )}
          </div>
          
          <h2 className="text-xl text-library-600 mb-4">{resource.author}</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">{resource.category}</Badge>
            <Badge variant="outline" className="capitalize">{resource.type}</Badge>
            <Badge variant="outline">{resource.language}</Badge>
            <Badge 
              variant={isResourceAvailable() ? "default" : "outline"}
              className={isResourceAvailable() ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
            >
              {isResourceAvailable() ? "Available" : "Not Available"}
              {/* Show quantity for physical resources that aren't digital */}
              {!resource.digital && (resource.type === 'book' || resource.type === 'journal') && resource.quantity !== undefined && (
                <span className="ml-1">
                  ({resource.quantity} {resource.quantity === 1 ? 'copy' : 'copies'})
                </span>
              )}
            </Badge>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Publisher</p>
                  <p>{resource.publisher}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published Date</p>
                  <p>{resource.published}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{resource.location}</p>
                </div>
                {resource.isbn && (
                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p>{resource.isbn}</p>
                  </div>
                )}
                {resource.doi && (
                  <div>
                    <p className="text-sm text-gray-500">DOI</p>
                    <p>{resource.doi}</p>
                  </div>
                )}
                {resource.issn && (
                  <div>
                    <p className="text-sm text-gray-500">ISSN</p>
                    <p>{resource.issn}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p>{resource.description}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {resource.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </div>

              {/* Borrow/Reserve section */}
              {!currentUser ? (
                <div className="text-center p-4 border-t border-gray-200 mt-4">
                  <p className="mb-4">Please log in to borrow or reserve resources.</p>
                  <Button onClick={() => navigate('/login')}>Log In</Button>
                </div>
              ) : isResourceAvailable() ? (
                <div className="space-y-6 border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-lg">Borrow This Resource</h3>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Select Due Date</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => 
                            date < new Date() || // Can't select dates in the past
                            date > maxDate // Can't select dates more than 10 days away
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can borrow this resource for up to 10 days.
                    </p>
                  </div>
                  
                  <Button className="w-full" onClick={handleBorrow}>
                    Borrow This Resource
                  </Button>
                </div>
              ) : (
                <div className="text-center p-4 border-t border-gray-200 mt-4">
                  <h3 className="font-medium text-lg mb-4">Resource Currently Unavailable</h3>
                  <p className="mb-4">This resource is currently borrowed by other users.</p>
                  <Button 
                    variant="outline" 
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                    onClick={handleReserve}
                  >
                    <BookmarkPlus className="h-4 w-4 mr-2" /> Reserve for When Available
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isAdmin && resource && (
        <EditResourceDialog
          resource={resource}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default BookDetailsPage;
