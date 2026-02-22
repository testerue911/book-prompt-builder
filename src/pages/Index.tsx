import { useState, useEffect, useCallback } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectSidebar } from '@/components/ProjectSidebar';
import { ProjectSettings } from '@/components/ProjectSettings';
import { BookPromptTab } from '@/components/tabs/BookPromptTab';
import { CoverPromptTab } from '@/components/tabs/CoverPromptTab';
import { InteriorPromptTab } from '@/components/tabs/InteriorPromptTab';
import { ReferencesTab } from '@/components/tabs/ReferencesTab';
import { ExportTab } from '@/components/tabs/ExportTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { BookOpen, Palette, Layout, Image, Download, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
  } = useProjects();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kdp-dark-mode') === 'true';
    }
    return false;
  });
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('kdp-dark-mode', String(darkMode));
  }, [darkMode]);

  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const handleProjectChange = useCallback((updates: Partial<Project>) => {
    if (!activeProjectId) return;
    updateProject(activeProjectId, updates);
    if (saveTimer) clearTimeout(saveTimer);
    const timer = setTimeout(() => {
      toast({ title: '💾 Salvato', description: 'Modifiche salvate automaticamente.' });
    }, 1500);
    setSaveTimer(timer);
  }, [activeProjectId, updateProject, saveTimer, toast]);

  const handleRename = (id: string, title: string) => {
    updateProject(id, { title });
    toast({ title: 'Rinominato!' });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-3 top-3 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div className={`fixed inset-y-0 left-0 z-40 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ProjectSidebar
          projects={projects}
          activeProjectId={activeProjectId}
          onSelect={id => { setActiveProjectId(id); setSidebarOpen(false); }}
          onCreate={createProject}
          onDelete={deleteProject}
          onDuplicate={duplicateProject}
          onRename={handleRename}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!activeProject ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4 animate-fade-in max-w-md">
              <BookOpen className="mx-auto h-16 w-16 text-primary/40" />
              <h1 className="font-display text-3xl font-bold text-foreground">Amazon Book Prompt Builder</h1>
              <p className="text-muted-foreground">Crea prompt AI strutturati per i tuoi libri Amazon KDP. Inizia creando un nuovo progetto o selezionando un modello.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => createProject()}>
                  Nuovo Progetto
                </Button>
                <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  Modalità {darkMode ? 'Chiara' : 'Scura'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 lg:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{activeProject.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {activeProject.bookCategory || 'Nessuna categoria'} · {activeProject.language} · Ultimo aggiornamento {new Date(activeProject.updatedAt).toLocaleDateString('it-IT')}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            <Tabs defaultValue="settings" className="space-y-4">
              <TabsList className="flex-wrap h-auto gap-1 bg-muted p-1">
                <TabsTrigger value="settings" className="gap-1.5 text-xs">
                  <Settings className="h-3.5 w-3.5" /> Impostazioni
                </TabsTrigger>
                <TabsTrigger value="book" className="gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5" /> Prompt Libro
                </TabsTrigger>
                <TabsTrigger value="cover" className="gap-1.5 text-xs">
                  <Palette className="h-3.5 w-3.5" /> Prompt Copertina
                </TabsTrigger>
                <TabsTrigger value="interior" className="gap-1.5 text-xs">
                  <Layout className="h-3.5 w-3.5" /> Prompt Interno
                </TabsTrigger>
                <TabsTrigger value="references" className="gap-1.5 text-xs">
                  <Image className="h-3.5 w-3.5" /> Riferimenti
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Esporta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings">
                <ProjectSettings project={activeProject} onChange={handleProjectChange} />
              </TabsContent>
              <TabsContent value="book">
                <BookPromptTab project={activeProject} onChange={handleProjectChange} />
              </TabsContent>
              <TabsContent value="cover">
                <CoverPromptTab project={activeProject} onChange={handleProjectChange} />
              </TabsContent>
              <TabsContent value="interior">
                <InteriorPromptTab project={activeProject} onChange={handleProjectChange} />
              </TabsContent>
              <TabsContent value="references">
                <ReferencesTab project={activeProject} onChange={handleProjectChange} />
              </TabsContent>
              <TabsContent value="export">
                <ExportTab project={activeProject} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
