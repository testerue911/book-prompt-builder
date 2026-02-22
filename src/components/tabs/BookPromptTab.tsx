import { useState } from 'react';
import { Project } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DynamicListInput } from '@/components/DynamicListInput';
import { PromptOutput } from '@/components/PromptOutput';
import { generateBookPrompt } from '@/lib/prompt-generators';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

interface BookPromptTabProps {
  project: Project;
  onChange: (updates: Partial<Project>) => void;
}

const WRITING_STYLES = [
  { value: 'professional', label: 'Professionale' },
  { value: 'friendly', label: 'Amichevole' },
  { value: 'humorous', label: 'Umoristico' },
  { value: 'academic', label: 'Accademico' },
  { value: 'conversational', label: 'Colloquiale' },
  { value: 'playful', label: 'Giocoso' },
  { value: 'minimal', label: 'Minimale' },
  { value: 'poetic', label: 'Poetico' },
  { value: 'custom', label: 'Personalizzato' },
];

export function BookPromptTab({ project, onChange }: BookPromptTabProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const b = project.bookPrompt;

  const updateBook = (updates: Partial<typeof b>) => {
    onChange({ bookPrompt: { ...b, ...updates } });
  };

  const addChapter = () => {
    updateBook({ chapters: [...b.chapters, { title: '', description: '' }] });
  };

  const updateChapter = (index: number, field: 'title' | 'description', value: string) => {
    const chapters = [...b.chapters];
    chapters[index] = { ...chapters[index], [field]: value };
    updateBook({ chapters });
  };

  const removeChapter = (index: number) => {
    updateBook({ chapters: b.chapters.filter((_, i) => i !== index) });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Idea Principale / Tema</Label>
          <Textarea
            value={b.mainIdea}
            onChange={e => updateBook({ mainIdea: e.target.value })}
            placeholder="Qual è l'idea centrale del tuo libro?"
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label>Obiettivo di Trasformazione del Lettore</Label>
          <Textarea
            value={b.readerTransformation}
            onChange={e => updateBook({ readerTransformation: e.target.value })}
            placeholder="Cosa dovrebbe ottenere il lettore dopo la lettura?"
            className="bg-background"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DynamicListInput
          items={b.keyPoints}
          onChange={items => updateBook({ keyPoints: items })}
          placeholder="Aggiungi un punto chiave e premi Invio..."
          label="Punti Chiave da Includere"
          suggestions={['Esempi pratici', 'Esercizi', 'Casi studio', 'Riassunti capitolo', 'Checklist', 'Citazioni']}
        />
        <DynamicListInput
          items={b.whatToAvoid}
          onChange={items => updateBook({ whatToAvoid: items })}
          placeholder="Aggiungi un elemento da evitare e premi Invio..."
          label="Cosa Evitare"
          suggestions={['Gergo tecnico', 'Contenuti offensivi', 'Nomi protetti', 'Informazioni obsolete', 'Promesse irrealistiche']}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Stile di Scrittura</Label>
          <Select value={b.writingStyle} onValueChange={v => updateBook({ writingStyle: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {WRITING_STYLES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {b.writingStyle === 'custom' && (
          <div className="space-y-2">
            <Label>Stile Personalizzato</Label>
            <Input value={b.customStyle} onChange={e => updateBook({ customStyle: e.target.value })} placeholder="Descrivi il tuo stile..." className="bg-background" />
          </div>
        )}
        <div className="space-y-2">
          <Label>Ispirazione "Scrivi come…"</Label>
          <Input value={b.writeLikeInspiration} onChange={e => updateBook({ writeLikeInspiration: e.target.value })} placeholder="es. Malcolm Gladwell" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Formato Output</Label>
          <Select value={b.outputFormat} onValueChange={v => updateBook({ outputFormat: v as any })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="structured">Documento Strutturato</SelectItem>
              <SelectItem value="json">Schema JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Struttura Capitoli</Label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={b.autoGenerateOutline}
                onCheckedChange={v => updateBook({ autoGenerateOutline: v })}
              />
              <span className="text-xs text-muted-foreground">Genera schema automaticamente</span>
            </div>
            <Button size="sm" variant="outline" onClick={addChapter}>
              <Plus className="mr-1 h-3.5 w-3.5" /> Aggiungi Capitolo
            </Button>
          </div>
        </div>
        {b.chapters.map((ch, i) => (
          <div key={i} className="flex items-start gap-2 animate-fade-in">
            <span className="mt-2.5 text-xs font-medium text-muted-foreground w-6">{i + 1}.</span>
            <Input
              value={ch.title}
              onChange={e => updateChapter(i, 'title', e.target.value)}
              placeholder="Titolo capitolo"
              className="flex-1 bg-background"
            />
            <Input
              value={ch.description}
              onChange={e => updateChapter(i, 'description', e.target.value)}
              placeholder="Breve descrizione"
              className="flex-1 bg-background"
            />
            <Button size="icon" variant="ghost" onClick={() => removeChapter(i)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={() => setGeneratedPrompt(generateBookPrompt(project))} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" /> Genera Prompt Libro
      </Button>

      <PromptOutput prompt={generatedPrompt} title={`${project.title}_prompt_libro`} />
    </div>
  );
}
