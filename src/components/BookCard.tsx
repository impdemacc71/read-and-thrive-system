
import { Resource } from '@/data/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';

interface BookCardProps {
  book: Resource;
  onBorrow?: () => void;
  showBorrowButton?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBorrow, showBorrowButton = true }) => {
  const { transactions } = useLibrary();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Find if this book has a transaction that shows when it will be available again
  const bookTransaction = transactions.find(
    t => t.resourceId === book.id && t.status === 'borrowed' && !t.returnDate
  );
  
  const dueDate = bookTransaction ? new Date(bookTransaction.dueDate).toISOString().split('T')[0] : null;

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };
  
  const handleBorrowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onBorrow) onBorrow();
  };
  
  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{book.title}</CardTitle>
          <Badge variant={book.available ? "default" : "outline"} className={`ml-2 ${book.available ? "" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {book.available ? "Available" : dueDate ? `Not Available until ${dueDate}` : "Not Available"}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{book.author}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {book.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {book.location}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        {showBorrowButton && isAuthenticated && (
          <>
            {book.available ? (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleBorrowClick}
                className="bg-library-accent hover:bg-library-accent-dark"
              >
                Borrow
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBorrowClick}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Reserve
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
