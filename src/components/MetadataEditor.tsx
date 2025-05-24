import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { generateUniqueQRId } from '@/utils/qrCodeUtils';

const resourceFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  author: z.string().min(2, {
    message: "Author must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  cover: z.string().url({
    message: "Cover must be a valid URL.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  language: z.string().min(2, {
    message: "Language must be at least 2 characters.",
  }),
  publisher: z.string().min(2, {
    message: "Publisher must be at least 2 characters.",
  }),
  published: z.string().min(4, {
    message: "Published date must be at least 4 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  isbn: z.string().optional(),
  issn: z.string().optional(),
  doi: z.string().optional(),
  barcode: z.string().optional(),
  keywords: z.string().array().optional(),
  digital: z.boolean().default(false),
  available: z.boolean().default(true),
  quantity: z.number().optional(),
  qrId: z.string().optional(),
});

interface ResourceFormData extends z.infer<typeof resourceFormSchema> {}

interface MetadataEditorProps {
  initialData?: Partial<ResourceFormData>;
  onSave: (data: ResourceFormData) => void;
}

const MetadataEditor = ({ initialData, onSave }: MetadataEditorProps) => {
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      description: initialData?.description || "",
      cover: initialData?.cover || "",
      category: initialData?.category || "",
      type: initialData?.type || "",
      language: initialData?.language || "",
      publisher: initialData?.publisher || "",
      published: initialData?.published || "",
      location: initialData?.location || "",
      isbn: initialData?.isbn || "",
      issn: initialData?.issn || "",
      doi: initialData?.doi || "",
      barcode: initialData?.barcode || "",
      keywords: initialData?.keywords || [],
      digital: initialData?.digital || false,
      available: initialData?.available || true,
      quantity: initialData?.quantity || 1,
      qrId: initialData?.qrId || "",
    },
  });

  const handleSubmit = (data: ResourceFormData) => {
    // Generate QR ID if not present (for new resources)
    const resourceData = {
      ...data,
      qrId: initialData?.qrId || generateUniqueQRId(),
    };
    
    onSave(resourceData);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title of the resource" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author of the resource" {...field} />
              </FormControl>
              <FormDescription>
                This is the author of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the resource"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Write a brief description of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="URL of the cover image" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL for the cover image of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Category of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Specify the category of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="ebook">eBook</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the type of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="Language of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Specify the language of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publisher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publisher</FormLabel>
              <FormControl>
                <Input placeholder="Publisher of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Enter the publisher of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published Date</FormLabel>
              <FormControl>
                <Input placeholder="Published date of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Specify the published date of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Enter the location of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="ISBN of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Enter the ISBN of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="issn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISSN</FormLabel>
              <FormControl>
                <Input placeholder="ISSN of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Enter the ISSN of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOI</FormLabel>
              <FormControl>
                <Input placeholder="DOI of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Enter the DOI of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="Barcode of the resource" {...field} />
              </FormControl>
              <FormDescription>
                Enter the barcode of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Keywords for the resource"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter keywords for the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="digital"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Digital</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormDescription>
                Is this a digital resource?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available</FormLabel>
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormDescription>
                Is this resource currently available?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantity of the resource"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the quantity of the resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

export default MetadataEditor;
