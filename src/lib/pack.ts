// src/lib/pack.ts
import type { Project } from "@/types/project";
import { APP_VERSION } from "@/lib/version";

export type PromptsSnapshot = {
  book: string;
  cover: string;
  interior: string;
};

export type ProjectPackV1 = {
  schemaVersion: 1;
  appVersion: string;
  exportedAt: string; // ISO
  project: Project;
  promptsSnapshot: PromptsSnapshot;
};

export const PACK_SCHEMA_VERSION = 1 as const;

export function makePack(project: Project, promptsSnapshot: PromptsSnapshot): ProjectPackV1 {
  return {
    schemaVersion: PACK_SCHEMA_VERSION,
    appVersion: String(APP_VERSION || "dev"),
    exportedAt: new Date().toISOString(),
    project,
    promptsSnapshot,
  };
}

export function stringifyPack(pack: ProjectPackV1): string {
  return JSON.stringify(pack, null, 2);
}

export function parsePack(json: string): ProjectPackV1 {
  let obj: any;
  try {
    obj = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON file.");
  }

  if (!obj || obj.schemaVersion !== 1) {
    throw new Error("Unsupported pack schemaVersion. Expected schemaVersion = 1.");
  }

  if (!obj.project || !obj.project.id || !obj.project.name) {
    throw new Error("Invalid pack: missing project fields.");
  }

  if (!obj.promptsSnapshot) {
    // Non blocchiamo import se manca snapshot (compatibilità), ma lo creiamo vuoto.
    obj.promptsSnapshot = { book: "", cover: "", interior: "" };
  }

  return obj as ProjectPackV1;
}

export function downloadTextFile(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Collision-safe: se l'ID già esiste, ne genera uno nuovo.
export function ensureUniqueProjectId(project: Project, existingIds: Set<string>): Project {
  if (!existingIds.has(project.id)) return project;

  const newId = crypto.randomUUID?.() || `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return {
    ...project,
    id: newId,
    name: `${project.name} (imported)`,
    updatedAt: new Date().toISOString(),
  };
}
