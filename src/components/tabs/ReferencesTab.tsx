import { useRef, useState } from 'react';
import { Project, ReferenceImage } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DynamicListInput } from '@/components/DynamicListInput';
import { Upload, Star, StarOff, Trash2, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferencesTabProps {
  project: Project;
  onChange: (updates: Partial<Project>) => void;
}

export function ReferencesTab({ project, onChange }: ReferencesTabProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const addImages = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const newImg: ReferenceImage = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          name: file.name,
          dataUrl: reader.result as string,
          notes: '',
          tags: [],
          isPrimary: false,
        };
        onChange({ referenceImages: [...project.referenceImages, newImg] });
      };
      reader.readAsDataURL(file);
    });
    toast({ title: 'Immagini aggiunte!' });
  };

  const updateImage = (id: string, updates: Partial<ReferenceImage>) => {
    onChange({
      referenceImages: project.referenceImages.map(img =>
        img.id === id ? { ...img, ...updates } : img
      ),
    });
  };

  const removeImage = (id: string) => {
    onChange({ referenceImages: project.referenceImages.filter(img => img.id !== id) });
    toast({ title: 'Immagine rimossa.' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addImages(e.dataTransfer.files);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver ? 'border-primary bg-accent' : 'border-border'
        }`}
      >
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Trascina e rilascia le immagini qui, oppure</p>
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" /> Scegli File
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && addImages(e.target.files)}
        />
      </div>

      {project.referenceImages.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">Nessuna immagine di riferimento. Carica immagini per includerle nei tuoi prompt.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {project.referenceImages.map(img => (
          <div key={img.id} className="animate-fade-in rounded-lg border bg-card overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
              {img.isPrimary && (
                <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">Principale</Badge>
              )}
            </div>
            <div className="space-y-3 p-3">
              <Input
                value={img.name}
                onChange={e => updateImage(img.id, { name: e.target.value })}
                className="text-xs font-medium bg-background"
              />
              <div className="space-y-1">
                <Label className="text-xs">Note</Label>
                <Textarea
                  value={img.notes}
                  onChange={e => updateImage(img.id, { notes: e.target.value })}
                  placeholder="Cosa replicare da questa immagine..."
                  className="text-xs bg-background min-h-[60px]"
                />
              </div>
              <DynamicListInput
                items={img.tags}
                onChange={tags => updateImage(img.id, { tags })}
                placeholder="Aggiungi tag..."
                label="Tag"
                suggestions={['Stile', 'Colori', 'Layout', 'Tipografia', 'Illustrazione']}
              />
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant={img.isPrimary ? 'default' : 'outline'}
                  onClick={() => updateImage(img.id, { isPrimary: !img.isPrimary })}
                  className="flex-1 text-xs"
                >
                  {img.isPrimary ? <Star className="mr-1 h-3 w-3" /> : <StarOff className="mr-1 h-3 w-3" />}
                  {img.isPrimary ? 'Principale' : 'Imposta Principale'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => removeImage(img.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
