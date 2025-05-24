import React, { useState, useCallback } from 'react';
import { useLibrary } from '@/contexts/library';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QrCode } from 'lucide-react';
import { Resource } from '@/data/mockData';

interface IdentifierScannerProps {
  onResourceFound: (resource: Resource) => void;
}

const IdentifierScanner = ({ onResourceFound }: IdentifierScannerProps) => {
  const { scanIdentifier } = useLibrary();
  const { toast } = useToast();
  const [manualInput, setManualInput] = useState('');

  const handleManualSearch = () => {
    if (!manualInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an identifier to search.",
        variant: "destructive",
      });
      return;
    }

    const resource = scanIdentifier(manualInput.trim());
    if (resource) {
      onResourceFound(resource);
      setManualInput('');
      toast({
        title: "Resource Found",
        description: `Found: ${resource.title}`,
      });
    } else {
      toast({
        title: "Not Found",
        description: "No resource found with this identifier (ISBN, ISSN, DOI, Barcode, or QR ID).",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          Resource Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="manual-input">
            Manual Input (ISBN, ISSN, DOI, Barcode, QR ID)
          </Label>
          <div className="flex gap-2">
            <Input
              id="manual-input"
              placeholder="Enter identifier"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
            <Button onClick={handleManualSearch}>Search</Button>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
};

export default IdentifierScanner;
