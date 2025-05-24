import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Resource, Transaction } from '@/data/mockData';

export function useResourceManagement(
  initialResources: Resource[], 
  initialTransactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const { toast } = useToast();

  const addResource = (resourceData: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: `${resources.length + 1}`,
      qrId: resourceData.qrId || generateUniqueQRId(),
    };

    setResources(prev => [...prev, newResource]);

    toast({
      title: "Resource Added",
      description: `"${resourceData.title}" has been added to the library catalog with QR code ${newResource.qrId}.`,
    });
  };

  const updateResource = (id: string, resourceData: Partial<Resource>) => {
    const resourceExists = resources.find(resource => resource.id === id);
    
    if (!resourceExists) {
      toast({
        title: "Error",
        description: "Resource not found.",
        variant: "destructive",
      });
      return;
    }

    setResources(prev =>
      prev.map(resource =>
        resource.id === id ? { ...resource, ...resourceData } : resource
      )
    );

    toast({
      title: "Resource Updated",
      description: `"${resourceData.title || resourceExists.title}" has been updated.`,
    });

    return true;
  };

  const searchResources = (query: string): Resource[] => {
    if (!query.trim()) return resources;
    
    const lowerCaseQuery = query.toLowerCase();
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(lowerCaseQuery) ||
      resource.author.toLowerCase().includes(lowerCaseQuery) ||
      (resource.isbn && resource.isbn.includes(lowerCaseQuery)) ||
      (resource.issn && resource.issn.includes(lowerCaseQuery)) ||
      (resource.doi && resource.doi.includes(lowerCaseQuery)) ||
      (resource.barcode && resource.barcode.includes(lowerCaseQuery)) ||
      (resource.qrId && resource.qrId.toLowerCase().includes(lowerCaseQuery)) ||
      resource.publisher.toLowerCase().includes(lowerCaseQuery) ||
      resource.category.toLowerCase().includes(lowerCaseQuery) ||
      resource.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const getResourceById = (id: string): Resource | undefined => {
    return resources.find(resource => resource.id === id);
  };

  const getResourcesByCategory = (category: string): Resource[] => {
    if (category === 'All') return resources;
    return resources.filter(resource => resource.category === category);
  };

  const getResourcesByType = (type: string): Resource[] => {
    if (type === 'All') return resources;
    return resources.filter(resource => resource.type === type);
  };

  const scanIdentifier = (identifier: string): Resource | undefined => {
    // Check different identifiers (ISBN, ISSN, DOI, barcode, QR ID)
    return resources.find(
      resource =>
        resource.isbn === identifier ||
        resource.issn === identifier ||
        resource.doi === identifier ||
        resource.barcode === identifier ||
        resource.qrId === identifier
    );
  };

  return {
    resources,
    setResources,
    addResource,
    updateResource,
    searchResources,
    getResourceById,
    getResourcesByCategory,
    getResourcesByType,
    scanIdentifier
  };
}
