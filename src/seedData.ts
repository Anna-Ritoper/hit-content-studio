import { Timestamp } from 'firebase/firestore';
import type { VoiceProfile } from './types';

const VOICES_FLAG = 'voicesSeeded';
const CONTEXT_FLAG = 'contextSeeded';
const VOICES_KEY = 'voiceProfiles';
const CONTEXT_KEY = 'contextLibrary';

type SeedVoice = {
  id: string;
  name: string;
  title: string;
  tags: string[];
  tone: string;
  samplePosts: string[];
};

const SEED_VOICES: SeedVoice[] = [
  {
    id: 'seed-simone-whale',
    name: 'Simone Whale',
    title: 'Chair Manager, Management in Innovative Health',
    tags: ['Strategic', 'Visionary', 'Empathetic', 'Community-minded'],
    tone: "Warm, authoritative, community-minded. Opens with a hook (bold stat, question, or personal observation). Uses emojis as structural markers, never decorative. Short punchy paragraphs. Ends with CTA + link. Tags collaborators. Hashtags grouped at end. In English: more formal, strategic framing. In French: conversational, uses 'on' over 'nous', direct address.",
    samplePosts: [
      "Day 1 of MedInTechs in the books! Come see us at stand C21 if you'd like to learn more about our portfolio of training certificates.",
      "AI is reshaping healthcare, but its promise still outpaces its reality.",
      "Un chiffre du Barometre Sante Connectee m'a marque : 54% des Francais utilisent deja ou seraient prets a utiliser l'IA generative dans le cadre de leur sante."
    ],
  },
  {
    id: 'seed-loick-menvielle',
    name: 'Loick Menvielle',
    title: 'Chair Director, Professor of Digital Health Innovation',
    tags: ['Academic', 'Thought leader', 'Reflective', 'Authoritative'],
    tone: "Professorial, reflective. Uses 'a mon sens' and personal commentary. Longer posts like mini-essays. Opens with a question or observation. Develops an argument with data. Adds personal take. Ends with reflection, rarely a hard CTA. Comments with substantive observations.",
    samplePosts: [
      "En cette Journee des droits des femmes, penser que l'acces a la medecine, meme en France, est reellement egal pour toutes reste un leurre. De nombreux progres restent a accomplir, tant dans la qualite de la prise en charge que dans le developpement d'une veritable litteratie en sante."
    ],
  },
  {
    id: 'seed-bing-bai',
    name: 'Bing Bai',
    title: 'Research Engineer, Ph.D. in Consumer Psychology',
    tags: ['Data-driven', 'Neutral', 'Clean', 'Research-focused'],
    tone: "Neutral, data-first. Presents statistics cleanly without editorializing. Never ends with engagement questions. Lets the data speak. Opens with stat-driven headline. Presents 2-3 key data points with arrows. Brief contextual paragraph. Links to barometre. Tags team members. Dataviz credit to Datagora.",
    samplePosts: [
      "Sante connectee et inegalites d'acces : les femmes plus exposees. 63% des femmes declarent avoir un acces difficile a un medecin specialiste (vs 56% en moyenne). 43% des femmes rencontrent des difficultes d'acces a un medecin generaliste (vs 38% en moyenne). Rappelons-le : l'innovation en sante doit aussi etre un levier d'equite."
    ],
  },
  {
    id: 'seed-deborah-halimi-gerbi',
    name: 'Deborah Halimi Gerbi',
    title: 'HIT Certificates',
    tags: ['Promotional', 'Direct', 'Certificates-focused', 'Accessible'],
    tone: "Direct, promotional but not pushy. Focuses on HIT certificate programmes. Short posts with clear value proposition. Links to registration or info pages. Rewrites AI drafts in her own voice, so generate as a starting point.",
    samplePosts: [],
  },
  {
    id: 'seed-corinne',
    name: 'Corinne',
    title: 'HIT Chair Team',
    tags: ['Informative', 'Network-focused', 'Collaborative'],
    tone: "Informative, focuses on EDHEC network, alumni experiences, collaboration opportunities. Limited reference posts. Use Simone's profile as baseline, adjust toward network/collaboration focus.",
    samplePosts: [],
  },
];

const PALETTE = ['#6B1E2E', '#1A1F3C', '#2A7D6B', '#D4614A', '#374151'];

