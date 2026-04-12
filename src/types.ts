import { Timestamp } from 'firebase/firestore';

export type Language = 'FR' | 'EN';
export type Platform = 'LinkedIn' | 'WhatsApp';
export type PostStatus = 'A rediger' | 'Brouillon' | 'Pret' | 'Publie';
export type EmojiUsage = 'none' | 'minimal' | 'moderate' | 'heavy';
export type Cible = 'Professionnels de sante' | 'Decideurs' | 'Etudiants' | 'Grand public' | 'Partenaires' | 'Academiques';
export type StyleCategory = 'Formatage' | 'Ton' | 'Langue' | 'Contenu' | 'Autre';

export interface StyleRule {
  id: string;
  title: string;
  description: string;
  category: StyleCategory;
  icon: string;
  isLocked: boolean;
  createdAt?: Timestamp;
}

export interface VoiceProfile {
  id: string;
  name: string;
  role: string;
  languages: Language[];
  avatarColor: string;
  styleTags: string[];
  structurePattern: string[];
  formalityScore: number;
  emojiUsage: EmojiUsage;
  languageNotes: string;
  sampleSentence: string;
  systemPromptFragment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CalendarEntry {
  id: string;
  date: Timestamp;
  voiceProfileId: string;
  voiceName: string;
  avatarColor?: string;
  platform: Platform;
  language: Language | 'FR+EN';
  theme: string;
  topic: string;
  status: PostStatus;
  draftId?: string;
  link?: string;
  linkedinUrl?: string;
  createdAt: Timestamp;
}

export interface Draft {
  id: string;
  voiceProfileId: string;
  voiceName: string;
  platform: Platform;
  language: Language | 'FR+EN';
  contentType: string;
  topic: string;
  stats: string;
  generatedText: string;
  editedText: string;
  status: PostStatus;
  calendarEntryId?: string;
  visualSvg?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HashtagSet {
  id: string;
  name: string;
  hashtags: string[];
}
