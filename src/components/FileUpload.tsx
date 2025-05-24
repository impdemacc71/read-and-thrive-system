
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Music, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File | null, fileUrl?: string) => void;
  acceptedTypes: string[];
  resourceType: 'ebook' | 'audio' | 'video';
  currentFile?: string;
}

const FileUpload = ({ onFileSelect, acceptedTypes, resourceType, currentFile }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentFile || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getIcon = () => {
    switch (resourceType) {
      case 'ebook':
        return <FileText className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <Upload className="h-5 w-5" />;
    }
  };

  const getAcceptedFormats = () => {
    switch (resourceType) {
      case 'ebook':
        return 'PDF files';
      case 'audio':
        return 'MP3, WAV files';
      case 'video':
        return 'MP4, AVI, MOV files';
      default:
        return 'Supported files';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(`.${fileExtension}`)) {
      toast({
        title: "Invalid file type",
        description: `Please select a valid ${getAcceptedFormats()} file.`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL for the file
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file, url);

    toast({
      title: "File selected",
      description: `${file.name} has been selected for upload.`,
    });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Digital File Upload</Label>
      
      {!selectedFile && !previewUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <div className="flex flex-col items-center space-y-3">
            {getIcon()}
            <div>
              <p className="text-sm font-medium text-gray-900">Upload {resourceType}</p>
              <p className="text-xs text-gray-500">Supports {getAcceptedFormats()}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile?.name || 'Current file'}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Uploaded file'}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {resourceType}
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
