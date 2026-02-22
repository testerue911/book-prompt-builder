export interface ChapterInfo {
  title: string;
  description: string;
}

export interface ReferenceImage {
  id: string;
  name: string;
  dataUrl: string;
  notes: string;
  tags: string[];
  isPrimary: boolean;
}

export interface AmazonMetadata {
  title: string;
  subtitle: string;
  keywords: string[];
  bisacCategory: string;
  description: string;
  bulletPoints: string[];
}

export interface BookPromptData {
  mainIdea: string;
  readerTransformation: string;
  keyPoints: string[];
  whatToAvoid: string[];
  writingStyle: string;
  customStyle: string;
  autoGenerateOutline: boolean;
  chapters: ChapterInfo[];
  writeLikeInspiration: string;
  outputFormat: 'markdown' | 'structured' | 'json';
}

export interface CoverPromptData {
  visualStyle: string;
  mood: string;
  mainElements: string;
  colorPalette: string;
  typographyStyle: string;
  trimSize: string;
  coverTitle: string;
  coverSubtitle: string;
  authorName: string;
  negativePrompt: string;
}

export interface InteriorPromptData {
  interiorType: string;
  pageSize: string;
  margins: string;
  recurringElements: string[];
  layoutStyle: string;
}

export interface Project {
  id: string;
  title: string;
  language: string;
  bookCategory: string;
  targetAudience: string;
  usp: string;
  targetLength: string;
  tone: string;
  constraints: string[];
  desiredOutput: string;
  metadata: AmazonMetadata;
  bookPrompt: BookPromptData;
  coverPrompt: CoverPromptData;
  interiorPrompt: InteriorPromptData;
  referenceImages: ReferenceImage[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROJECT: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'Progetto Senza Titolo',
  language: 'IT',
  bookCategory: '',
  targetAudience: '',
  usp: '',
  targetLength: '',
  tone: 'professional',
  constraints: ['Nessun nome protetto da copyright', 'Nessun marchio registrato', 'Solo contenuti sicuri'],
  desiredOutput: 'full chapters',
  metadata: {
    title: '',
    subtitle: '',
    keywords: [],
    bisacCategory: '',
    description: '',
    bulletPoints: [],
  },
  bookPrompt: {
    mainIdea: '',
    readerTransformation: '',
    keyPoints: [],
    whatToAvoid: [],
    writingStyle: 'professional',
    customStyle: '',
    autoGenerateOutline: true,
    chapters: [],
    writeLikeInspiration: '',
    outputFormat: 'markdown',
  },
  coverPrompt: {
    visualStyle: '',
    mood: '',
    mainElements: '',
    colorPalette: '',
    typographyStyle: '',
    trimSize: '6x9',
    coverTitle: '',
    coverSubtitle: '',
    authorName: '',
    negativePrompt: '',
  },
  interiorPrompt: {
    interiorType: '',
    pageSize: '6x9',
    margins: 'standard',
    recurringElements: [],
    layoutStyle: 'minimal',
  },
  referenceImages: [],
};
