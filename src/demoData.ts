// Demo Mode: all hardcoded content for offline demonstration
// No em dashes (U+2014/U+2013) anywhere in this file

import { Timestamp } from 'firebase/firestore';
import { CalendarEntry, Draft } from './types';
import { edhecLogoSvgGroup } from './edhecLogo';

// ── localStorage helpers ──

const DEMO_KEY = 'hit-demo-mode';

export function isDemoMode(): boolean {
  try {
    const v = localStorage.getItem(DEMO_KEY);
    if (v === null) return true;
    return v === 'true';
  } catch {
    return true;
  }
}

export function setDemoMode(on: boolean): void {
  try {
    localStorage.setItem(DEMO_KEY, on ? 'true' : 'false');
  } catch {
    // ignore
  }
}

// ── Generate Post demo content ──

export const DEMO_POST_TEXT = `\u{1F4CA} Sante connectee et IA : ou en sont les Francais ?

Notre barometre Ipsos x Chaire Management in Innovative Health (EDHEC) revele des chiffres revelateurs :

\u{1F449} 74% des Francais utilisent ou envisagent d'utiliser l'IA generative
\u{1F449} 54% dans le cadre de leur sante
\u{1F449} 63% des femmes declarent avoir un acces difficile a un medecin specialiste (vs 56% en moyenne)

La sante connectee peut-elle contribuer a reduire ces inegalites ?

Les Francais reconnaissent qu'elle peut apporter plus de rapidite, plus de praticite et aider a faire face aux tensions d'acces aux soins.

L'innovation en sante doit aussi etre un levier d'equite.

Decouvrez l'integralite du barometre :
\u{1F449} https://lnkd.in/ensTwMru

#SanteConnectee #eSante #IAenSante #EDHEC #Ipsos`;

// ── Visual Studio demo SVG ──

export const DEMO_SVG = `<svg viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1080" fill="#FAF8F4"/>
  <!-- Corner brackets -->
  <line x1="40" y1="40" x2="80" y2="40" stroke="#6B1E2E" stroke-width="2"/>
  <line x1="40" y1="40" x2="40" y2="80" stroke="#6B1E2E" stroke-width="2"/>
  <line x1="1040" y1="1000" x2="1040" y2="1040" stroke="#6B1E2E" stroke-width="2"/>
  <line x1="1000" y1="1040" x2="1040" y2="1040" stroke="#6B1E2E" stroke-width="2"/>
  <!-- Category -->
  <text x="540" y="160" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="13" fill="#D4614A" letter-spacing="3" text-transform="uppercase">BAROMETRE SANTE CONNECTEE</text>
  <!-- Headline -->
  <text x="540" y="260" text-anchor="middle" font-family="Playfair Display, serif" font-size="42" fill="#6B1E2E" font-weight="bold">63% des femmes ont un acces</text>
  <text x="540" y="315" text-anchor="middle" font-family="Playfair Display, serif" font-size="42" fill="#6B1E2E" font-weight="bold">difficile au specialiste</text>
  <!-- Subtitle -->
  <text x="540" y="375" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="18" fill="#555">Barometre Ipsos x EDHEC 2026</text>
  <!-- Bar chart -->
  <rect x="200" y="460" width="420" height="60" rx="8" fill="#D4614A"/>
  <text x="640" y="500" font-family="DM Sans, sans-serif" font-size="14" fill="#555">Femmes : 63%</text>
  <rect x="200" y="540" width="373" height="60" rx="8" fill="#2A7D6B"/>
  <text x="593" y="580" font-family="DM Sans, sans-serif" font-size="14" fill="#555">Moyenne : 56%</text>
  <!-- Large stats -->
  <text x="310" y="730" text-anchor="middle" font-family="Playfair Display, serif" font-size="80" fill="#D4614A" font-weight="bold">74%</text>
  <text x="310" y="770" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="14" fill="#555">utilisent ou envisagent</text>
  <text x="310" y="790" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="14" fill="#555">l'IA generative</text>
  <text x="770" y="730" text-anchor="middle" font-family="Playfair Display, serif" font-size="80" fill="#2A7D6B" font-weight="bold">54%</text>
  <text x="770" y="770" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="14" fill="#555">dans le cadre</text>
  <text x="770" y="790" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="14" fill="#555">de leur sante</text>
  <!-- Source -->
  <text x="80" y="1010" font-family="DM Sans, sans-serif" font-size="12" fill="#888">Source : Barometre Ipsos x EDHEC, 2026</text>
  <!-- EDHEC logo (bottom right) -->
  ${edhecLogoSvgGroup(820, 960, 0.35)}
</svg>`;

