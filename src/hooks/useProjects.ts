import { useState, useEffect, useCallback } from 'react';
import { Project, DEFAULT_PROJECT } from '@/types/project';
import type { ProjectPackV1 } from "@/lib/pack";
import { ensureUniqueProjectId } from "@/lib/pack";

const STORAGE_KEY = 'kdp-prompt-builder-projects';
const ACTIVE_KEY = 'kdp-prompt-builder-active';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem(ACTIVE_KEY, activeProjectId);
    }
  }, [activeProjectId]);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  const createProject = useCallback((overrides?: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...DEFAULT_PROJECT,
      ...overrides,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
  }, [activeProjectId]);

  const duplicateProject = useCallback((id: string) => {
    const source = projects.find(p => p.id === id);
    if (!source) return;
    const now = new Date().toISOString();
    const dup: Project = {
      ...source,
      id: generateId(),
      title: `${source.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    setProjects(prev => [dup, ...prev]);
    setActiveProjectId(dup.id);
  }, [projects]);
  
  const importProjectFromPack = useCallback((pack: ProjectPackV1) => {
    setProjects((prev) => {
      const ids = new Set(prev.map((p) => p.id));
      const incoming = ensureUniqueProjectId(pack.project, ids);

      // Se manca qualche campo (pack vecchi), garantiamo coerenza minima
      const now = new Date().toISOString();
      const normalized: Project = {
        ...DEFAULT_PROJECT,
        ...incoming,
        createdAt: incoming.createdAt || now,
        updatedAt: now,
      };

      setActiveProjectId(normalized.id);
      return [normalized, ...prev];
    });
  }, []);
  
  
  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    importProjectFromPack,
  };
}
