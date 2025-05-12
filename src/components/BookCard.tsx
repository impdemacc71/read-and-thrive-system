
import { Book } from '@/data/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onBorrow?: () => void;
  showBorrowButton?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBorrow, showBorrowButton = true }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
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
          <Badge variant={book.available ? "default" : "outline"} className="ml-2">
            {book.available ? "Available" : "Borrowed"}
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
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link to={`/book/${book.id}`}>
          <Button variant="outline" size="sm">Details</Button>
        </Link>
        {showBorrowButton && book.available && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onBorrow}
            className="bg-library-accent hover:bg-library-accent-dark"
          >
            Borrow
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
