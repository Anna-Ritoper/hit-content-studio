/**
 * NO EM DASHES (U+2014) OR EN DASHES (U+2013) ANYWHERE IN THE APP.
 * Use colons (:), pipes (|), commas, or line breaks instead.
 */

import { Timestamp } from 'firebase/firestore';
import { VoiceProfile, StyleRule } from './types';

/**
 * Hardcoded style rules for the application.
 */
export const HARDCODED_STYLE_RULES: StyleRule[] = [
  {
    id: 'rule-1',
    title: 'Pas de tirets longs',
    description: 'Jamais de tirets longs dans les textes',
    category: 'Formatage',
    icon: '🚫',
    isLocked: true,
  },
  {
    id: 'rule-2',
    title: 'Ton direct et chaleureux',
    description: 'Pas de jargon corporate, phrases courtes',
    category: 'Ton',
    icon: '💬',
    isLocked: true,
  },
  {
    id: 'rule-3',
    title: 'Français naturel',
    description: 'Français parlé, pas de formules figées',
    category: 'Langue',
    icon: '🇫🇷',
    isLocked: true,
  },
  {
    id: 'rule-4',
    title: 'Phrases interdites',
    description: "Pas de 'n'hésitez pas', 'je reviens vers vous', 'Si ça résonne'",
    category: 'Langue',
    icon: '✋',
    isLocked: true,
  },
  {
    id: 'rule-5',
    title: 'Hashtags groupés',
    description: 'Tous les hashtags à la fin, jamais dans le texte',
    category: 'Formatage',
    icon: '#',
    isLocked: true,
  },
  {
    id: 'rule-6',
    title: 'Exclamations limitées',
    description: 'Maximum 1-2 par post',
    category: 'Formatage',
    icon: '❗',
    isLocked: true,
  },
];

/**
 * Default voice profile for Simone Whale.
 */
export const SIMONE_WHALE_DEFAULT: VoiceProfile = {
  id: 'simone-whale-default',
  name: 'Simone Whale',
  role: 'Directrice de la Chaire Management in Innovative Health',
  languages: ['FR', 'EN'],
  avatarColor: '#6B1E2E',
  styleTags: ['Strategic', 'Visionary', 'Empathetic', 'Data-driven'],
  structurePattern: ['Hook', 'Context', 'Thematic Insight', 'Call to Action'],
  formalityScore: 7,
  emojiUsage: 'minimal',
  languageNotes: 'Uses professional yet accessible language. Focuses on the strategic implications of healthcare innovation.',
  sampleSentence: "L'innovation en santé n'est pas seulement une question de technologie, c'est un levier stratégique pour l'avenir de nos institutions.",
  systemPromptFragment: "You are Simone Whale, Director of the EDHEC Management in Innovative Health Chair. Your tone is strategic, visionary, and empathetic. You focus on the human and organizational impact of digital health and AI.",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

/**
 * Global content guidelines for all AI-generated text across the application.
 * These rules ensure a consistent, human, and high-quality tone.
 */
export const CONTENT_GUIDELINES = {
  textFormatting: [
    "NEVER use em dashes or en dashes : use colons, commas, or separate sentences instead.",
    "Use simple punctuation: periods, commas, colons, question marks.",
    "Avoid complex or decorative punctuation marks."
  ],
  humanization: [
    "No corporate jargon or buzzwords.",
    "No 'n'hésitez pas à' or 'je reviens vers vous'.",
    "No phrases like 'Si ça résonne' or overly casual filler.",
    "Short punchy sentences preferred.",
    "Direct and warm tone, not formal or stiff.",
    "No excessive exclamation marks (max 1-2 per post).",
    "No AI-sounding phrases like 'Il est important de noter que' or 'Dans le cadre de'.",
    "French posts: natural spoken French, not textbook French.",
    "Never start with 'Cher(e)s' or overly formal greetings.",
    "Hashtags grouped at end, not scattered throughout."
  ]
};

/**
 * A formatted string of the guidelines to be used in AI system instructions.
 */
export const SYSTEM_PROMPT_GUIDELINES = `
CRITICAL TEXT FORMATTING RULES:
${CONTENT_GUIDELINES.textFormatting.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}

HUMANIZATION & TONE RULES:
${CONTENT_GUIDELINES.humanization.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}
`;

/**
 * Formats an array of StyleRules into a string for AI prompts.
 */
export function formatStyleRules(rules: StyleRule[]): string {
  if (rules.length === 0) return '';
  
  return `
ADDITIONAL STYLE RULES FROM STYLE GUIDE:
${rules.map((rule, i) => `${i + 1}. [${rule.category}] ${rule.title}: ${rule.description}`).join('\n')}
`;
}

/**
 * Post-processing function to clean up common AI artifacts.
 */
export function cleanGeneratedText(text: string): string {
  return text
    .replace(/[\u2014\u2013]/g, ', ') // Replace em/en dashes with commas
    .replace(/\s+/g, ' ')   // Normalize whitespace
    .trim();
}
