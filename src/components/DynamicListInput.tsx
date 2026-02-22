import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface DynamicListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
  suggestions?: string[];
}

export function DynamicListInput({ items, onChange, placeholder = 'Scrivi e premi Invio...', label, suggestions }: DynamicListInputProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      onChange([...items, value.trim()]);
      setValue('');
    }
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addSuggestion = (suggestion: string) => {
    if (!items.includes(suggestion)) {
      onChange([...items, suggestion]);
    }
  };

  const availableSuggestions = suggestions?.filter(s => !items.includes(s)) ?? [];

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-background"
      />
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {item}
              <button onClick={() => remove(i)} className="ml-0.5 rounded-full p-0.5 hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {availableSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => addSuggestion(s)}
              className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
