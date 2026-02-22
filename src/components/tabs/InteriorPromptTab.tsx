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

const INTERIOR_TYPES = [
  { value: 'text book', label: 'Libro di Testo' },
  { value: 'coloring book', label: 'Libro da Colorare' },
  { value: 'journal', label: 'Diario' },
  { value: 'workbook', label: 'Quaderno di Esercizi' },
  { value: 'planner', label: 'Agenda' },
];

const PAGE_SIZES = [
  { value: '5x8', label: '12,7 × 20,3 cm (5×8")' },
  { value: '5.25x8', label: '13,3 × 20,3 cm (5.25×8")' },
  { value: '5.5x8.5', label: '14 × 21,6 cm (5.5×8.5")' },
  { value: '6x9', label: '15,2 × 22,9 cm (6×9")' },
  { value: '7x10', label: '17,8 × 25,4 cm (7×10")' },
  { value: '8x10', label: '20,3 × 25,4 cm (8×10")' },
  { value: '8.5x8.5', label: '21,6 × 21,6 cm (8.5×8.5")' },
  { value: '8.5x11', label: '21,6 × 27,9 cm (8.5×11")' },
];

const MARGINS = [
  { value: 'standard', label: 'Standard' },
  { value: 'narrow', label: 'Stretti' },
  { value: 'wide', label: 'Larghi' },
  { value: 'custom', label: 'Personalizzati' },
];

const LAYOUTS = [
  { value: 'minimal', label: 'Minimale' },
  { value: 'modern', label: 'Moderno' },
  { value: 'playful', label: 'Giocoso' },
  { value: 'classic', label: 'Classico' },
  { value: 'editorial', label: 'Editoriale' },
];

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
          <Label>Tipo Interno</Label>
          <Select value={i.interiorType} onValueChange={v => updateInterior({ interiorType: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
            <SelectContent>
              {INTERIOR_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Formato Pagina</Label>
          <Select value={i.pageSize} onValueChange={v => updateInterior({ pageSize: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Margini</Label>
          <Select value={i.margins} onValueChange={v => updateInterior({ margins: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MARGINS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Stile Layout</Label>
          <Select value={i.layoutStyle} onValueChange={v => updateInterior({ layoutStyle: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {LAYOUTS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DynamicListInput
        items={i.recurringElements}
        onChange={items => updateInterior({ recurringElements: items })}
        placeholder="Aggiungi elemento ricorrente (intestazioni, numeri pagina, ecc.)..."
        label="Elementi di Layout Ricorrenti"
        suggestions={['Intestazioni', 'Numeri di pagina', 'Riquadri', 'Separatori di sezione', 'Note a piè di pagina', 'Indice']}
      />

      <Button onClick={() => setGeneratedPrompt(generateInteriorPrompt(project))} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" /> Genera Prompt Interno
      </Button>

      <PromptOutput prompt={generatedPrompt} title={`${project.title}_prompt_interno`} />
    </div>
  );
}
