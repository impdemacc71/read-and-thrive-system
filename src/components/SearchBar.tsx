
import { useState, useEffect } from 'react';
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

  // Use debounce to avoid too many search calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        onSearch(searchQuery, selectedCategory, selectedType);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedType, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory, selectedType);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Category changes trigger search immediately
    onSearch(searchQuery, value, selectedType);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    // Type changes trigger search immediately
    onSearch(searchQuery, selectedCategory, value);
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
        onValueChange={handleCategoryChange}
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
          onValueChange={handleTypeChange}
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
