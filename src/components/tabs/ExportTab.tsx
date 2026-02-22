import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from "@/hooks/useProjects";
import { generateBookPrompt, generateCoverPrompt, generateInteriorPrompt, generateMetadataPack } from '@/lib/prompt-generators';
import { Download, Copy, Check, FileJson, FileText } from 'lucide-react';
import { makePack, stringifyPack, downloadTextFile, parsePack } from "@/lib/pack";

interface ExportTabProps {
  project: Project;
}

export function ExportTab({ project }: ExportTabProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  const { importProjectFromPack } = useProjects();

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

  const bookPromptText = generateBookPrompt(project);
  const coverPromptText = generateCoverPrompt(project);
  const interiorPromptText = generateInteriorPrompt(project);

  const promptsSnapshot = {
    book: bookPromptText || "",
    cover: coverPromptText || "",
    interior: interiorPromptText || "",
  };

  const downloadProjectPack = () => {
    const pack = makePack(project, promptsSnapshot);

    const safeName = (project.title || "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const json = stringifyPack(pack);
    downloadTextFile(`project_pack_${safeName}.json`, json, "application/json");
    toast({ title: "Scaricato!", description: `project_pack_${safeName}.json` });
  };

  const importProjectPackFile = async (file: File) => {
    try {
      const text = await file.text();
      const pack = parsePack(text);
      importProjectFromPack(pack);
      toast({ title: "Import completato!", description: pack.project.title || pack.project.name });
    } catch (e: any) {
      toast({
        title: "Import fallito",
        description: e?.message || "File non valido",
        variant: "destructive",
      });
    }
  };
  
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
        <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={downloadProjectPack}>
          <Download className="h-6 w-6 text-primary" />
          <span className="text-xs font-medium">Download Project Pack (.json)</span>
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
