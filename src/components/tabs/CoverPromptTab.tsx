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

const VISUAL_STYLES = ['watercolor', '3D', 'flat', 'manga', 'minimal', 'photorealistic', 'vintage', 'abstract', 'hand-drawn'];
const MOODS = ['calm', 'energetic', 'dark', 'playful', 'mysterious', 'romantic', 'professional', 'whimsical'];
const TRIM_SIZES = ['5x8', '5.25x8', '5.5x8.5', '6x9', '7x10', '8x10', '8.5x8.5', '8.5x11'];

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
          <Label>Visual Style</Label>
          <Select value={c.visualStyle} onValueChange={v => updateCover({ visualStyle: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Select style" /></SelectTrigger>
            <SelectContent>
              {VISUAL_STYLES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Mood</Label>
          <Select value={c.mood} onValueChange={v => updateCover({ mood: v })}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Select mood" /></SelectTrigger>
            <SelectContent>
              {MOODS.map(m => <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>KDP Trim Size</Label>
          <Select value={c.trimSize} onValueChange={v => updateCover({ trimSize: v })}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TRIM_SIZES.map(s => <SelectItem key={s} value={s}>{s}"</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Main Elements</Label>
          <Textarea value={c.mainElements} onChange={e => updateCover({ mainElements: e.target.value })} placeholder="Describe the main visual elements..." className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Color Palette</Label>
          <Textarea value={c.colorPalette} onChange={e => updateCover({ colorPalette: e.target.value })} placeholder="e.g. Navy blue, gold accents, cream..." className="bg-background" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Typography Style</Label>
        <Input value={c.typographyStyle} onChange={e => updateCover({ typographyStyle: e.target.value })} placeholder="e.g. Bold serif title, elegant script subtitle" className="bg-background" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Cover Title</Label>
          <Input value={c.coverTitle} onChange={e => updateCover({ coverTitle: e.target.value })} placeholder={project.title} className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input value={c.coverSubtitle} onChange={e => updateCover({ coverSubtitle: e.target.value })} placeholder="Optional subtitle" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label>Author Name</Label>
          <Input value={c.authorName} onChange={e => updateCover({ authorName: e.target.value })} placeholder="Author display name" className="bg-background" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Negative Prompt (What to Avoid)</Label>
        <Textarea value={c.negativePrompt} onChange={e => updateCover({ negativePrompt: e.target.value })} placeholder="e.g. No text overlay on faces, no blurry elements..." className="bg-background" />
      </div>

      <Button onClick={() => setGeneratedPrompt(generateCoverPrompt(project))} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" /> Generate Cover Prompt
      </Button>

      <PromptOutput prompt={generatedPrompt} title={`${project.title}_cover_prompt`} />
    </div>
  );
}
