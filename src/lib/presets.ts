// src/lib/presets.ts
import type { Project } from "@/types/project";

function newId() {
  return crypto.randomUUID?.() || `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function nowISO() {
  return new Date().toISOString();
}

export function getPresets(): Project[] {
  const t = nowISO();

  const base = (name: string): Project => ({
    id: newId(),
    name,
    createdAt: t,
    updatedAt: t,
    bookPrompt: {
      title: "",
      language: "English",
      audience: "Children (4-6)",
      genre: "Children's picture book",
      tone: "Warm, playful, gentle",
      style: "Simple language, short sentences, repetition, strong visuals",
      length: "20 short chapters",
      keyThemes: "Friendship, courage, kindness",
      characters: "One child protagonist, 1-2 friendly side characters",
      setting: "Cozy neighborhood / small town",
      constraints:
        "No copyrighted characters/brands. Avoid sensitive content. Keep it age-appropriate.",
      extraNotes: "",
    },
    coverPrompt: {
      titleText: "",
      subtitleText: "",
      authorName: "",
      style: "Bright, clean, modern children's illustration",
      mood: "Friendly, inviting",
      colorPalette: "Warm pastels, high contrast for readability",
      composition:
        "Centered main character, simple background, clear space for title, strong silhouette",
      typography:
        "Large readable title, rounded playful font style (describe only, do not name copyrighted fonts)",
      constraints:
        "No logos/brands. No copyrighted characters. Keep it KDP-friendly.",
      extraNotes: "",
    },
    interiorPrompt: {
      trimSize: "8.5x8.5",
      bleed: true,
      pages: 32,
      style: "Consistent children's illustration style",
      recurringElements: "Consistent protagonist appearance across scenes",
      constraints: "No copyrighted characters/brands. Keep content safe for kids.",
      extraNotes: "",
    },
    amazonMetadata: {
      keywords: ["children's book", "picture book", "friendship", "kindness", "courage"],
      categories: ["Juvenile Fiction"],
      description:
        "A warm and playful story for young readers, filled with kindness and gentle adventure.",
      ageRange: "4-6",
      language: "English",
    },
    references: [],
  });

  const kids46 = base("Kids 4–6 — Illustrated");
  const kids79 = base("Kids 7–9 — Illustrated");
  kids79.bookPrompt.audience = "Children (7-9)";
  kids79.bookPrompt.style = "Slightly longer sentences, more plot, light humor, vivid scenes";
  kids79.bookPrompt.length = "12 chapters";

  const lowContent = base("Low Content — Journal");
  lowContent.bookPrompt.genre = "Journal / low content";
  lowContent.bookPrompt.length = "120 pages";
  lowContent.bookPrompt.style = "Minimal text; prompts for journaling; clean layout";
  lowContent.interiorPrompt.pages = 120;
  lowContent.interiorPrompt.style = "Clean minimalist interior layout prompts";

  const colorBook = base("Coloring Book — Kids");
  colorBook.bookPrompt.genre = "Coloring book";
  colorBook.bookPrompt.length = "40 pages";
  colorBook.bookPrompt.style = "Short captions + black-and-white line art prompts";
  colorBook.interiorPrompt.pages = 40;
  colorBook.interiorPrompt.style = "Line-art, high contrast, no shading, thick outlines";

  const nonfiction = base("Short Non-fiction — Guide");
  nonfiction.bookPrompt.genre = "Short non-fiction guide";
  nonfiction.bookPrompt.audience = "Adults";
  nonfiction.bookPrompt.tone = "Clear, helpful, practical";
  nonfiction.bookPrompt.length = "8 chapters";
  nonfiction.bookPrompt.style = "Structured headings, bullet points, examples, actionable steps";

  return [kids46, kids79, lowContent, colorBook, nonfiction];
}
