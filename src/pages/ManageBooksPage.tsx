import { useState } from 'react';
import { useLibrary } from '@/contexts/library';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Resource, ResourceType } from '@/data/mockData';
import SearchBar from '@/components/SearchBar';
import IdentifierScanner from '@/components/IdentifierScanner';
import MetadataEditor from '@/components/MetadataEditor';
import EditResourceDialog from '@/components/EditResourceDialog';
import { 
  Book, 
  FileText, 
  FileAudio, 
  FileVideo,
  Edit,
  Eye
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ManageBooksPage = () => {
  const { currentUser } = useAuth();
  const { resources, addResource, searchResources } = useLibrary();
  const navigate = useNavigate();
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  // Extract unique categories and resource types
  const categories = Array.from(new Set(resources.map(resource => resource.category)));
  const resourceTypes = Array.from(new Set(resources.map(resource => resource.type)));
  
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
  
  const handleSearch = (query: string, category: string, type: string) => {
    let results = searchResources(query);
    
    if (category !== 'All') {
      results = results.filter(resource => resource.category === category);
    }
    
    if (type !== 'All') {
      results = results.filter(resource => resource.type === type);
    }
    
    setFilteredResources(results);
  };

  const getResourceTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'book':
      case 'ebook':
        return <Book className="h-5 w-5" />;
      case 'journal':
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'audio':
        return <FileAudio className="h-5 w-5" />;
      case 'video':
        return <FileVideo className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  // Function to display availability status for a resource
  const getAvailabilityDisplay = (resource: Resource) => {
    if (resource.digital) {
      return <Badge variant="default">Available</Badge>;
    }
    
    if (resource.quantity !== undefined) {
      if (resource.quantity > 0) {
        return (
          <div className="flex flex-col">
            <Badge variant="default">Available</Badge>
            <span className="text-xs mt-1">{resource.quantity} copies</span>
          </div>
        );
      } else {
        return <Badge variant="outline">Out of Stock</Badge>;
      }
    }
    
    return <Badge variant={resource.available ? "default" : "outline"}>
      {resource.available ? "Available" : "Borrowed"}
    </Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-library-800">Manage Resources</h1>
      
      <div className="mb-8">
        <IdentifierScanner 
          onResourceFound={(resource) => {
            navigate(`/book/${resource.id}`);
          }} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Resource Form */}
        <div className="lg:col-span-1">
          <MetadataEditor 
            onSave={(resourceData) => {
              addResource({
                ...resourceData,
                dateAdded: new Date().toISOString().split('T')[0]
              });
            }}
          />
        </div>
        
        {/* Resource Inventory */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Resource Inventory</h2>
          
          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch} 
              categories={categories}
              resourceTypes={resourceTypes}
            />
          </div>
          
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>QR ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 object-cover" src={resource.cover} alt={resource.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-library-800">{resource.title}</div>
                          <div className="text-sm text-gray-500">{resource.author}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getResourceTypeIcon(resource.type)}
                        <span className="text-sm capitalize">{resource.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 font-mono">
                        {resource.qrId || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{resource.location}</div>
                    </TableCell>
                    <TableCell>
                      {getAvailabilityDisplay(resource)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => navigate(`/book/${resource.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingResource(resource)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {editingResource && (
        <EditResourceDialog
          resource={editingResource}
          isOpen={!!editingResource}
          onClose={() => setEditingResource(null)}
        />
      )}
    </div>
  );
};

export default ManageBooksPage;
