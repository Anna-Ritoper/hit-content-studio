import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'FR' | 'EN';

const STORAGE_KEY = 'hit-studio-lang';

type Dict = Record<string, { FR: string; EN: string }>;

export const STRINGS: Dict = {
  // Module selector
  'hub.heading': { FR: 'Que souhaitez-vous faire ?', EN: 'What would you like to do?' },
  'hub.content.title': { FR: 'Content Studio', EN: 'Content Studio' },
  'hub.content.desc': { FR: 'Posts et newsletters', EN: 'Posts and newsletters' },
  'hub.visual.title': { FR: 'Visual Studio', EN: 'Visual Studio' },
  'hub.visual.desc': { FR: 'Visuels et carrousels', EN: 'Visuals and carousels' },
  'hub.calendar.title': { FR: 'Calendrier', EN: 'Calendar' },
  'hub.calendar.desc': { FR: 'Planifier vos publications', EN: 'Plan your publications' },
  'hub.voices.title': { FR: 'Voices', EN: 'Voices' },
  'hub.voices.desc': { FR: 'Gerer les profils de ton', EN: 'Manage voice profiles' },

  // Header / chrome
  'chrome.chair': { FR: 'CHAIRE MANAGEMENT IN INNOVATIVE HEALTH', EN: 'CHAIRE MANAGEMENT IN INNOVATIVE HEALTH' },
  'chrome.app': { FR: 'HIT Content Studio', EN: 'HIT Content Studio' },
  'chrome.guide': { FR: 'GUIDE', EN: 'GUIDE' },
  'chrome.demo': { FR: 'Mode Demo', EN: 'Demo Mode' },
  'chrome.demoActive': { FR: 'Mode Demo actif', EN: 'Demo Mode active' },

  // Sidebar nav
  'nav.generate': { FR: 'Generer', EN: 'Generate' },
  'nav.visuals': { FR: 'Visuels', EN: 'Visuals' },
  'nav.voices': { FR: 'Voices', EN: 'Voices' },
  'nav.calendar': { FR: 'Calendrier', EN: 'Calendar' },
  'nav.styleGuide': { FR: 'Style Guide', EN: 'Style Guide' },
  'nav.library': { FR: 'Bibliotheque', EN: 'Library' },
  'nav.settings': { FR: 'Reglages', EN: 'Settings' },

  // Status
  'status.A rediger': { FR: 'A REDIGER', EN: 'TO WRITE' },
  'status.Brouillon': { FR: 'BROUILLON', EN: 'DRAFT' },
  'status.Pret': { FR: 'PRET', EN: 'READY' },
  'status.Publie': { FR: 'PUBLIE', EN: 'PUBLISHED' },

  // Style Guide
  'sg.title': { FR: 'Style Guide', EN: 'Style Guide' },
  'sg.subtitle': { FR: 'Regles appliquees a tous les contenus generes', EN: 'Rules applied to all generated content' },
  'sg.add': { FR: 'Ajouter une regle personnalisee', EN: 'Add a custom rule' },
  'sg.newRule': { FR: 'Nouvelle regle', EN: 'New rule' },
  'sg.editRule': { FR: 'Modifier la regle', EN: 'Edit rule' },
  'sg.titleField': { FR: 'Titre', EN: 'Title' },
  'sg.description': { FR: 'Description', EN: 'Description' },
  'sg.category': { FR: 'Categorie', EN: 'Category' },
  'sg.icon': { FR: 'Icone', EN: 'Icon' },
  'sg.cancel': { FR: 'Annuler', EN: 'Cancel' },
  'sg.save': { FR: 'Enregistrer', EN: 'Save' },

  // Generate
  'gen.craft': { FR: 'Redigez votre post.', EN: 'Craft your post.' },
  'gen.craftDesc': { FR: 'Creez du contenu pour la Chaire Management in Innovative Health.', EN: 'Craft content for the EDHEC Management in Innovative Health Chair.' },
  'gen.postingAs': { FR: 'Posting As', EN: 'Posting As' },
  'gen.fromScratch': { FR: 'Generer from scratch', EN: 'Generate from scratch' },
  'gen.refine': { FR: 'Affiner un brouillon', EN: 'Refine a draft' },
  'gen.topic': { FR: 'Sujet', EN: 'Topic' },
  'gen.keyFacts': { FR: 'Faits cles et chiffres', EN: 'Key facts & data points' },
  'gen.draft': { FR: 'Votre brouillon', EN: 'Your draft' },
  'gen.contentType': { FR: 'Type de contenu', EN: 'Content Type' },
  'gen.target': { FR: 'Cible', EN: 'Target audience' },
  'gen.length': { FR: 'Longueur', EN: 'Post Length' },
  'gen.language': { FR: 'Langue', EN: 'Language' },
  'gen.platform': { FR: 'Plateforme', EN: 'Platform' },
  'gen.hashtags': { FR: 'Hashtags', EN: 'Hashtags' },
  'gen.generateBtn': { FR: 'GENERER', EN: 'GENERATE POST' },
  'gen.refineBtn': { FR: 'AFFINER', EN: 'REFINE DRAFT' },
  'gen.generating': { FR: 'GENERATION...', EN: 'GENERATING...' },
  'gen.selectVoice': { FR: 'Selectionnez une voix pour continuer', EN: 'Select a voice to continue' },
  'gen.output': { FR: 'Contenu genere', EN: 'Generated Content' },
  'gen.placeholder': { FR: 'Votre post genere apparaitra ici...', EN: 'Your generated post will appear here...' },
  'gen.regenerate': { FR: 'Regenerer', EN: 'Regenerate' },
  'gen.copy': { FR: 'Copier', EN: 'Copy' },
  'gen.saveCal': { FR: 'Enregistrer au calendrier', EN: 'Save to calendar' },
  'gen.genVisual': { FR: 'Generer un visuel', EN: 'Generate visual' },

  // Calendar
  'cal.addPost': { FR: 'Ajouter un post', EN: 'Add Post' },
  'cal.selectDay': { FR: 'Selectionnez un jour', EN: 'Select a day' },
  'cal.addForDay': { FR: 'Ajouter une entree pour ce jour', EN: 'Add entry for this day' },
  'cal.noEntries': { FR: 'Aucune entree pour ce jour', EN: 'No entries for this day' },
  'cal.newEntry': { FR: 'Nouvelle entree', EN: 'New calendar entry' },
  'cal.editEntry': { FR: "Modifier l'entree", EN: 'Edit entry' },
  'cal.date': { FR: 'Date', EN: 'Date' },
  'cal.voiceAuthor': { FR: 'Voix / Auteur', EN: 'Voice / Author' },
  'cal.theme': { FR: 'Theme / Categorie', EN: 'Theme / Category' },
  'cal.topic': { FR: 'Sujet / Description', EN: 'Topic / Description' },
  'cal.linkedinUrl': { FR: 'URL LinkedIn (optionnel)', EN: 'LinkedIn URL (optional)' },
  'cal.addLinkedIn': { FR: 'Ajouter un lien LinkedIn', EN: 'Add LinkedIn link' },
  'cal.linkedin': { FR: 'LINKEDIN', EN: 'LINKEDIN' },
  'cal.saveChanges': { FR: 'Enregistrer', EN: 'Save changes' },
  'cal.addToCal': { FR: 'Ajouter au calendrier', EN: 'Add to calendar' },
  'cal.cancel': { FR: 'Annuler', EN: 'Cancel' },
  'cal.detailView': { FR: 'Details du post', EN: 'Post details' },
  'cal.edit': { FR: 'Editer', EN: 'Edit' },
  'cal.openLinkedIn': { FR: 'Ouvrir sur LinkedIn', EN: 'Open on LinkedIn' },

  // Library
  'lib.title': { FR: 'Bibliotheque', EN: 'Draft Library' },
  'lib.repo': { FR: 'Repertoire', EN: 'Repository' },
  'lib.subtitle': { FR: 'Gerez et affinez vos brouillons.', EN: 'Manage and refine your drafted content.' },
  'lib.search': { FR: 'Rechercher par mot-cle, voix ou sujet...', EN: 'Search by keyword, voice, or topic...' },
  'lib.empty': { FR: 'Aucun brouillon. Generez un post pour le voir ici.', EN: 'No drafts yet. Generate a post to see it here.' },

  // Voices
  'voices.title': { FR: 'Voices', EN: 'Voices' },
  'voices.build': { FR: 'Construire des profils de ton IA', EN: 'Build AI Tone Profiles' },
  'voices.buildDesc': { FR: "Extraire le style d'ecriture unique de vos collaborateurs.", EN: 'Extract the unique writing style of your team members.' },
  'voices.create': { FR: 'Creer un nouveau profil', EN: 'Create New Profile' },
  'voices.photo': { FR: 'Photo de profil', EN: 'Profile photo' },
  'voices.uploadPhoto': { FR: 'Televerser une photo', EN: 'Upload photo' },

  // Settings
  'set.title': { FR: 'Reglages', EN: 'Settings' },
  'set.subtitle': { FR: "Gerez votre espace de travail et configurations IA.", EN: 'Manage your workspace, voice profiles, and AI configurations.' },

  // Visuals
  'vis.title': { FR: 'Visual Studio', EN: 'Visual Studio' },
  'vis.subtitle': { FR: 'Creez des visuels pour vos publications', EN: 'Create visuals for your posts' },
  'vis.quick': { FR: 'Mode rapide', EN: 'Quick mode' },
  'vis.custom': { FR: 'Mode personnalise', EN: 'Custom mode' },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: 'FR',
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('FR');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'FR' || stored === 'EN') setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  const t = (key: string): string => {
    const entry = STRINGS[key];
    if (!entry) return key;
    return entry[lang] || entry.FR || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