// ── Calendar demo entries ──

function ts(year: number, month: number, day: number): Timestamp {
  return Timestamp.fromDate(new Date(year, month - 1, day, 12, 0, 0));
}

// Permanent calendar entries: real historic and scheduled posts shown regardless of demo mode.
// Colors per voice:
//   Bing Bai: teal   (#2A7D6B)
//   Deborah Halimi Gerbi: coral (#D4614A)
//   Simone Whale: bordeaux (#6B1E2E)
//   Loick Menvielle: navy (#1A1F3C)
const LINK_BING_JAN = 'https://lnkd.in/ensTwMru';
const LINK_BING_FEB = 'https://lnkd.in/ensTwMru';
const LINK_DEBORAH_MEDINTECHS = 'https://www.linkedin.com/posts/d%C3%A9borah-halimi-gerbi_medintechs-innovationensantaez-aiinhealth-share-7432730051781189632-_ikP';
const LINK_BING_8MARS_INEG = 'https://www.linkedin.com/posts/bing-bai_in%C3%A9galit%C3%A9s-dacc%C3%A8s-aux-soins-ugcPost-7435317901819023360-N4Hj';
const LINK_SIMONE_MEDINTECHS = 'https://www.linkedin.com/posts/simone-whale_day-1-of-medintechs-in-the-books-if-you-activity-7436881284901183488-pKf_';
const LINK_DEBORAH_STRAT = 'https://www.linkedin.com/posts/d%C3%A9borah-halimi-gerbi_strat%C3%A9gie-et-leadership-en-sant%C3%A9-arbitrer-share-7444695095292895232-LL9L';
const LINK_LOICK_STRAT = 'https://www.linkedin.com/posts/loick-menvielle-0b696446_certificat-strat%C3%A9gie-et-leadership-en-sant%C3%A9edhec-activity-7445391554699096064-cYAw';
const LINK_LOICK_CAROUSEL = 'https://www.linkedin.com/posts/loick-menvielle-0b696446_carousel-%C3%A9quipe-p%C3%A9dagogiqueedhec-mih-activity-7447575352287223808-Gdi4';
const LINK_SIMONE_MENOPAUSE = 'https://www.linkedin.com/posts/simone-whale_womenshealth-femtech-menopause-activity-7441829681840054272-RXJ6';
const LINK_LOICK_IA = 'https://www.linkedin.com/posts/loick-menvielle-0b696446_sant%C3%A9-ia-innovation-tout-le-monde-en-activity-7448763797261082624-Ps51';
const LINK_SIMONE_CHAIR = 'https://www.linkedin.com/posts/simone-whale_the-management-in-innovative-health-chair-activity-7447936813408665600-PL9W';

const COLOR_BING = '#2A7D6B';
const COLOR_DEBORAH = '#D4614A';
const COLOR_SIMONE = '#6B1E2E';
const COLOR_LOICK = '#1A1F3C';

