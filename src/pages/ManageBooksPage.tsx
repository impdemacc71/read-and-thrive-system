
import { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/data/mockData';
import SearchBar from '@/components/SearchBar';

const ManageBooksPage = () => {
  const { currentUser } = useAuth();
  const { books, addBook, searchBooks } = useLibrary();
  const navigate = useNavigate();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  
  // Form state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    published: new Date().toISOString().split('T')[0],
    category: 'Science',
    description: '',
    available: true,
    location: '',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400',
  });
  
  // Check if user has librarian or admin role
  if (!currentUser || (currentUser.role !== 'librarian' && currentUser.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
        <p className="mb-8">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Return to Homepage</Button>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewBook(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBook(newBook);
    
    // Reset form
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      published: new Date().toISOString().split('T')[0],
      category: 'Science',
      description: '',
      available: true,
      location: '',
      cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400',
    });
  };
  
  // Extract unique categories for the filter
  const categories = Array.from(new Set(books.map(book => book.category)));
  
  const handleSearch = (query: string, category: string) => {
    let results = searchBooks(query);
    
    if (category !== 'All') {
      results = results.filter(book => book.category === category);
    }
    
    setFilteredBooks(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-library-800">Manage Books</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Book Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Book</CardTitle>
              <CardDescription>Enter the details of the new book to add it to the library catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author"
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input 
                    id="isbn"
                    name="isbn"
                    value={newBook.isbn}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="published">Publication Date</Label>
                    <Input 
                      id="published"
                      name="published"
                      type="date"
                      value={newBook.published}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newBook.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Shelf Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={newBook.location}
                    onChange={handleInputChange}
                    placeholder="e.g., A12-S3"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={newBook.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-library-accent hover:bg-library-accent-dark">
                  Add Book to Library
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Book Inventory */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Book Inventory</h2>
          
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} categories={categories} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 object-cover" src={book.cover} alt={book.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-library-800">{book.title}</div>
                          <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{book.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{book.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{book.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={book.available ? "default" : "outline"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooksPage;
