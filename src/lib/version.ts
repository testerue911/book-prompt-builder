// src/lib/version.ts
// Vite espone import.meta.env. Se non hai VITE_APP_VERSION, fallback su "dev".
export const APP_VERSION =
  (import.meta as any)?.env?.VITE_APP_VERSION ||
  (import.meta as any)?.env?.VITE_VERCEL_GIT_COMMIT_SHA ||
  "dev";
