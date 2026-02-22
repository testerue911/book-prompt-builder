import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptOutputProps {
  prompt: string;
  title: string;
}

export function PromptOutput({ prompt, title }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({ title: 'Copiato!', description: 'Prompt copiato negli appunti.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (ext: 'txt' | 'md') => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Scaricato!', description: `Salvato come file .${ext}.` });
  };

  if (!prompt) return null;

  return (
    <div className="animate-fade-in space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-semibold text-foreground">Prompt Generato</h4>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
            {copied ? 'Copiato' : 'Copia'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload('txt')}>
            <Download className="mr-1 h-3.5 w-3.5" />.txt
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload('md')}>
            <Download className="mr-1 h-3.5 w-3.5" />.md
          </Button>
        </div>
      </div>
      <Textarea
        value={prompt}
        readOnly
        className="min-h-[300px] bg-muted font-mono text-xs leading-relaxed scrollbar-thin"
      />
    </div>
  );
}
