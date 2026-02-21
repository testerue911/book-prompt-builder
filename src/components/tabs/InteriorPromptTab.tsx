import { useState } from 'react';
import { Project } from '@/types/project';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicListInput } from '@/components/DynamicListInput';
import { PromptOutput } from '@/components/PromptOutput';
import { generateInteriorPrompt } from '@/lib/prompt-generators';
import { Sparkles } from 'lucide-react';

interface InteriorPromptTabProps {
  project: Project;
  onChange: (updates: Partial<Project>) => void;
}

const INTERIOR_TYPES = ['text book', 'coloring book', 'journal', 'workbook', 'planner'];
const PAGE_SIZES = ['5x8', '5.25x8', '5.5x8.5', '6x9', '7x10', '8x10', '8.5x8.5', '8.5x11'];
const MARGINS = ['standard', 'narrow', 'wide', 'custom'];
const LAYOUTS = ['minimal', 'modern', 'playful', 'classic', 'editorial'];

export function InteriorPromptTab({ project, onChange }: InteriorPromptTabProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const i = project.interiorPrompt;

  const updateInterior = (updates: Partial<typeof i>) => {
    onChange({ interiorPrompt: { ...i, ...updates } });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Interior Type</Label>
          <Select value={i.interiorType} onValueChange={v => updateInterior({ interiorType: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {INTERIOR_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Page Size</Label>
          <Select value={i.pageSize} onValueChange={v => updateInterior({ pageSize: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => <SelectItem key={s} value={s}>{s}"</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Margins</Label>
          <Select value={i.margins} onValueChange={v => updateInterior({ margins: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MARGINS.map(m => <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Layout Style</Label>
          <Select value={i.layoutStyle} onValueChange={v => updateInterior({ layoutStyle: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {LAYOUTS.map(l => <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DynamicListInput
        items={i.recurringElements}
        onChange={items => updateInterior({ recurringElements: items })}
        placeholder="Add recurring element (headers, page numbers, etc.)..."
        label="Recurring Layout Elements"
      />

      <Button onClick={() => setGeneratedPrompt(generateInteriorPrompt(project))} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" /> Generate Interior Prompt
      </Button>

      <PromptOutput prompt={generatedPrompt} title={`${project.title}_interior_prompt`} />
    </div>
  );
}
