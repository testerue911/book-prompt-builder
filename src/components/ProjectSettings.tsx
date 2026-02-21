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

const CATEGORIES = ['children', 'low content', 'coloring book', 'journal', 'cookbook', 'business', 'romance', 'self-help', 'fiction', 'non-fiction', 'education', 'other'];
const TONES = ['professional', 'friendly', 'humorous', 'academic', 'conversational', 'playful', 'inspirational', 'formal'];

export function ProjectSettings({ project, onChange }: ProjectSettingsProps) {
  const updateMetadata = (updates: Partial<typeof project.metadata>) => {
    onChange({ metadata: { ...project.metadata, ...updates } });
  };

  return (
    <Accordion type="multiple" defaultValue={['general', 'metadata']} className="space-y-2">
      <AccordionItem value="general" className="rounded-lg border bg-card px-4">
        <AccordionTrigger className="font-display text-sm font-semibold">General Settings</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input value={project.title} onChange={e => onChange({ title: e.target.value })} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={project.language} onValueChange={v => onChange({ language: v })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="IT">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Book Category</Label>
              <Select value={project.bookCategory} onValueChange={v => onChange({ bookCategory: v })}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={project.tone} onValueChange={v => onChange({ tone: v })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input value={project.targetAudience} onChange={e => onChange({ targetAudience: e.target.value })} placeholder="Age, interests, level..." className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Target Length</Label>
              <Input value={project.targetLength} onChange={e => onChange({ targetLength: e.target.value })} placeholder="e.g. 40,000 words / 200 pages" className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unique Selling Point (USP)</Label>
            <Textarea value={project.usp} onChange={e => onChange({ usp: e.target.value })} placeholder="What makes this book unique?" className="bg-background" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <DynamicListInput items={project.constraints} onChange={items => onChange({ constraints: items })} placeholder="Add constraint..." label="Constraints" />
            <div className="space-y-2">
              <Label>Desired Output</Label>
              <Select value={project.desiredOutput} onValueChange={v => onChange({ desiredOutput: v })}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="full chapters">Full Chapters</SelectItem>
                  <SelectItem value="exercises">Exercises</SelectItem>
                  <SelectItem value="outline + chapters">Outline + Chapters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="metadata" className="rounded-lg border bg-card px-4">
        <AccordionTrigger className="font-display text-sm font-semibold">Amazon Metadata</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Book Title</Label>
              <Input value={project.metadata.title} onChange={e => updateMetadata({ title: e.target.value })} placeholder={project.title} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={project.metadata.subtitle} onChange={e => updateMetadata({ subtitle: e.target.value })} className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>BISAC Category</Label>
            <Input value={project.metadata.bisacCategory} onChange={e => updateMetadata({ bisacCategory: e.target.value })} placeholder="e.g. JUV002000" className="bg-background" />
          </div>
          <DynamicListInput items={project.metadata.keywords} onChange={items => updateMetadata({ keywords: items })} placeholder="Add keyword (max 7)..." label="Keywords (7 max)" />
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={project.metadata.description} onChange={e => updateMetadata({ description: e.target.value })} placeholder="Book description for Amazon listing..." className="bg-background min-h-[100px]" />
          </div>
          <DynamicListInput items={project.metadata.bulletPoints} onChange={items => updateMetadata({ bulletPoints: items })} placeholder="Add bullet point..." label="Bullet Points" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
