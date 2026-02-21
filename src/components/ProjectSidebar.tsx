import { useState } from 'react';
import { Project } from '@/types/project';
import { TEMPLATES } from '@/data/templates';
import { Plus, Search, Copy, Trash2, BookOpen, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ProjectSidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  onCreate: (overrides?: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export function ProjectSidebar({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
  onDelete,
  onDuplicate,
  onRename,
}: ProjectSidebarProps) {
  const [search, setSearch] = useState('');
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { toast } = useToast();

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => onCreate();
  const handleTemplate = (index: number) => {
    const t = TEMPLATES[index];
    onCreate(t.data);
    setTemplateOpen(false);
    toast({ title: 'Template loaded', description: `"${t.name}" template applied.` });
  };

  const startRename = (p: Project) => {
    setEditingId(p.id);
    setEditTitle(p.title);
  };

  const finishRename = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border p-4">
        <BookOpen className="h-5 w-5 text-sidebar-primary" />
        <h2 className="font-display text-lg font-semibold text-sidebar-primary">KDP Builder</h2>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="h-8 bg-sidebar-accent pl-8 text-xs text-sidebar-accent-foreground placeholder:text-muted-foreground border-sidebar-border"
          />
        </div>
      </div>

      <div className="flex gap-1.5 px-3 pb-3">
        <Button
          size="sm"
          onClick={handleCreate}
          className="flex-1 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 text-xs"
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> New
        </Button>
        <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent text-xs">
              Templates
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Start from Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleTemplate(i)}
                  className="rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                >
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.description}</div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            {projects.length === 0 ? 'Create your first project!' : 'No projects found.'}
          </p>
        )}
        {filtered.map(p => (
          <div
            key={p.id}
            className={`group mb-1 flex items-center gap-1 rounded-md px-2.5 py-2 text-sm cursor-pointer transition-colors ${
              p.id === activeProjectId
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
            onClick={() => onSelect(p.id)}
          >
            <div className="flex-1 min-w-0">
              {editingId === p.id ? (
                <Input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={finishRename}
                  onKeyDown={e => e.key === 'Enter' && finishRename()}
                  autoFocus
                  className="h-6 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground"
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <>
                  <div className="truncate text-xs font-medium">{p.title}</div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {p.bookCategory || 'No category'} · {p.language}
                  </div>
                </>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <button className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-sidebar-accent">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => startRename(p)}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { onDuplicate(p.id); toast({ title: 'Duplicated!' }); }}>
                  <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => { onDelete(p.id); toast({ title: 'Deleted!' }); }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
