import { useState } from 'react';
import { Project } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromptOutput } from '@/components/PromptOutput';
import { generateCoverPrompt } from '@/lib/prompt-generators';
import { Sparkles } from 'lucide-react';

interface CoverPromptTabProps {
  project: Project;
  onChange: (updates: Partial<Project>) => void;
}

const VISUAL_STYLES = [
  { value: 'watercolor', label: 'Acquerello' },
  { value: '3D', label: '3D' },
  { value: 'flat', label: 'Flat' },
  { value: 'manga', label: 'Manga' },
  { value: 'minimal', label: 'Minimale' },
  { value: 'photorealistic', label: 'Fotorealistico' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'abstract', label: 'Astratto' },
  { value: 'hand-drawn', label: 'Disegnato a Mano' },
];

const MOODS = [
  { value: 'calm', label: 'Calmo' },
  { value: 'energetic', label: 'Energico' },
  { value: 'dark', label: 'Cupo' },
  { value: 'playful', label: 'Giocoso' },
  { value: 'mysterious', label: 'Misterioso' },
  { value: 'romantic', label: 'Romantico' },
  { value: 'professional', label: 'Professionale' },
  { value: 'whimsical', label: 'Fantasioso' },
];

const TRIM_SIZES = [
  { value: '5x8', label: '12,7 × 20,3 cm (5×8")' },
  { value: '5.25x8', label: '13,3 × 20,3 cm (5.25×8")' },
  { value: '5.5x8.5', label: '14 × 21,6 cm (5.5×8.5")' },
  { value: '6x9', label: '15,2 × 22,9 cm (6×9")' },
  { value: '7x10', label: '17,8 × 25,4 cm (7×10")' },
  { value: '8x10', label: '20,3 × 25,4 cm (8×10")' },
  { value: '8.5x8.5', label: '21,6 × 21,6 cm (8.5×8.5")' },
  { value: '8.5x11', label: '21,6 × 27,9 cm (8.5×11")' },
];

export function CoverPromptTab({ project, onChange }: CoverPromptTabProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const c = project.coverPrompt;

  const updateCover = (updates: Partial<typeof c>) => {
    onChange({ coverPrompt: { ...c, ...updates } });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Stile Visivo</Label>
          <Select value={c.visualStyle} onValueChange={v => updateCover({ visualStyle: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Seleziona stile" /></SelectTrigger>
            <SelectContent>
              {VISUAL_STYLES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Atmosfera</Label>
          <Select value={c.mood} onValueChange={v => updateCover({ mood: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Seleziona atmosfera" /></SelectTrigger>
            <SelectContent>
              {MOODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Formato KDP</Label>
          <Select value={c.trimSize} onValueChange={v => updateCover({ trimSize: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TRIM_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Elementi Principali</Label>
          <Textarea value={c.mainElements} onChange={e => updateCover({ mainElements: e.target.value })} placeholder="Descrivi gli elementi visivi principali..." className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Palette Colori</Label>
          <Textarea value={c.colorPalette} onChange={e => updateCover({ colorPalette: e.target.value })} placeholder="es. Blu navy, accenti oro, crema..." className="bg-background" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Stile Tipografico</Label>
        <Input value={c.typographyStyle} onChange={e => updateCover({ typographyStyle: e.target.value })} placeholder="es. Titolo serif grassetto, sottotitolo in corsivo elegante" className="bg-background" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Titolo Copertina</Label>
          <Input value={c.coverTitle} onChange={e => updateCover({ coverTitle: e.target.value })} placeholder={project.title} className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Sottotitolo</Label>
          <Input value={c.coverSubtitle} onChange={e => updateCover({ coverSubtitle: e.target.value })} placeholder="Sottotitolo opzionale" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Nome Autore</Label>
          <Input value={c.authorName} onChange={e => updateCover({ authorName: e.target.value })} placeholder="Nome autore da visualizzare" className="bg-background" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Prompt Negativo (Cosa Evitare)</Label>
        <Textarea value={c.negativePrompt} onChange={e => updateCover({ negativePrompt: e.target.value })} placeholder="es. Niente testo sovrapposto ai volti, niente elementi sfocati..." className="bg-background" />
      </div>

      <Button onClick={() => setGeneratedPrompt(generateCoverPrompt(project))} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" /> Genera Prompt Copertina
      </Button>

      <PromptOutput prompt={generatedPrompt} title={`${project.title}_prompt_copertina`} />
    </div>
  );
}
