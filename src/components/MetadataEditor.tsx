import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Resource, ResourceType } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, FileText, FileAudio, FileVideo, FileImage } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MetadataEditorProps {
  initialData?: Partial<Resource>;
  onSave: (data: Omit<Resource, 'id'>) => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ initialData, onSave }) => {
  const { toast } = useToast();
  const [resourceType, setResourceType] = useState<ResourceType>(
    initialData?.type || 'book'
  );
  const [isDigital, setIsDigital] = useState(initialData?.digital || false);
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Omit<Resource, 'id'>>({
    defaultValues: {
      ...initialData,
      title: initialData?.title || '',
      author: initialData?.author || '',
      type: initialData?.type || 'book',
      publisher: initialData?.publisher || '',
      published: initialData?.published || new Date().toISOString().split('T')[0],
      category: initialData?.category || 'Science',
      description: initialData?.description || '',
      available: initialData?.available !== undefined ? initialData.available : true,
      location: initialData?.location || '',
      digital: initialData?.digital || false,
      language: initialData?.language || 'English',
      dateAdded: initialData?.dateAdded || new Date().toISOString().split('T')[0],
      keywords: initialData?.keywords || [],
      cover: initialData?.cover || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400',
      quantity: initialData?.quantity || 1, // Default to 1 copy
    },
  });

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      setValue('keywords', newKeywords);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    setKeywords(newKeywords);
    setValue('keywords', newKeywords);
  };

  const handleFormSubmit = (data: Omit<Resource, 'id'>) => {
    // Ensure keywords are included
    const completeData = {
      ...data,
      keywords: keywords,
      digital: isDigital,
    };
    
    // For physical resources, ensure quantity is set
    if (!isDigital && (resourceType === 'book' || resourceType === 'journal')) {
      completeData.quantity = completeData.quantity || 1;
      // Set available status based on quantity
      completeData.available = (completeData.quantity > 0);
    } else if (isDigital) {
      // Digital resources don't have quantity, always available
      delete completeData.quantity;
      completeData.available = true;
    }
    
    onSave(completeData);
    
    toast({
      title: "Success",
      description: "Resource metadata has been saved.",
    });
    
    reset();
  };

  const renderTypeSpecificFields = () => {
    switch (resourceType) {
      case 'book':
      case 'ebook':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                {...register('isbn')}
                placeholder="e.g., 978-3-16-148410-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input 
                id="barcode" 
                {...register('barcode')} 
                placeholder="e.g., 9783161484100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                {...register('edition')}
                placeholder="e.g., 3rd"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input
                id="pages"
                type="number"
                {...register('pages', { valueAsNumber: true })}
                placeholder="e.g., 450"
              />
            </div>
            {!isDigital && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity', { valueAsNumber: true, min: 0 })}
                  placeholder="e.g., 5"
                />
                {errors.quantity && <p className="text-red-500 text-sm">Quantity must be 0 or greater</p>}
              </div>
            )}
          </div>
        );
      case 'journal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issn">ISSN</Label>
              <Input
                id="issn"
                {...register('issn')}
                placeholder="e.g., 2163-0429"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input
                id="pages"
                type="number"
                {...register('pages', { valueAsNumber: true })}
                placeholder="e.g., 120"
              />
            </div>
          </div>
        );
      case 'article':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doi">DOI</Label>
              <Input
                id="doi"
                {...register('doi')}
                placeholder="e.g., 10.1145/3582016"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input
                id="pages"
                type="number"
                {...register('pages', { valueAsNumber: true })}
                placeholder="e.g., 18"
              />
            </div>
          </div>
        );
      case 'audio':
      case 'video':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                {...register('barcode')}
                placeholder="e.g., 0045678901234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileFormat">File Format</Label>
              <Input
                id="fileFormat"
                {...register('fileFormat')}
                placeholder="e.g., MP3, MP4"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = () => {
    switch (resourceType) {
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
        return <FileImage className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getTypeIcon()}
          <CardTitle>Resource Metadata</CardTitle>
        </div>
        <CardDescription>
          Enter the metadata for the resource.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author/Creator</Label>
              <Input
                id="author"
                {...register('author', { required: true })}
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && <p className="text-red-500 text-sm">Author is required</p>}
            </div>
          </div>
          
          {/* Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select
                value={resourceType}
                onValueChange={(value: ResourceType) => {
                  setResourceType(value);
                  setValue('type', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="ebook">E-Book</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                defaultValue={initialData?.category || "Science"}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Philosophy">Philosophy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Type-specific fields */}
          {renderTypeSpecificFields()}
          
          {/* Publication Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                {...register('publisher', { required: true })}
                className={errors.publisher ? "border-red-500" : ""}
              />
              {errors.publisher && <p className="text-red-500 text-sm">Publisher is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="published">Publication Date</Label>
              <Input
                id="published"
                type="date"
                {...register('published', { required: true })}
                className={errors.published ? "border-red-500" : ""}
              />
              {errors.published && <p className="text-red-500 text-sm">Publication date is required</p>}
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: true })}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
          </div>
          
          {/* Digital Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="digital"
                checked={isDigital}
                onChange={(e) => {
                  setIsDigital(e.target.checked);
                  setValue('digital', e.target.checked);
                }}
                className="h-4 w-4"
              />
              <Label htmlFor="digital">Digital Resource</Label>
            </div>
            
            {isDigital && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    {...register('url')}
                    placeholder="e.g., https://library.university.edu/ebooks/title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fileFormat">File Format</Label>
                  <Input
                    id="fileFormat"
                    {...register('fileFormat')}
                    placeholder="e.g., PDF, EPUB"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location', { required: true })}
              placeholder={isDigital ? "e.g., Digital Library" : "e.g., A12-S3"}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
          </div>
          
          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              {...register('language', { required: true })}
              defaultValue="English"
              className={errors.language ? "border-red-500" : ""}
            />
            {errors.language && <p className="text-red-500 text-sm">Language is required</p>}
          </div>
          
          {/* Keywords */}
          <div className="space-y-4">
            <Label>Keywords</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="px-3 py-1">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 text-xs"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add a keyword"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddKeyword}
                variant="outline"
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* Cover URL */}
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              {...register('cover', { required: true })}
              className={errors.cover ? "border-red-500" : ""}
            />
            {errors.cover && <p className="text-red-500 text-sm">Cover URL is required</p>}
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-library-accent hover:bg-library-accent-dark"
          >
            Save Resource Metadata
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MetadataEditor;
