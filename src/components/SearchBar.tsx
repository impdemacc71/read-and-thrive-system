
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string, category: string, type: string) => void;
  categories: string[];
  resourceTypes?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, categories, resourceTypes = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory, selectedType);
  };

  return (
    <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-3">
      <Input
        type="text"
        placeholder="Search for resources..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />
      
      <Select
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {resourceTypes.length > 0 && (
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Resource Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {resourceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <Button type="submit" className="bg-library-accent hover:bg-library-accent-dark">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