export const PERMANENT_CALENDAR_ENTRIES: CalendarEntry[] = [
  {
    id: 'perm-2026-01-28-bing-dpd',
    date: ts(2026, 1, 28), voiceProfileId: 'permanent', voiceName: 'Bing Bai', avatarColor: COLOR_BING,
    platform: 'LinkedIn', language: 'FR', theme: 'Protection des donnees',
    topic: 'Journee protection des donnees',
    status: 'Publie', linkedinUrl: LINK_BING_JAN, createdAt: ts(2026, 1, 20),
  },
  {
    id: 'perm-2026-02-24-bing-esante',
    date: ts(2026, 2, 24), voiceProfileId: 'permanent', voiceName: 'Bing Bai', avatarColor: COLOR_BING,
    platform: 'LinkedIn', language: 'FR', theme: 'Sante connectee',
    topic: 'Sante connectee, patients chroniques',
    status: 'Publie', linkedinUrl: LINK_BING_FEB, createdAt: ts(2026, 2, 18),
  },
  {
    id: 'perm-2026-02-28-deborah-medintechs',
    date: ts(2026, 2, 28), voiceProfileId: 'permanent', voiceName: 'Deborah Halimi Gerbi', avatarColor: COLOR_DEBORAH,
    platform: 'LinkedIn', language: 'FR', theme: 'Evenement',
    topic: 'MedInTechs 2026, Stand C21',
    status: 'Publie', linkedinUrl: LINK_DEBORAH_MEDINTECHS, createdAt: ts(2026, 2, 20),
  },
  {
    id: 'perm-2026-03-08-bing-inegalites',
    date: ts(2026, 3, 8), voiceProfileId: 'permanent', voiceName: 'Bing Bai', avatarColor: COLOR_BING,
    platform: 'LinkedIn', language: 'FR', theme: '8 Mars',
    topic: '8 Mars, inegalites acces soins',
    status: 'Publie', linkedinUrl: LINK_BING_8MARS_INEG, createdAt: ts(2026, 3, 1),
  },
  {
    id: 'perm-2026-03-08-bing-ia-femmes',
    date: ts(2026, 3, 8), voiceProfileId: 'permanent', voiceName: 'Bing Bai', avatarColor: COLOR_BING,
    platform: 'LinkedIn', language: 'FR', theme: '8 Mars',
    topic: '8 Mars, IA en sante des femmes',
    status: 'Publie', createdAt: ts(2026, 3, 1),
  },
  {
    id: 'perm-2026-03-08-bing-data',
    date: ts(2026, 3, 8), voiceProfileId: 'permanent', voiceName: 'Bing Bai', avatarColor: COLOR_BING,
    platform: 'LinkedIn', language: 'FR', theme: '8 Mars',
    topic: '8 Mars, donnees sante et IA',
    status: 'Publie', createdAt: ts(2026, 3, 1),
  },
  {
    id: 'perm-2026-03-09-simone-medintechs',
    date: ts(2026, 3, 9), voiceProfileId: 'permanent', voiceName: 'Simone Whale', avatarColor: COLOR_SIMONE,
    platform: 'LinkedIn', language: 'EN', theme: 'Evenement',
    topic: 'MedInTechs, Jour J',
    status: 'Publie', linkedinUrl: LINK_SIMONE_MEDINTECHS, createdAt: ts(2026, 3, 5),
  },
  {
    id: 'perm-2026-03-18-deborah-strategie',
    date: ts(2026, 3, 18), voiceProfileId: 'permanent', voiceName: 'Deborah Halimi Gerbi', avatarColor: COLOR_DEBORAH,
    platform: 'LinkedIn', language: 'FR', theme: 'Certificats HIT',
    topic: 'Certificat Strategie et Leadership',
    status: 'Publie', linkedinUrl: LINK_DEBORAH_STRAT, createdAt: ts(2026, 3, 12),
  },
  {
    id: 'perm-2026-03-20-loick-strategie',
    date: ts(2026, 3, 20), voiceProfileId: 'permanent', voiceName: 'Loick Menvielle', avatarColor: COLOR_LOICK,
    platform: 'LinkedIn', language: 'FR', theme: 'Certificats HIT',
    topic: 'Certificat Strategie et Leadership',
    status: 'Publie', linkedinUrl: LINK_LOICK_STRAT, createdAt: ts(2026, 3, 15),
  },
  {
    id: 'perm-2026-03-27-loick-equipe',
    date: ts(2026, 3, 27), voiceProfileId: 'permanent', voiceName: 'Loick Menvielle', avatarColor: COLOR_LOICK,
    platform: 'LinkedIn', language: 'FR', theme: 'Equipe pedagogique',
    topic: 'Equipe pedagogique, carousel',
    status: 'Publie', linkedinUrl: LINK_LOICK_CAROUSEL, createdAt: ts(2026, 3, 22),
  },
  {
    id: 'perm-2026-04-01-simone-menopause',
    date: ts(2026, 4, 1), voiceProfileId: 'permanent', voiceName: 'Simone Whale', avatarColor: COLOR_SIMONE,
    platform: 'LinkedIn', language: 'EN', theme: "Women's Health",
    topic: "Women's Health, Femtech, Menopause",
    status: 'Publie', linkedinUrl: LINK_SIMONE_MENOPAUSE, createdAt: ts(2026, 3, 28),
  },
  {
    id: 'perm-2026-04-03-loick-sante-ia',
    date: ts(2026, 4, 3), voiceProfileId: 'permanent', voiceName: 'Loick Menvielle', avatarColor: COLOR_LOICK,
    platform: 'LinkedIn', language: 'FR', theme: 'Innovation sante',
    topic: 'Sante, IA, Innovation',
    status: 'Publie', linkedinUrl: LINK_LOICK_IA, createdAt: ts(2026, 4, 1),
  },
  {
    id: 'perm-2026-04-08-simone-chair',
    date: ts(2026, 4, 8), voiceProfileId: 'permanent', voiceName: 'Simone Whale', avatarColor: COLOR_SIMONE,
    platform: 'LinkedIn', language: 'EN', theme: 'Chair',
    topic: 'Management in Innovative Health Chair',
    status: 'Publie', linkedinUrl: LINK_SIMONE_CHAIR, createdAt: ts(2026, 4, 5),
  },
  {
    id: 'perm-2026-04-15-deborah-certificats',
    date: ts(2026, 4, 15), voiceProfileId: 'permanent', voiceName: 'Deborah Halimi Gerbi', avatarColor: COLOR_DEBORAH,
    platform: 'LinkedIn', language: 'FR', theme: 'Certificats HIT',
    topic: 'Certificats HIT',
    status: 'Pret', createdAt: ts(2026, 4, 10),
  },
  {
    id: 'perm-2026-04-17-loick-leadership',
    date: ts(2026, 4, 17), voiceProfileId: 'permanent', voiceName: 'Loick Menvielle', avatarColor: COLOR_LOICK,
    platform: 'LinkedIn', language: 'FR', theme: 'Certificats HIT',
    topic: 'Strategie et Leadership',
    status: 'Pret', createdAt: ts(2026, 4, 12),
  },
];

