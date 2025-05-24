
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Resource, ResourceType } from '@/data/mockData';
import FileUpload from './FileUpload';
import { Save, Book, Globe, MapPin } from 'lucide-react';

interface MetadataEditorProps {
  initialData?: Partial<Resource>;
  onSave: (data: Omit<Resource, 'id'>) => void;
}

const MetadataEditor = ({ initialData, onSave }: MetadataEditorProps) => {
  const [resourceType, setResourceType] = useState<ResourceType>(initialData?.type || 'book');
  const [isDigital, setIsDigital] = useState(initialData?.digital || false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>(initialData?.url || '');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      publisher: initialData?.publisher || '',
      published: initialData?.published || '',
      category: initialData?.category || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      isbn: initialData?.isbn || '',
      issn: initialData?.issn || '',
      doi: initialData?.doi || '',
      barcode: initialData?.barcode || '',
      cover: initialData?.cover || '',
      language: initialData?.language || 'English',
      edition: initialData?.edition || '',
      pages: initialData?.pages || 0,
      keywords: initialData?.keywords?.join(', ') || '',
      available: initialData?.available ?? true,
      quantity: initialData?.quantity || 1,
    }
  });

  const categories = [
    'Science', 'Mathematics', 'Literature', 'Computer Science', 
    'Art', 'History', 'Music', 'Philosophy', 'Medicine', 'Engineering'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'];

  const getFileAcceptedTypes = (type: ResourceType): string[] => {
    switch (type) {
      case 'ebook':
        return ['.pdf'];
      case 'audio':
        return ['.mp3', '.wav', '.m4a'];
      case 'video':
        return ['.mp4', '.avi', '.mov', '.mkv'];
      default:
        return [];
    }
  };

  const handleResourceTypeChange = (type: ResourceType) => {
    setResourceType(type);
    const digital = ['ebook', 'audio', 'video', 'article'].includes(type);
    setIsDigital(digital);
    
    // Set default location based on type
    if (digital) {
      setValue('location', 'Digital Library');
    } else {
      setValue('location', '');
    }
  };

  const handleFileSelect = (file: File | null, url?: string) => {
    setUploadedFile(file);
    if (url) {
      setFileUrl(url);
    }
  };

  const onSubmit = (data: any) => {
    const keywords = data.keywords ? data.keywords.split(',').map((k: string) => k.trim()) : [];
    
    const resourceData: Omit<Resource, 'id'> = {
      ...data,
      type: resourceType,
      digital: isDigital,
      keywords,
      pages: parseInt(data.pages) || 0,
      quantity: isDigital ? undefined : parseInt(data.quantity) || 1,
      url: isDigital ? fileUrl || data.url : undefined,
      fileFormat: uploadedFile ? uploadedFile.name.split('.').pop()?.toUpperCase() : undefined,
    };

    onSave(resourceData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter resource title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">Author *</Label>
              <Input
                id="author"
                {...register('author', { required: 'Author is required' })}
                placeholder="Enter author name"
                className={errors.author ? 'border-red-500' : ''}
              />
              {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Resource Type *</Label>
              <Select value={resourceType} onValueChange={handleResourceTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="ebook">E-Book</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
              <Select value={watch('category')} onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter resource description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm font-medium">Keywords</Label>
            <Input
              id="keywords"
              {...register('keywords')}
              placeholder="Enter keywords separated by commas"
            />
            <p className="text-xs text-gray-500">Separate multiple keywords with commas</p>
          </div>
        </CardContent>
      </Card>

      {/* Publication Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publication Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="publisher" className="text-sm font-medium">Publisher *</Label>
              <Input
                id="publisher"
                {...register('publisher', { required: 'Publisher is required' })}
                placeholder="Enter publisher name"
                className={errors.publisher ? 'border-red-500' : ''}
              />
              {errors.publisher && <p className="text-sm text-red-500">{errors.publisher.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="published" className="text-sm font-medium">Publication Date *</Label>
              <Input
                id="published"
                type="date"
                {...register('published', { required: 'Publication date is required' })}
                className={errors.published ? 'border-red-500' : ''}
              />
              {errors.published && <p className="text-sm text-red-500">{errors.published.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <Select value={watch('language')} onValueChange={(value) => setValue('language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edition" className="text-sm font-medium">Edition</Label>
              <Input
                id="edition"
                {...register('edition')}
                placeholder="e.g., 3rd Edition"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identifiers */}
      <Card>
        <CardHeader>
          <CardTitle>Identifiers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourceType === 'book' || resourceType === 'ebook' ? (
              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-sm font-medium">ISBN</Label>
                <Input
                  id="isbn"
                  {...register('isbn')}
                  placeholder="978-0-123456-78-9"
                />
              </div>
            ) : null}

            {resourceType === 'journal' || resourceType === 'article' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="issn" className="text-sm font-medium">ISSN</Label>
                  <Input
                    id="issn"
                    {...register('issn')}
                    placeholder="1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doi" className="text-sm font-medium">DOI</Label>
                  <Input
                    id="doi"
                    {...register('doi')}
                    placeholder="10.1000/182"
                  />
                </div>
              </>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="barcode" className="text-sm font-medium">Barcode</Label>
              <Input
                id="barcode"
                {...register('barcode')}
                placeholder="Enter barcode"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical/Digital Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location & Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={isDigital ? "default" : "secondary"}>
              {isDigital ? "Digital Resource" : "Physical Resource"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
              <Input
                id="location"
                {...register('location', { required: 'Location is required' })}
                placeholder={isDigital ? "Digital Library" : "e.g., A12-S3"}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>

            {!isDigital && (
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  {...register('quantity')}
                  placeholder="Number of copies"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pages" className="text-sm font-medium">Pages</Label>
              <Input
                id="pages"
                type="number"
                min="0"
                {...register('pages')}
                placeholder="Number of pages"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover" className="text-sm font-medium">Cover Image URL</Label>
              <Input
                id="cover"
                {...register('cover')}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>

          {/* Digital File Upload */}
          {isDigital && ['ebook', 'audio', 'video'].includes(resourceType) && (
            <div className="space-y-4">
              <Separator />
              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={getFileAcceptedTypes(resourceType)}
                resourceType={resourceType as 'ebook' | 'audio' | 'video'}
                currentFile={fileUrl}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Resource
        </Button>
      </div>
    </form>
  );
};

export default MetadataEditor;
