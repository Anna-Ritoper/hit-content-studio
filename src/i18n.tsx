import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'FR' | 'EN';

const STORAGE_KEY = 'hit-studio-lang';

type Dict = Record<string, { FR: string; EN: string }>;

export const STRINGS: Dict = {
  // Module selector
  'hub.heading': { FR: 'Que souhaitez-vous faire ?', EN: 'What would you like to do?' },
  'hub.content.title': { FR: 'Studio de contenu', EN: 'Content Studio' },
  'hub.content.desc': { FR: 'Rediger des posts et newsletters', EN: 'Write posts and newsletters' },
  'hub.visual.title': { FR: 'Studio visuel', EN: 'Visual Studio' },
  'hub.visual.desc': { FR: 'Creer visuels et carrousels', EN: 'Create visuals and carousels' },
  'hub.calendar.title': { FR: 'Calendrier', EN: 'Calendar' },
  'hub.calendar.desc': { FR: 'Planifier vos publications', EN: 'Plan your publications' },
  'hub.voices.title': { FR: 'Voix', EN: 'Voices' },
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
  'gen.copied': { FR: 'Copie!', EN: 'Copied!' },
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
  'lib.openInGen': { FR: 'Ouvrir dans Generer', EN: 'Open in Generate' },
  'lib.reopen': { FR: 'Reouvrir dans Generer', EN: 'Reopen in Generate' },
  'lib.export': { FR: 'Exporter .txt', EN: 'Export .txt' },
  'lib.editLabel': { FR: 'Editer', EN: 'Edit' },
  'lib.savingLabel': { FR: 'Enregistrement...', EN: 'Saving...' },
  'lib.saveLabel': { FR: 'Enregistrer', EN: 'Save' },
  'lib.cancelLabel': { FR: 'Annuler', EN: 'Cancel' },
  'lib.topicLabel': { FR: 'Sujet', EN: 'Topic' },
  'lib.contentLabel': { FR: 'Contenu du post', EN: 'Post Content' },
  'lib.copyLabel': { FR: 'Copier', EN: 'Copy' },
  'lib.charsLabel': { FR: 'caracteres', EN: 'chars' },

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

  // Common actions
  'act.cancel': { FR: 'Annuler', EN: 'Cancel' },
  'act.save': { FR: 'Enregistrer', EN: 'Save' },
  'act.download': { FR: 'Telecharger PPTX', EN: 'Download PPTX' },
  'act.confirmDelete': { FR: 'Supprimer cette regle ?', EN: 'Delete this rule?' },

  // Generate placeholders
  'gen.topicPh': { FR: 'ex: Barometre sante connectee 2026, Webinaire IA en sante, MedInTechs 2026', EN: 'e.g. Connected Health Barometer 2026, AI in Healthcare Webinar, MedInTechs 2026' },
  'gen.statsPh': { FR: "ex: 54% des Francais prets a utiliser l'IA pour leur sante, 63% des femmes ont du mal a acceder a un specialiste", EN: "e.g. 54% of French people ready to use AI for their health, 63% of women struggle to access a specialist" },
  'gen.draftPh': { FR: 'Collez votre brouillon ou vos idees ici...', EN: 'Paste your rough draft or bullet points here...' },

  // Visuals
  'vis.title': { FR: 'Visual Studio', EN: 'Visual Studio' },
  'vis.titlePh': { FR: "ex: Arbitrer, gouverner, creer de la valeur grace a l'IA", EN: 'e.g. Decide, govern, create value with AI' },
  'vis.pointsPh': { FR: 'Un point par ligne...', EN: 'One point per line...' },
  'vis.slideTitlePh': { FR: 'Titre du slide', EN: 'Slide title' },
  'vis.slideSubtitlePh': { FR: 'Sous-titre', EN: 'Subtitle' },
  'vis.slideBodyPh': { FR: 'Contenu du slide...', EN: 'Slide content...' },

  // StyleGuide placeholders and labels
  'sg.titlePh': { FR: 'ex: Pas de jargon', EN: 'e.g. No jargon' },
  'sg.descPh': { FR: 'Expliquez la regle en quelques mots...', EN: 'Explain the rule in a few words...' },

  // Calendar extra placeholders
  'cal.voicePh': { FR: 'ex: Simone Whale', EN: 'e.g. Simone Whale' },
  'cal.themePh': { FR: 'ex: Barometre, Evenement, Leadership', EN: 'e.g. Barometre, Event, Leadership' },
  'cal.topicPh': { FR: 'De quoi parle ce post ?', EN: 'What is this post about?' },
  'vis.subtitle': { FR: 'Creez des visuels pour vos publications', EN: 'Create visuals for your posts' },

  // Generate extra (context library, visual inline, modal, previews)
  'gen.context.title': { FR: 'Contexte / Materiel de reference', EN: 'Context / Reference Material' },
  'gen.context.empty': { FR: 'Collez des extraits de brochures, rapports ou posts precedents. Activez les entrees a utiliser. Max 5 entrees.', EN: 'Paste excerpts from brochures, reports, or previous posts. Toggle which entries are active for the next generation. Max 5 entries.' },
  'gen.context.titlePh': { FR: 'Titre de la source (ex: Resume executif Barometre 2026)', EN: 'Source title (e.g. Barometre 2026 exec summary)' },
  'gen.context.bodyPh': { FR: "Collez l'extrait ici...", EN: 'Paste excerpt here...' },
  'gen.context.add': { FR: '+ Ajouter une source', EN: '+ Add source' },
  'gen.context.sourcesActive': { FR: 'sources actives', EN: 'sources active' },
  'gen.context.remove': { FR: 'Retirer', EN: 'Remove' },
  'gen.linkedinPreview': { FR: 'Apercu LinkedIn', EN: 'LinkedIn Preview' },
  'gen.whatsappPreview': { FR: 'Apercu WhatsApp', EN: 'WhatsApp Preview' },
  'gen.previewPlaceholder': { FR: 'Votre post apparaitra ici une fois genere...', EN: 'Your post will appear here once generated...' },
  'gen.visualGen': { FR: 'Generateur de visuel', EN: 'Visual Generator' },
  'gen.visualHeadline': { FR: 'Titre du visuel', EN: 'Visual Headline' },
  'gen.visualSubtitle': { FR: 'Sous-titre', EN: 'Subtitle' },
  'gen.visualStats': { FR: 'Donnees (une par ligne)', EN: 'Stats Array (one per line)' },
  'gen.genVisualBtn': { FR: 'GENERER VISUEL', EN: 'GENERATE VISUAL' },
  'gen.genVisualBtnLoading': { FR: 'GENERATION DU VISUEL...', EN: 'GENERATING VISUAL...' },
  'gen.downloadPng': { FR: 'Telecharger PNG', EN: 'Download PNG' },
  'gen.saveCalTitle': { FR: 'Enregistrer au calendrier', EN: 'Save to calendar' },
  'gen.titleLabel': { FR: 'Titre', EN: 'Title' },
  'gen.voiceLabel': { FR: 'Voix', EN: 'Voice' },
  'gen.dateLabel': { FR: 'Date', EN: 'Date' },
  'gen.statusLabel': { FR: 'Statut', EN: 'Status' },
  'gen.cancelBtn': { FR: 'Annuler', EN: 'Cancel' },
  'gen.saveBtn': { FR: 'Enregistrer', EN: 'Save' },
  'gen.flag': { FR: 'Marquer', EN: 'Flag' },
  'gen.unflag': { FR: 'Ne plus marquer', EN: 'Unflag' },
  'gen.createNewVoice': { FR: '+ Creer une nouvelle voix', EN: '+ Create new voice' },
  'gen.selectVoicePh': { FR: 'Selectionner une voix', EN: 'Select a voice' },
  'gen.customTypePh': { FR: 'Nom du type...', EN: 'Type name...' },
  'gen.customAudiencePh': { FR: 'Nom de la cible...', EN: 'Audience name...' },
  'gen.addPill': { FR: 'Ajouter', EN: 'Add' },
  'gen.toastSaved': { FR: 'Enregistre au calendrier', EN: 'Saved to calendar' },
  'gen.toastDraftSaved': { FR: 'Brouillon enregistre', EN: 'Draft saved' },
  'gen.wordsMax': { FR: 'mots / max', EN: 'words / max' },
  'gen.chars': { FR: 'caracteres', EN: 'chars' },
  'gen.truncated': { FR: 'Sortie depassant {max} mots et tronquee.', EN: 'Output exceeded {max} words and was truncated.' },

  // Length options
  'gen.lengthShort': { FR: 'Court (150 a 300 mots)', EN: 'Short (150 to 300 words)' },
  'gen.lengthMedium': { FR: 'Moyen (300 a 800 mots)', EN: 'Medium (300 to 800 words)' },
  'gen.lengthLong': { FR: 'Long (800 a 1500 mots)', EN: 'Long (800 to 1500 words)' },

  // Style Guide: hardcoded rules (localised copies)
  'sg.rule.rule-1.title': { FR: 'Pas de tirets longs', EN: 'No em dashes' },
  'sg.rule.rule-1.desc': { FR: 'Jamais de tirets longs dans les textes', EN: 'Never use em or en dashes in text' },
  'sg.rule.rule-2.title': { FR: 'Ton direct et chaleureux', EN: 'Direct and warm tone' },
  'sg.rule.rule-2.desc': { FR: 'Pas de jargon corporate, phrases courtes', EN: 'No corporate jargon, short sentences' },
  'sg.rule.rule-3.title': { FR: 'Francais naturel', EN: 'Natural French' },
  'sg.rule.rule-3.desc': { FR: 'Francais parle, pas de formules figees', EN: 'Spoken French, no stock phrases' },
  'sg.rule.rule-4.title': { FR: 'Phrases interdites', EN: 'Forbidden phrases' },
  'sg.rule.rule-4.desc': { FR: "Pas de 'n'hesitez pas', 'je reviens vers vous', 'Si ca resonne'", EN: "Avoid 'feel free to', 'getting back to you', 'if this resonates'" },
  'sg.rule.rule-5.title': { FR: 'Hashtags groupes', EN: 'Hashtags grouped' },
  'sg.rule.rule-5.desc': { FR: 'Tous les hashtags a la fin, jamais dans le texte', EN: 'All hashtags at the end, never inline' },
  'sg.rule.rule-6.title': { FR: 'Exclamations limitees', EN: 'Limited exclamations' },
  'sg.rule.rule-6.desc': { FR: 'Maximum 1-2 par post', EN: 'Maximum 1 to 2 per post' },

  // Style Guide: categories
  'sg.cat.Formatage': { FR: 'Formatage', EN: 'Formatting' },
  'sg.cat.Ton': { FR: 'Ton', EN: 'Tone' },
  'sg.cat.Langue': { FR: 'Langue', EN: 'Language' },
  'sg.cat.Contenu': { FR: 'Contenu', EN: 'Content' },
  'sg.cat.Autre': { FR: 'Autre', EN: 'Other' },
  'vis.quick': { FR: 'Mode rapide', EN: 'Quick mode' },
  'vis.custom': { FR: 'Mode personnalise', EN: 'Custom mode' },

  // Tutorial steps
  'tour.welcome.title': { FR: 'Bienvenue dans HIT Content Studio', EN: 'Welcome to HIT Content Studio' },
  'tour.welcome.desc': { FR: 'Visite rapide des cinq modules et de la barre laterale. Environ une minute.', EN: 'Quick tour of all five modules and the sidebar. Takes about a minute.' },
  'tour.sidebar.title': { FR: 'Navigation laterale', EN: 'Sidebar navigation' },
  'tour.sidebar.desc': { FR: 'Passez d\'un module a l\'autre. Survolez pour deplier.', EN: 'Jump between modules here. Hover to expand.' },
  'tour.content.title': { FR: '1. Studio de contenu', EN: '1. Content Studio' },
  'tour.content.desc': { FR: 'Generez ou affinez des posts LinkedIn dans une voix choisie.', EN: 'Generate or refine LinkedIn posts in a chosen voice.' },
  'tour.voice.title': { FR: 'Choisir une voix', EN: 'Pick a voice' },
  'tour.voice.desc': { FR: 'Selectionnez le membre de l\'equipe au nom duquel le post sera redige.', EN: 'Choose which team member the post is written as.' },
  'tour.generate.title': { FR: 'Generer', EN: 'Generate' },
  'tour.generate.desc': { FR: 'Le texte s\'affiche en direct sur la droite.', EN: 'Output streams live on the right.' },
  'tour.visuals.title': { FR: '2. Studio visuel', EN: '2. Visual Studio' },
  'tour.visuals.desc': { FR: 'Creez des carrousels et visuels aux couleurs de la marque.', EN: 'Create branded carousels and single visuals for each post.' },
  'tour.visualsMode.title': { FR: 'Rapide ou personnalise', EN: 'Quick or custom' },
  'tour.visualsMode.desc': { FR: 'Choisissez une mise en page preetablie ou construisez slide par slide.', EN: 'Pick a preset layout or build slide by slide.' },
  'tour.calendar.title': { FR: '3. Calendrier', EN: '3. Calendar' },
  'tour.calendar.desc': { FR: 'Planifiez la ligne editoriale. Cliquez sur un jour pour voir les entrees.', EN: 'Plan the editorial schedule. Click a day to see entries.' },
  'tour.calendarAdd.title': { FR: 'Ajouter un post', EN: 'Add a post' },
  'tour.calendarAdd.desc': { FR: 'Creez une entree de calendrier et liez la a un brouillon.', EN: 'Create a new calendar entry and link it to a draft.' },
  'tour.voices.title': { FR: '4. Voix', EN: '4. Voices' },
  'tour.voices.desc': { FR: 'Gerez les profils de ton IA de chaque membre de l\'equipe.', EN: 'Manage AI tone profiles for each team member.' },
  'tour.voicesCreate.title': { FR: 'Creer une voix', EN: 'Create a voice' },
  'tour.voicesCreate.desc': { FR: 'Collez des exemples de posts et l\'IA en extrait le ton.', EN: 'Paste sample posts and the AI extracts the tone.' },
  'tour.library.title': { FR: '5. Bibliotheque', EN: '5. Draft Library' },
  'tour.library.desc': { FR: 'Tous les brouillons enregistres. Recherchez, editez, exportez.', EN: 'Every saved draft lives here. Search, edit, and export.' },
  'tour.styleguide.title': { FR: 'Style Guide', EN: 'Style Guide' },
  'tour.styleguide.desc': { FR: 'Regles appliquees a chaque post genere. Ajoutez les votres.', EN: 'Rules applied to every generated post. Add your own.' },
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
