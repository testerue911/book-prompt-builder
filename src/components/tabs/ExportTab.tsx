import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateBookPrompt, generateCoverPrompt, generateInteriorPrompt, generateMetadataPack } from '@/lib/prompt-generators';
import { Download, Copy, Check, FileJson, FileText } from 'lucide-react';

interface ExportTabProps {
  project: Project;
}

export function ExportTab({ project }: ExportTabProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Scaricato!', description: filename });
  };

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: 'Copiato!' });
    setTimeout(() => setCopied(null), 2000);
  };

  const exportJSON = () => {
    const data = { ...project, referenceImages: project.referenceImages.map(({ dataUrl, ...rest }) => ({ ...rest, dataUrl: '[base64 omesso]' })) };
    downloadFile(JSON.stringify(data, null, 2), `${project.title.replace(/\s+/g, '_')}_completo.json`);
  };

  const metadataPack = generateMetadataPack(project);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={exportJSON}>
          <FileJson className="h-6 w-6 text-primary" />
          <span className="text-xs font-medium">Esporta JSON Completo</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => downloadFile(generateBookPrompt(project), `${project.title}_libro.txt`)}>
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xs font-medium">Prompt Libro .txt</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => downloadFile(generateCoverPrompt(project), `${project.title}_copertina.txt`)}>
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xs font-medium">Prompt Copertina .txt</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => downloadFile(generateInteriorPrompt(project), `${project.title}_interno.txt`)}>
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xs font-medium">Prompt Interno .txt</span>
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Pacchetto Metadati KDP</h3>
          <Button size="sm" variant="outline" onClick={() => copyText(metadataPack, 'metadata')}>
            {copied === 'metadata' ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
            {copied === 'metadata' ? 'Copiato' : 'Copia'}
          </Button>
        </div>
        <Textarea value={metadataPack} readOnly className="min-h-[200px] bg-muted font-mono text-xs scrollbar-thin" />
      </div>
    </div>
  );
}
