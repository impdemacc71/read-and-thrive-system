
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface MultiSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({ value = [], onChange, placeholder }: MultiSelectProps) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddKeyword = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange?.([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onChange?.(value.filter(k => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={handleAddKeyword} variant="outline">
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
              {keyword}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveKeyword(keyword)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