// Default hashtag sets used by Generate when Firestore has no sets (also in demo mode).
// The Generate screen maps a selected set name to these actual hashtags.
export const DEFAULT_HASHTAG_SETS: { name: string; hashtags: string[] }[] = [
  { name: 'Sante connectee', hashtags: ['#SanteConnectee', '#eSante', '#InnovationSante', '#EDHEC'] },
  { name: 'IA en sante',     hashtags: ['#IAenSante', '#DigitalHealth', '#HealthTech', '#AIinHealthcare', '#EDHEC'] },
  { name: 'Barometre',       hashtags: ['#SanteConnectee', '#Ipsos', '#EDHEC', '#Data', '#HealthTech'] },
  { name: 'Evenement',       hashtags: ['#EDHEC', '#InnovationSante', '#HealthTech', '#MedTech'] },
  { name: 'Certificats HIT', hashtags: ['#EDHEC', '#HealthInnovation', '#ExecutiveEducation', '#HIT'] },
];

const SAMPLE_LI_URL = 'https://www.linkedin.com/posts/chaire-management-innovative-health_edhec-hit-activity-123456789';

export const DEMO_CALENDAR_ENTRIES: CalendarEntry[] = [
  {
    id: 'demo-cal-loick-apr2',
    date: ts(2026, 4, 2),
    voiceProfileId: 'demo',
    voiceName: 'Loick',
    avatarColor: '#D4614A',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Strategie',
    topic: 'Strategie hospitaliere : trois leviers pour integrer l\'IA generative',
    status: 'Publie',
    linkedinUrl: SAMPLE_LI_URL,
    createdAt: ts(2026, 3, 28),
  },
  {
    id: 'demo-cal-deborah-apr7',
    date: ts(2026, 4, 7),
    voiceProfileId: 'demo',
    voiceName: 'Deborah',
    avatarColor: '#2A7D6B',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Certificats HIT',
    topic: 'Certificat IA et Management en Sante : dernieres places disponibles',
    status: 'Publie',
    linkedinUrl: SAMPLE_LI_URL,
    createdAt: ts(2026, 4, 1),
  },
  {
    id: 'demo-cal-loick-apr9',
    date: ts(2026, 4, 9),
    voiceProfileId: 'demo',
    voiceName: 'Loick',
    avatarColor: '#D4614A',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Leadership',
    topic: 'Leadership en sante : piloter la transformation numerique sans perdre le sens',
    status: 'Publie',
    linkedinUrl: SAMPLE_LI_URL,
    createdAt: ts(2026, 4, 2),
  },
  {
    id: 'demo-cal-deborah-apr14',
    date: ts(2026, 4, 14),
    voiceProfileId: 'demo',
    voiceName: 'Deborah',
    avatarColor: '#2A7D6B',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Certificats HIT',
    topic: 'Temoignage alumni : comment le certificat HIT a transforme ma pratique',
    status: 'Pret',
    createdAt: ts(2026, 4, 8),
  },
  {
    id: 'demo-cal-loick-apr16',
    date: ts(2026, 4, 16),
    voiceProfileId: 'demo',
    voiceName: 'Loick',
    avatarColor: '#D4614A',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Innovation',
    topic: 'IA generative et parcours patient : ce que nous apprend le terrain',
    status: 'Pret',
    createdAt: ts(2026, 4, 10),
  },
  {
    id: 'demo-cal-deborah-apr21',
    date: ts(2026, 4, 21),
    voiceProfileId: 'demo',
    voiceName: 'Deborah',
    avatarColor: '#2A7D6B',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Barometre',
    topic: 'Barometre sante connectee : focus sur l\'acces aux soins des femmes',
    status: 'Pret',
    createdAt: ts(2026, 4, 12),
  },
  {
    id: 'demo-cal-loick-apr23',
    date: ts(2026, 4, 23),
    voiceProfileId: 'demo',
    voiceName: 'Loick',
    avatarColor: '#D4614A',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Strategie',
    topic: 'Trois enseignements du Barometre 2026 pour les directions hospitalieres',
    status: 'Pret',
    createdAt: ts(2026, 4, 12),
  },
  {
    id: 'demo-cal-deborah-apr28',
    date: ts(2026, 4, 28),
    voiceProfileId: 'demo',
    voiceName: 'Deborah',
    avatarColor: '#2A7D6B',
    platform: 'LinkedIn',
    language: 'FR',
    theme: 'Webinaire',
    topic: 'Replay webinaire HIT : IA generative et formation des managers en sante',
    status: 'Pret',
    createdAt: ts(2026, 4, 12),
  },
];