function toVoiceProfile(v: SeedVoice, idx: number): VoiceProfile {
  const now = Timestamp.now();
  return {
    id: v.id,
    name: v.name,
    role: v.title,
    languages: ['FR', 'EN'],
    avatarColor: PALETTE[idx % PALETTE.length],
    styleTags: v.tags,
    structurePattern: ['Hook', 'Context', 'Insight', 'CTA'],
    formalityScore: 6,
    emojiUsage: 'minimal',
    languageNotes: v.tone,
    sampleSentence: v.samplePosts[0] || '',
    systemPromptFragment: `You are ${v.name}, ${v.title}. ${v.tone}${v.samplePosts.length ? ' Sample posts for reference: ' + v.samplePosts.map(p => `"${p}"`).join(' | ') : ''}`,
    createdAt: now,
    updatedAt: now,
  };
}

export function seedVoiceProfiles() {
  try {
    if (localStorage.getItem(VOICES_FLAG) === '1') return;
    const profiles = SEED_VOICES.map((v, i) => toVoiceProfile(v, i));
    localStorage.setItem(VOICES_KEY, JSON.stringify(profiles));
    localStorage.setItem(VOICES_FLAG, '1');
  } catch (e) {
    console.error('seedVoiceProfiles failed', e);
  }
}

const SEED_CONTEXT = [
  {
    id: 'seed-ctx-barometre',
    title: 'Barometre Ipsos x EDHEC 2026 : Chiffres cles',
    content: "Source: Ipsos, 1000 Francais 18+, 21-24 octobre 2025 (3e vague). Acces aux soins: 56% en difficulte specialiste, 38% generaliste. Femmes: 63%/43%. Zone rurale: 70%/47%. Info sante connectee: 29% mal informes (65-74 ans, rural), 41% ni bien ni mal, 31% bien informes (25-34 ans, CSP+). 7/10 prets a y recourir sur recommandation medecin. Avantages percus: rapidite 41%, praticite 36%, deserts medicaux 34%, autonomie 30%. Craintes: cyberattaques 51%, confidentialite 48%, autodiagnostics incorrects 47%. IA: 74% utilisent/envisagent IA quotidien, 54% pour sante. Motifs: symptomes 58%, traitements 41%, conseils generaux 39%. Confiance IA diagnostic: 59% oui. 94% veulent etre informes si IA utilisee. 86% partageraient donnees avec medecin.",
    active: true,
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'seed-ctx-certificats',
    title: 'Certificats HIT : Programmes',
    content: "La Chaire propose plusieurs certificats: 1) Strategie et Leadership en Sante (vision strategique, transformation systeme, dirige par Loick Menvielle). 2) Data and AI in Healthcare (IA et data dans les parcours de soins, intervenant Pierre-Yves Brossard). 3) Valeur, Financement et Gestion financiere des systemes de Sante. Public: professionnels de sante, cadres, entrepreneurs healthtech, consultants. Eligible CPF. Sites: health.edhec.edu / sante.edhec.edu",
    active: true,
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'seed-ctx-chaire',
    title: 'Chaire HIT : Identite et missions',
    content: "Chaire Management in Innovative Health (HIT) de l'EDHEC Business School, dirigee par Pr. Loick Menvielle. Missions: former leaders transformation sante, recherche appliquee, ecosysteme partenaires. Collaboration Ipsos (Barometre 3 vagues), Datagora (dataviz). Equipe: Loick Menvielle (directeur), Simone Whale (manager), Bing Bai (ingenieur recherche), Deborah Halimi Gerbi (certificats), Corinne, Arielle Cohen Tanugi-Carresse. Evenements: MedInTechs, webinaires Webikeo.",
    active: true,
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'seed-ctx-regles',
    title: 'Regles editoriales LinkedIn',
    content: "Pas de tirets longs. Ton direct et chaleureux. Francais naturel, pas de jargon. Hashtags groupes en fin de post (5-8 max). Emojis structurels, pas decoratifs. Max 2 exclamations par post. Toujours taguer les collaborateurs. Lien ou CTA en fin de post. Phrases interdites: N'hesitez pas a, Je suis ravi.e de, Force est de constater que.",
    active: true,
    dateAdded: new Date().toISOString(),
  },
];

export function seedContextLibrary() {
  try {
    if (localStorage.getItem(CONTEXT_FLAG) === '1') return;
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(SEED_CONTEXT));
    localStorage.setItem(CONTEXT_FLAG, '1');
  } catch (e) {
    console.error('seedContextLibrary failed', e);
  }
}

export function loadSeededVoices(): VoiceProfile[] {
  try {
    const raw = localStorage.getItem(VOICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VoiceProfile[];
  } catch {
    return [];
  }
}
