
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLibrary } from '@/contexts/LibraryContext';
import { Resource } from '@/data/mockData';
import { Barcode, Book, FileText, FileAudio, FileVideo } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface IdentifierScannerProps {
  onResourceFound?: (resource: Resource) => void;
}

const IdentifierScanner: React.FC<IdentifierScannerProps> = ({ onResourceFound }) => {
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'isbn' | 'issn' | 'doi' | 'barcode'>('isbn');
  const [isScanning, setIsScanning] = useState(false);
  const { scanIdentifier } = useLibrary();
  const { toast } = useToast();

  const handleScan = () => {
    if (!identifier.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid identifier",
        variant: "destructive",
      });
      return;
    }

    // Simulate scanning process
    setIsScanning(true);
    setTimeout(() => {
      const resource = scanIdentifier(identifier);
      
      if (resource) {
        toast({
          title: "Resource Found",
          description: `Found: ${resource.title} by ${resource.author}`,
        });
        
        if (onResourceFound) {
          onResourceFound(resource);
        }
      } else {
        toast({
          title: "Not Found",
          description: `No resource found with ${identifierType}: ${identifier}`,
          variant: "destructive",
        });
      }
      
      setIsScanning(false);
    }, 1000);
  };

  const getIcon = () => {
    switch (identifierType) {
      case 'isbn':
        return <Book className="h-5 w-5" />;
      case 'issn':
        return <FileText className="h-5 w-5" />;
      case 'doi':
        return <FileText className="h-5 w-5" />;
      case 'barcode':
        return <Barcode className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <h3 className="text-lg font-semibold">Scan Resource Identifier</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <select
                className="w-full p-2 border rounded-md"
                value={identifierType}
                onChange={(e) => setIdentifierType(e.target.value as any)}
              >
                <option value="isbn">ISBN</option>
                <option value="issn">ISSN</option>
                <option value="doi">DOI</option>
                <option value="barcode">Barcode</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={`Enter ${identifierType.toUpperCase()}`}
              />
            </div>
            
            <div className="md:col-span-1">
              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                className="w-full bg-library-accent hover:bg-library-accent-dark"
              >
                {isScanning ? 'Scanning...' : 'Scan'}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Enter a {identifierType.toUpperCase()} to search for a resource in the library catalog.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentifierScanner;