// ── Library demo drafts ──

export const DEMO_DRAFTS: Draft[] = [
  {
    id: 'demo-draft-barometre',
    voiceProfileId: 'simone-whale-default',
    voiceName: 'Simone Whale',
    platform: 'LinkedIn',
    language: 'FR',
    contentType: 'Barometre',
    topic: 'Barometre sante connectee 2026 : ou en sont les Francais ?',
    stats: '74% IA generative, 54% sante, 63% femmes acces specialiste',
    generatedText: DEMO_POST_TEXT,
    editedText: '',
    status: 'Publie',
    createdAt: ts(2026, 3, 8),
    updatedAt: ts(2026, 3, 8),
  },
  {
    id: 'demo-draft-medintechs',
    voiceProfileId: 'simone-whale-default',
    voiceName: 'Deborah',
    platform: 'LinkedIn',
    language: 'FR',
    contentType: 'Evenement',
    topic: 'MedInTechs 2026 : retour sur trois jours d\'echanges au stand C21',
    stats: '3 jours, 200+ exposants, 40 rendez-vous alumni',
    generatedText: `\u{1F3E5} MedInTechs 2026 : retour sur une edition intense pour la Chaire Management in Innovative Health (EDHEC).

Trois jours au stand C21, et une certitude : l'innovation en sante avance vite, mais le management doit suivre.

\u{1F449} 40 rendez-vous avec des alumni et des partenaires
\u{1F449} 3 ateliers sur l'IA generative et le parcours patient
\u{1F449} 1 table ronde sur les nouveaux modeles de formation

Merci a toutes celles et ceux qui sont passes nous voir. On en ressort avec des idees claires pour la suite.

Rendez-vous l'an prochain.

#MedInTechs #EDHEC #InnovationSante #HealthTech`,
    editedText: '',
    status: 'Publie',
    createdAt: ts(2026, 3, 12),
    updatedAt: ts(2026, 3, 12),
  },
  {
    id: 'demo-draft-certificats',
    voiceProfileId: 'simone-whale-default',
    voiceName: 'Deborah',
    platform: 'LinkedIn',
    language: 'FR',
    contentType: 'Certificats HIT',
    topic: 'Certificats HIT : dernieres places pour la promotion 2026',
    stats: 'Certificat IA et Management en Sante, rentree septembre 2026',
    generatedText: `\u{1F393} Les inscriptions au Certificat IA et Management en Sante de la Chaire Management in Innovative Health (EDHEC) sont ouvertes.

Ce programme s'adresse aux professionnels de sante, managers et decideurs qui veulent comprendre, piloter et deployer l'IA dans leurs organisations.

Au programme :
\u{1F449} Fondamentaux de l'IA generative appliquee a la sante
\u{1F449} Cas d'usage concrets : parcours patient, back-office, recherche clinique
\u{1F449} Ethique, gouvernance des donnees et conformite
\u{1F449} Projet applique en petit groupe

Format executive, compatible avec une activite professionnelle. Prochaine promotion : septembre 2026.

Candidatures ouvertes jusqu'au 30 juin.

#EDHEC #FormationSante #IAenSante #Certificats`,
    editedText: '',
    status: 'Pret',
    createdAt: ts(2026, 4, 5),
    updatedAt: ts(2026, 4, 5),
  },
  {
    id: 'demo-draft-ia-sante',
    voiceProfileId: 'simone-whale-default',
    voiceName: 'Loick',
    platform: 'LinkedIn',
    language: 'FR',
    contentType: 'Thought leadership',
    topic: 'IA en sante : trois conditions pour passer du pilote au deploiement',
    stats: 'Trois conditions : cas d\'usage, donnees, culture',
    generatedText: `Beaucoup de pilotes IA en sante. Tres peu de deploiements a l'echelle.

Trois conditions reviennent dans les projets qui tiennent :

1. Un cas d'usage qui resout un vrai probleme clinique ou operationnel, pas un POC pour cocher une case.
2. Une donnee propre, accessible et gouvernee, avant meme de parler de modeles.
3. Une culture qui accepte de revoir les process quand l'outil le justifie.

Ce n'est pas l'IA qui bloque. Ce sont les trois conditions au-dessus.

Curieux de lire vos retours de terrain.

#IAenSante #ManagementSante #EDHEC`,
    editedText: '',
    status: 'Brouillon',
    createdAt: ts(2026, 4, 10),
    updatedAt: ts(2026, 4, 11),
  },
  {
    id: 'demo-draft-newsletter',
    voiceProfileId: 'simone-whale-default',
    voiceName: 'Simone Whale',
    platform: 'LinkedIn',
    language: 'FR',
    contentType: 'Newsletter',
    topic: 'Newsletter HIT : avril 2026',
    stats: 'Barometre, Certificats HIT, webinaire replay',
    generatedText: `Chers lecteurs,

Dans cette edition d'avril 2026 de la newsletter de la Chaire Management in Innovative Health (EDHEC) :

Le Barometre Ipsos x EDHEC 2026 est sorti. Les chiffres cles sur la sante connectee, l'IA generative et l'acces aux soins.

Les inscriptions au Certificat IA et Management en Sante sont ouvertes. Prochaine promotion en septembre 2026.

Le replay du webinaire sur l'IA generative et le parcours patient est disponible en acces libre.

Bonne lecture,
L'equipe HIT`,
    editedText: '',
    status: 'Brouillon',
    createdAt: ts(2026, 4, 11),
    updatedAt: ts(2026, 4, 11),
  },
];
