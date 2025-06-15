
import { useState } from 'react';
import { useLibrary } from '@/contexts/library';
import { Resource } from '@/data/mockData';
import MetadataEditor from '@/components/MetadataEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditResourceDialogProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

const EditResourceDialog = ({ resource, isOpen, onClose }: EditResourceDialogProps) => {
  const { updateResource } = useLibrary();
  
  const handleSave = async (data: Omit<Resource, 'id'>) => {
    const success = await updateResource(resource.id, data);
    if (success) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Resource: {resource.title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <MetadataEditor
            initialData={resource}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditResourceDialog;
