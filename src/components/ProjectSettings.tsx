import { Project } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicListInput } from '@/components/DynamicListInput';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProjectSettingsProps {
  project: Project;
  onChange: (updates: Partial<Project>) => void;
}

const CATEGORIES = [
  { value: 'children', label: 'Bambini' },
  { value: 'low content', label: 'Low Content' },
  { value: 'coloring book', label: 'Libro da Colorare' },
  { value: 'journal', label: 'Diario / Agenda' },
  { value: 'cookbook', label: 'Ricettario' },
  { value: 'business', label: 'Business' },
  { value: 'romance', label: 'Romanzo' },
  { value: 'self-help', label: 'Crescita Personale' },
  { value: 'fiction', label: 'Narrativa' },
  { value: 'non-fiction', label: 'Saggistica' },
  { value: 'education', label: 'Educazione' },
  { value: 'other', label: 'Altro' },
];

const TONES = [
  { value: 'professional', label: 'Professionale' },
  { value: 'friendly', label: 'Amichevole' },
  { value: 'humorous', label: 'Umoristico' },
  { value: 'academic', label: 'Accademico' },
  { value: 'conversational', label: 'Colloquiale' },
  { value: 'playful', label: 'Giocoso' },
  { value: 'inspirational', label: 'Ispirazionale' },
  { value: 'formal', label: 'Formale' },
];

export function ProjectSettings({ project, onChange }: ProjectSettingsProps) {
  const updateMetadata = (updates: Partial<typeof project.metadata>) => {
    onChange({ metadata: { ...project.metadata, ...updates } });
  };

  return (
    <Accordion type="multiple" defaultValue={['general', 'metadata']} className="space-y-2">
      <AccordionItem value="general" className="rounded-lg border bg-card px-4">
        <AccordionTrigger className="font-display text-sm font-semibold">Impostazioni Generali</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Titolo Progetto</Label>
              <Input value={project.title} onChange={e => onChange({ title: e.target.value })} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Lingua</Label>
              <Select value={project.language} onValueChange={v => onChange({ language: v })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">Inglese</SelectItem>
                  <SelectItem value="IT">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoria Libro</Label>
              <Select value={project.bookCategory} onValueChange={v => onChange({ bookCategory: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Seleziona categoria" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tono</Label>
              <Select value={project.tone} onValueChange={v => onChange({ tone: v })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Pubblico Target</Label>
              <Input value={project.targetAudience} onChange={e => onChange({ targetAudience: e.target.value })} placeholder="Età, interessi, livello..." className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Lunghezza Obiettivo</Label>
              <Input value={project.targetLength} onChange={e => onChange({ targetLength: e.target.value })} placeholder="es. 40.000 parole / 200 pagine" className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Punto di Forza Unico (USP)</Label>
            <Textarea value={project.usp} onChange={e => onChange({ usp: e.target.value })} placeholder="Cosa rende unico questo libro?" className="bg-background" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <DynamicListInput
              items={project.constraints}
              onChange={items => onChange({ constraints: items })}
              placeholder="Aggiungi vincolo..."
              label="Vincoli"
              suggestions={['Nessun nome protetto da copyright', 'Nessun marchio registrato', 'Solo contenuti sicuri', 'Linguaggio appropriato per l\'età']}
            />
            <div className="space-y-2">
              <Label>Output Desiderato</Label>
              <Select value={project.desiredOutput} onValueChange={v => onChange({ desiredOutput: v })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="outline">Schema</SelectItem>
                  <SelectItem value="full chapters">Capitoli Completi</SelectItem>
                  <SelectItem value="exercises">Esercizi</SelectItem>
                  <SelectItem value="outline + chapters">Schema + Capitoli</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="metadata" className="rounded-lg border bg-card px-4">
        <AccordionTrigger className="font-display text-sm font-semibold">Metadati Amazon</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Titolo Libro</Label>
              <Input value={project.metadata.title} onChange={e => updateMetadata({ title: e.target.value })} placeholder={project.title} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Sottotitolo</Label>
              <Input value={project.metadata.subtitle} onChange={e => updateMetadata({ subtitle: e.target.value })} className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Categoria BISAC</Label>
            <Input value={project.metadata.bisacCategory} onChange={e => updateMetadata({ bisacCategory: e.target.value })} placeholder="es. JUV002000" className="bg-background" />
          </div>
          <DynamicListInput items={project.metadata.keywords} onChange={items => updateMetadata({ keywords: items })} placeholder="Aggiungi parola chiave (max 7)..." label="Parole Chiave (max 7)" />
          <div className="space-y-2">
            <Label>Descrizione</Label>
            <Textarea value={project.metadata.description} onChange={e => updateMetadata({ description: e.target.value })} placeholder="Descrizione del libro per l'inserzione Amazon..." className="bg-background min-h-[100px]" />
          </div>
          <DynamicListInput items={project.metadata.bulletPoints} onChange={items => updateMetadata({ bulletPoints: items })} placeholder="Aggiungi punto elenco..." label="Punti Elenco" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
