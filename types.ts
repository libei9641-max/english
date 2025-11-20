// Enums
export enum ViewState {
  HOME = 'HOME',
  LOADING = 'LOADING',
  SCENARIO = 'SCENARIO',
  ROLEPLAY = 'ROLEPLAY',
  SETTINGS = 'SETTINGS'
}

export enum Difficulty {
  BEGINNER = 'Beginner (A1-A2)',
  INTERMEDIATE = 'Intermediate (B1-B2)',
  ADVANCED = 'Advanced (C1-C2)'
}

// Data Models
export interface DialogueLine {
  speaker: string;
  text: string;
  translation: string;
  audioSpeed?: number;
}

export interface Vocabulary {
  word: string;
  ipa: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  example_translation: string;
}

export interface ScenarioData {
  id: string;
  topic_cn: string;
  topic_en: string;
  difficulty: string;
  dialogues: DialogueLine[];
  vocabulary: Vocabulary[];
  quiz: {
    question: string;
    answer: string;
    context: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

// Props
export interface IconProps {
  className?: string;
  size?: number;
}