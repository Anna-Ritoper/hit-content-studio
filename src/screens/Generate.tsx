import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PenTool,
  RotateCcw,
  Copy,
  Check,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Flag,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { VoiceProfile, Platform, Language, PostStatus, Draft, StyleRule } from '../types';
import { SIMONE_WHALE_DEFAULT, formatStyleRules, HARDCODED_STYLE_RULES } from '../constants';
import { loadSeededVoices } from '../seedData';
import { DEFAULT_HASHTAG_SETS } from '../demoData';
import { generatePost, generateVisualSvg, getLengthBounds, countWords, truncateToWords } from '../services/aiService';
import { sanitizeSvg } from '../services/sanitizeSvg';
import VoiceCreator from '../components/VoiceCreator';
import { useI18n } from '../i18n';
import { clsx, type ClassValue } from 'clsx';
import html2canvas from 'html2canvas';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Generate() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mode, setMode] = useState<'generate' | 'refine'>('generate');
  const [topic, setTopic] = useState('');
  const [stats, setStats] = useState('');
  const [draftInput, setDraftInput] = useState('');
  const [contentType, setContentType] = useState('Baromètre');
  const [postLength, setPostLength] = useState('Medium');
  const [language, setLanguage] = useState<Language | 'FR+EN'>('FR');
  const [platform, setPlatform] = useState<Platform>('LinkedIn');
  const initialVoices = (() => {
    const seeded = loadSeededVoices();
    return seeded.length > 0 ? seeded : [SIMONE_WHALE_DEFAULT];
  })();
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile | null>(initialVoices[0]);
  const [voices, setVoices] = useState<VoiceProfile[]>(initialVoices);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isVoiceCreatorOpen, setIsVoiceCreatorOpen] = useState(false);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [lengthWarning, setLengthWarning] = useState('');
  const [isHashtagsExpanded, setIsHashtagsExpanded] = useState(false);
  const [selectedHashtagSet, setSelectedHashtagSet] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [cta, setCta] = useState('');
  const [cibles, setCibles] = useState<string[]>([]);
  const [customContentTypes, setCustomContentTypes] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('customContentTypes') || '[]'); } catch { return []; }
  });
  const [customAudiences, setCustomAudiences] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('customAudiences') || '[]'); } catch { return []; }
  });
  const [addingContentType, setAddingContentType] = useState(false);
  const [newContentType, setNewContentType] = useState('');
  const [addingAudience, setAddingAudience] = useState(false);
  const [newAudience, setNewAudience] = useState('');

  const persistCustomTypes = (arr: string[]) => {
    setCustomContentTypes(arr);
    try { localStorage.setItem('customContentTypes', JSON.stringify(arr)); } catch {}
  };
  const persistCustomAudiences = (arr: string[]) => {
    setCustomAudiences(arr);
    try { localStorage.setItem('customAudiences', JSON.stringify(arr)); } catch {}
  };
  const toggleCible = (c: string) => {
    setCibles(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  const [styleRules, setStyleRules] = useState<StyleRule[]>([]);
  const [justCopied, setJustCopied] = useState(false);
  const [flagged, setFlagged] = useState(false);
  type ContextEntry = { id: string; title: string; content: string; dateAdded: string };
  const [contextLibrary, setContextLibrary] = useState<ContextEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('contextLibrary') || '[]'); } catch { return []; }
  });
  const [activeContextIds, setActiveContextIds] = useState<string[]>([]);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [newContextTitle, setNewContextTitle] = useState('');
  const [newContextBody, setNewContextBody] = useState('');

  const persistContext = (entries: ContextEntry[]) => {
    setContextLibrary(entries);
    try { localStorage.setItem('contextLibrary', JSON.stringify(entries)); } catch {}
  };
  const addContextEntry = () => {
    if (!newContextTitle.trim() || !newContextBody.trim()) return;
    if (contextLibrary.length >= 5) return;
    const entry: ContextEntry = {
      id: `ctx-${Date.now()}`,
      title: newContextTitle.trim(),
      content: newContextBody.trim(),
      dateAdded: new Date().toISOString(),
    };
    persistContext([...contextLibrary, entry]);
    setActiveContextIds(ids => [...ids, entry.id]);
    setNewContextTitle('');
    setNewContextBody('');
  };
  const removeContextEntry = (id: string) => {
    persistContext(contextLibrary.filter(e => e.id !== id));
    setActiveContextIds(ids => ids.filter(i => i !== id));
  };
  const toggleContextActive = (id: string) => {
    setActiveContextIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  };
  const activeContextCount = activeContextIds.filter(id => contextLibrary.some(e => e.id === id)).length;
  const [toast, setToast] = useState('');
  const [saveCalOpen, setSaveCalOpen] = useState(false);
  const [calForm, setCalForm] = useState({ title: '', voice: '', date: '', status: 'Brouillon' as PostStatus });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(t => (t === msg ? '' : t)), 2200);
  };

  useEffect(() => {
    if (selectedVoice?.id) {
      try { localStorage.setItem('hit-current-voice-id', selectedVoice.id); } catch {}
    }
  }, [selectedVoice]);

  const openSaveCal = () => {
    if (!generatedContent.trim()) return;
    setCalForm({
      title: topic || generatedContent.slice(0, 50),
      voice: selectedVoice?.name || '',
      date: new Date().toISOString().slice(0, 10),
      status: 'Brouillon',
    });
    setSaveCalOpen(true);
  };

  const confirmSaveCal = () => {
    try {
      const raw = localStorage.getItem('calendarEntries');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({
        id: `local-${Date.now()}`,
        title: calForm.title,
        voice: calForm.voice,
        date: calForm.date,
        status: calForm.status,
        topic,
        content: generatedContent,
        flagged,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('calendarEntries', JSON.stringify(arr));
    } catch (e) { console.error(e); }
    setSaveCalOpen(false);
    showToast(t('gen.toastSaved'));
  };

  const autoSaveDraft = (content: string) => {
    if (!content.trim()) return;
    try {
      const raw = localStorage.getItem('drafts');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({
        id: `local-${Date.now()}`,
        title: (topic || content).slice(0, 50),
        voice: selectedVoice?.name || '',
        date: new Date().toISOString(),
        status: 'Brouillon' as PostStatus,
        content,
        flagged,
      });
      localStorage.setItem('drafts', JSON.stringify(arr));
      showToast(t('gen.toastDraftSaved'));
    } catch (e) { console.error(e); }
  };

  const handleCopy = async () => {
    if (!generatedContent.trim()) return;
    try {
      await navigator.clipboard.writeText(generatedContent);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const q = query(collection(db, 'voiceProfiles'));
        const querySnapshot = await getDocs(q);
        const voicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VoiceProfile));
        if (voicesData.length > 0) {
          setVoices(voicesData);
          if (!selectedVoice || selectedVoice.id === 'simone-whale-default') {
            setSelectedVoice(voicesData[0]);
          }
        } else {
          const seeded = loadSeededVoices();
          if (seeded.length > 0) {
            setVoices(seeded);
            if (!selectedVoice || selectedVoice.id === 'simone-whale-default') {
              setSelectedVoice(seeded[0]);
            }
          }
        }
      } catch (e) {
        console.error('fetch voices failed', e);
      }
    };
    fetchVoices();
  }, []);

  useEffect(() => {
    const fetchStyleRules = async () => {
      try {
        const q = query(collection(db, 'styleRules'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const userRules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StyleRule));
        setStyleRules([...HARDCODED_STYLE_RULES, ...userRules]);
      } catch (error) {
        console.error("Error fetching style rules:", error);
        setStyleRules(HARDCODED_STYLE_RULES);
      }
    };
    fetchStyleRules();
  }, []);

  const handleGenerate = async () => {
    if (!selectedVoice) return;
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedContent('');
    
    try {
      const additionalRules = formatStyleRules(styleRules);
      const fullText = await generatePost({
        voiceName: selectedVoice.name,
        systemPromptFragment: selectedVoice.systemPromptFragment,
        platform,
        contentType,
        lengthTarget: postLength,
        charLimit: platform === 'LinkedIn' ? 3000 : 1000,
        language,
        topic,
        stats,
        link,
        cta,
        // Resolve the selected set name to its actual hashtags before sending to the model.
        // Previously we sent the set name as the literal hashtags string, which dropped the tags.
        hashtags: (DEFAULT_HASHTAG_SETS.find(s => s.name === selectedHashtagSet)?.hashtags || []).join(' '),
        draftInput,
        mode,
        cible: cibles.length > 0 ? cibles.join(', ') : undefined,
        additionalRules,
        contextSources: contextLibrary
          .filter(e => activeContextIds.includes(e.id))
          .map(e => ({ title: e.title, content: e.content })),
        onChunk: (chunk) => {
          setGeneratedContent(prev => prev + chunk);
        }
      });
      const { max: maxWords } = getLengthBounds(postLength);
      let finalText = fullText || '';
      if (countWords(finalText) > maxWords) {
        finalText = truncateToWords(finalText, maxWords);
        setLengthWarning(t('gen.truncated').replace('{max}', String(maxWords)));
      } else {
        setLengthWarning('');
      }
      if (finalText) setGeneratedContent(finalText);
      autoSaveDraft(finalText);
    } catch (error: any) {
      console.error("Generation failed:", error);
      const msg = error?.message || 'Unknown error';
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const [showVisualGenerator, setShowVisualGenerator] = useState(false);
  const [visualHeadline, setVisualHeadline] = useState('');
  const [visualSubtitle, setVisualSubtitle] = useState('');
  const [visualStats, setVisualStats] = useState('');
  const [visualSvg, setVisualSvg] = useState('');
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  useEffect(() => {
    if (topic) setVisualHeadline(topic);
    if (stats) setVisualStats(stats);
  }, [topic, stats]);

  const extractStatsFromPost = (text: string): string => {
    if (!text) return '';
    const sentences = text
      .split(/(?<=[.!?\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && /\d/.test(s))
      .slice(0, 3);
    return sentences.join('\n');
  };

  const openVisualGenerator = () => {
    const next = !showVisualGenerator;
    setShowVisualGenerator(next);
    if (next && generatedContent.trim()) {
      if (!visualHeadline && topic) setVisualHeadline(topic);
      if (!visualSubtitle) setVisualSubtitle(contentType);
      const extracted = extractStatsFromPost(generatedContent);
      if (extracted && !visualStats) setVisualStats(extracted);
    }
  };

  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    try {
      const additionalRules = formatStyleRules(styleRules);
      const svg = await generateVisualSvg({
        categoryLabel: contentType.toUpperCase(),
        headline: visualHeadline,
        subtitle: visualSubtitle,
        statsArray: visualStats,
        aspectRatio: platform === 'LinkedIn' ? '1:1' : '9:16',
        additionalRules,
        language,
      });
      setVisualSvg(svg || '');
    } catch (error) {
      console.error("Visual generation failed:", error);
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleDownloadPng = async () => {
    const element = document.getElementById('visual-preview');
    if (!element) return;
    const canvas = await html2canvas(element, { 
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });
    const link = document.createElement('a');
    link.download = `HIT-Visual-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto" data-tour="module-content">
      {/* Voice Profile Selector */}
      <div data-tour="voice-selector" className="mb-6 bg-white rounded-2xl p-4 border border-brand-bordeaux/5 shadow-sm relative">
        <label className="text-[10px] font-bold text-brand-coral uppercase tracking-[0.2em] mb-2 block">{t('gen.postingAs')}</label>
        <button
          type="button"
          onClick={() => setIsVoiceDropdownOpen(o => !o)}
          className="flex items-center gap-4 w-full text-left"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-headline font-bold text-sm overflow-hidden flex-shrink-0"
            style={{ backgroundColor: selectedVoice?.avatarColor || '#6B1E2E' }}
          >
            {selectedVoice?.avatarPhoto ? (
              <img src={selectedVoice.avatarPhoto} alt={selectedVoice.name} className="w-full h-full object-cover" />
            ) : (
              selectedVoice?.name.charAt(0) || '?'
            )}
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-headline text-base text-brand-bordeaux font-bold leading-tight">
              {selectedVoice?.name || t('gen.selectVoicePh')}
            </span>
            <span className="text-xs text-brand-navy/50 font-medium">
              {selectedVoice?.role || ''}
            </span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-brand-navy/40 transition-transform", isVoiceDropdownOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isVoiceDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 right-0 top-full mt-1 bg-white border border-brand-bordeaux/10 rounded-xl shadow-lg z-30 overflow-hidden"
            >
              {voices.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => { setSelectedVoice(voice); setIsVoiceDropdownOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-brand-warm-white transition-all",
                    selectedVoice?.id === voice.id && "bg-brand-bordeaux/5"
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-headline font-bold text-xs overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: voice.avatarColor }}
                  >
                    {voice.avatarPhoto ? (
                      <img src={voice.avatarPhoto} alt={voice.name} className="w-full h-full object-cover" />
                    ) : (
                      voice.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-brand-bordeaux leading-tight">{voice.name}</span>
                    <span className="text-[10px] text-brand-navy/50">{voice.role}</span>
                  </div>
                </button>
              ))}
              <button
                onClick={() => { setIsVoiceDropdownOpen(false); setIsVoiceCreatorOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-brand-teal/5 border-t border-brand-bordeaux/10 text-brand-teal text-xs font-bold"
              >
                {t('gen.createNewVoice')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-brand-bordeaux">{t('gen.craft')}</h1>
        <p className="font-body text-brand-navy/60 mt-2">{t('gen.craftDesc')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
        {/* Left Panel - Inputs */}
        <div className="card space-y-6">
          <div data-tour="mode-toggle" className="flex bg-brand-warm-white p-1 rounded-lg border border-brand-bordeaux/10">
            <button
              onClick={() => setMode('generate')}
              className={cn(
                "flex-1 py-2 rounded-md font-body font-bold text-xs transition-all",
                mode === 'generate' ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40 hover:text-brand-navy"
              )}
            >
              {t('gen.fromScratch')}
            </button>
            <button
              onClick={() => setMode('refine')}
              className={cn(
                "flex-1 py-2 rounded-md font-body font-bold text-xs transition-all",
                mode === 'refine' ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40 hover:text-brand-navy"
              )}
            >
              {t('gen.refine')}
            </button>
          </div>

          {mode === 'generate' ? (
            <>
              <div>
                <label className="input-label">{t('gen.topic')}</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('gen.topicPh')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">{t('gen.keyFacts')}</label>
                <textarea
                  rows={4}
                  value={stats}
                  onChange={(e) => setStats(e.target.value)}
                  placeholder={t('gen.statsPh')}
                  className="input-field resize-none"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="input-label">{t('gen.draft')}</label>
              <textarea
                rows={8}
                value={draftInput}
                onChange={(e) => setDraftInput(e.target.value)}
                placeholder={t('gen.draftPh')}
                className="input-field resize-none"
              />
            </div>
          )}

          <div data-tour="content-type">
            <label className="input-label">{t('gen.contentType')}</label>
            <div className="flex flex-wrap gap-2">
              {['Baromètre', 'Événement', 'Webinaire', 'Certificats HIT', 'Thought leadership', 'Newsletter'].map(type => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                    contentType === type ? "bg-brand-bordeaux text-white border-brand-bordeaux" : "bg-white text-brand-navy/60 border-brand-bordeaux/10"
                  )}
                >
                  {type}
                </button>
              ))}
              {customContentTypes.map(type => (
                <span
                  key={type}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                    contentType === type ? "bg-brand-bordeaux text-white border-brand-bordeaux" : "bg-white text-brand-navy/60 border-brand-bordeaux/10"
                  )}
                >
                  <button onClick={() => setContentType(type)}>{type}</button>
                  <button
                    onClick={() => {
                      persistCustomTypes(customContentTypes.filter(t => t !== type));
                      if (contentType === type) setContentType('Baromètre');
                    }}
                    className="ml-0.5 opacity-70 hover:opacity-100"
                    aria-label="remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {addingContentType ? (
                <input
                  autoFocus
                  type="text"
                  value={newContentType}
                  onChange={(e) => setNewContentType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = newContentType.trim();
                      if (v && !customContentTypes.includes(v)) {
                        persistCustomTypes([...customContentTypes, v]);
                        setContentType(v);
                      }
                      setNewContentType('');
                      setAddingContentType(false);
                    } else if (e.key === 'Escape') {
                      setNewContentType('');
                      setAddingContentType(false);
                    }
                  }}
                  onBlur={() => { setAddingContentType(false); setNewContentType(''); }}
                  placeholder={t('gen.customTypePh')}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-brand-bordeaux/30 bg-white text-brand-bordeaux focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setAddingContentType(true)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-dashed border-brand-bordeaux/30 text-brand-bordeaux hover:bg-brand-bordeaux/5"
                >
                  +
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="input-label">{t('gen.target')}</label>
            <div className="flex flex-wrap gap-2">
              {['Professionnels de sante', 'Decideurs', 'Etudiants', 'Grand public', 'Partenaires', 'Academiques'].map(c => (
                <button
                  key={c}
                  onClick={() => toggleCible(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                    cibles.includes(c) ? "bg-brand-teal text-white border-brand-teal" : "bg-white text-brand-navy/60 border-brand-bordeaux/10"
                  )}
                >
                  {c}
                </button>
              ))}
              {customAudiences.map(c => (
                <span
                  key={c}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                    cibles.includes(c) ? "bg-brand-teal text-white border-brand-teal" : "bg-white text-brand-navy/60 border-brand-bordeaux/10"
                  )}
                >
                  <button onClick={() => toggleCible(c)}>{c}</button>
                  <button
                    onClick={() => {
                      persistCustomAudiences(customAudiences.filter(x => x !== c));
                      setCibles(prev => prev.filter(x => x !== c));
                    }}
                    className="ml-0.5 opacity-70 hover:opacity-100"
                    aria-label="remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {addingAudience ? (
                <input
                  autoFocus
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = newAudience.trim();
                      if (v && !customAudiences.includes(v)) {
                        persistCustomAudiences([...customAudiences, v]);
                        setCibles(prev => [...prev, v]);
                      }
                      setNewAudience('');
                      setAddingAudience(false);
                    } else if (e.key === 'Escape') {
                      setNewAudience('');
                      setAddingAudience(false);
                    }
                  }}
                  onBlur={() => { setAddingAudience(false); setNewAudience(''); }}
                  placeholder={t('gen.customAudiencePh')}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-brand-teal/30 bg-white text-brand-teal focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setAddingAudience(true)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-dashed border-brand-teal/30 text-brand-teal hover:bg-brand-teal/5"
                >
                  +
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">{t('gen.length')}</label>
              <select 
                value={postLength}
                onChange={(e) => setPostLength(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Short">{t('gen.lengthShort')}</option>
                <option value="Medium">{t('gen.lengthMedium')}</option>
                <option value="Long">{t('gen.lengthLong')}</option>
              </select>
            </div>
            <div>
              <label className="input-label">{t('gen.language')}</label>
              <div className="flex bg-brand-warm-white p-1 rounded-lg border border-brand-bordeaux/10">
                {['FR', 'EN', 'FR+EN'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={cn(
                      "flex-1 py-1 rounded-md font-body font-bold text-[10px] transition-all",
                      language === lang ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="input-label">{t('gen.platform')}</label>
            <div className="flex bg-brand-warm-white p-1 rounded-lg border border-brand-bordeaux/10">
              {['LinkedIn', 'WhatsApp'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p as Platform)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md font-body font-bold text-xs transition-all",
                    platform === p ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-brand-bordeaux/5 pt-4">
            <button
              onClick={() => setIsHashtagsExpanded(!isHashtagsExpanded)}
              className="flex items-center justify-between w-full text-brand-bordeaux font-bold text-xs uppercase tracking-widest"
            >
              {t('gen.hashtags')}
              {isHashtagsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {isHashtagsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3 space-y-2"
                >
                  {DEFAULT_HASHTAG_SETS.map(set => (
                    <button
                      key={set.name}
                      onClick={() => setSelectedHashtagSet(selectedHashtagSet === set.name ? null : set.name)}
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-md text-[10px] font-medium transition-all",
                        selectedHashtagSet === set.name ? "bg-brand-bordeaux/10 text-brand-bordeaux" : "hover:bg-brand-bordeaux/5 text-brand-navy/60"
                      )}
                    >
                      <span className="font-bold">{set.name}</span>
                      <span className="block text-brand-navy/40 truncate mt-0.5">{set.hashtags.join(' ')}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-brand-bordeaux/5 pt-4">
            <button
              onClick={() => setIsContextExpanded(v => !v)}
              className="flex items-center justify-between w-full text-brand-bordeaux font-bold text-xs uppercase tracking-widest"
            >
              <span className="flex items-center gap-2">
                {t('gen.context.title')}
                {activeContextCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-teal text-white text-[9px] font-bold normal-case tracking-normal">
                    {activeContextCount} {t('gen.context.sourcesActive')}
                  </span>
                )}
              </span>
              {isContextExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {isContextExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3 space-y-3"
                >
                  {contextLibrary.length === 0 && (
                    <p className="text-[11px] text-brand-navy/50">
                      {t('gen.context.empty')}
                    </p>
                  )}
                  {contextLibrary.map(entry => {
                    const active = activeContextIds.includes(entry.id);
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "rounded-md border p-3 transition-all",
                          active ? "border-brand-teal/40 bg-brand-teal/5" : "border-brand-bordeaux/10 bg-white"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleContextActive(entry.id)}
                            className="mt-1 accent-brand-teal"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-brand-bordeaux truncate">{entry.title}</p>
                            <p className="text-[11px] text-brand-navy/60 line-clamp-2 mt-0.5">{entry.content}</p>
                          </div>
                          <button
                            onClick={() => removeContextEntry(entry.id)}
                            className="text-brand-navy/30 hover:text-brand-coral"
                            title={t('gen.context.remove')}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {contextLibrary.length < 5 && (
                    <div className="space-y-2 pt-2 border-t border-brand-bordeaux/5">
                      <input
                        type="text"
                        value={newContextTitle}
                        onChange={(e) => setNewContextTitle(e.target.value)}
                        placeholder={t('gen.context.titlePh')}
                        className="input-field text-xs"
                      />
                      <textarea
                        rows={3}
                        value={newContextBody}
                        onChange={(e) => setNewContextBody(e.target.value)}
                        placeholder={t('gen.context.bodyPh')}
                        className="input-field resize-none text-xs"
                      />
                      <button
                        onClick={addContextEntry}
                        disabled={!newContextTitle.trim() || !newContextBody.trim()}
                        className="text-[10px] font-bold text-brand-teal uppercase tracking-widest disabled:opacity-40"
                      >
                        {t('gen.context.add')}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <button
              data-tour="generate-button"
              onClick={handleGenerate}
              disabled={isGenerating || !selectedVoice || (mode === 'generate' ? !topic : !draftInput)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                  {t('gen.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {mode === 'generate' ? t('gen.generateBtn') : t('gen.refineBtn')}
                </>
              )}
            </button>
            {!selectedVoice && (
              <p className="text-center text-[10px] font-bold text-brand-coral uppercase tracking-widest">
                {t('gen.selectVoice')}
              </p>
            )}
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-8">
          <div className="card min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <label className="input-label">{t('gen.output')}</label>
              <span className={cn(
                "text-[10px] font-bold",
                countWords(generatedContent) > getLengthBounds(postLength).max ? "text-brand-coral" : "text-brand-navy/40"
              )}>
                {countWords(generatedContent)} {t('gen.wordsMax')} {getLengthBounds(postLength).max} | {generatedContent.length} {t('gen.chars')}
              </span>
            </div>
            {lengthWarning && (
              <div className="mb-3 px-3 py-2 bg-brand-coral/10 border border-brand-coral/30 rounded-md text-[11px] font-bold text-brand-coral">
                {lengthWarning}
              </div>
            )}
            {generationError && (
              <div className="mb-3 px-3 py-2 bg-brand-bordeaux/10 border border-brand-bordeaux/30 rounded-md text-[11px] font-semibold text-brand-bordeaux">
                {generationError}
              </div>
            )}

            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="flex-1 w-full bg-brand-warm-white/30 border-l-4 border-brand-bordeaux p-6 font-body text-sm leading-relaxed resize-none focus:outline-none"
              placeholder={t('gen.placeholder')}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={handleGenerate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-brand-bordeaux/10 rounded-lg text-[10px] font-bold text-brand-bordeaux uppercase tracking-widest hover:bg-brand-bordeaux/5 transition-all"
              >
                <RotateCcw className="w-3 h-3" /> {t('gen.regenerate')}
              </button>
              <button
                onClick={handleCopy}
                disabled={!generatedContent.trim()}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                  justCopied
                    ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                    : "border-brand-bordeaux/10 text-brand-bordeaux hover:bg-brand-bordeaux/5"
                )}
              >
                {justCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {justCopied ? t('gen.copied') : t('gen.copy')}
              </button>
              <button
                onClick={openSaveCal}
                disabled={!generatedContent.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-brand-bordeaux/10 rounded-lg text-[10px] font-bold text-brand-bordeaux uppercase tracking-widest hover:bg-brand-bordeaux/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CalendarIcon className="w-3 h-3" /> {t('gen.saveCal')}
              </button>
              <button
                onClick={openVisualGenerator}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-brand-bordeaux/10 rounded-lg text-[10px] font-bold text-brand-teal uppercase tracking-widest hover:bg-brand-teal/5 transition-all"
              >
                <ImageIcon className="w-3 h-3" /> {t('gen.genVisual')}
              </button>
              <button
                onClick={() => setFlagged(f => !f)}
                title={flagged ? t('gen.unflag') : t('gen.flag')}
                className={cn(
                  "p-2 border rounded-lg transition-all",
                  flagged
                    ? "bg-brand-coral/10 border-brand-coral text-brand-coral"
                    : "border-brand-bordeaux/10 text-brand-coral hover:bg-brand-coral/5"
                )}
              >
                <Flag className="w-4 h-4" fill={flagged ? '#D4614A' : 'none'} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showVisualGenerator && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="card space-y-6 overflow-hidden"
              >
                <h3 className="font-headline text-2xl text-brand-teal">{t('gen.visualGen')}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="input-label">{t('gen.visualHeadline')}</label>
                    <input
                      type="text"
                      value={visualHeadline}
                      onChange={(e) => setVisualHeadline(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">{t('gen.visualSubtitle')}</label>
                    <input
                      type="text"
                      value={visualSubtitle}
                      onChange={(e) => setVisualSubtitle(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('gen.visualStats')}</label>
                  <textarea
                    rows={3}
                    value={visualStats}
                    onChange={(e) => setVisualStats(e.target.value)}
                    className="input-field resize-none"
                  />
                </div>
                <button
                  onClick={handleGenerateVisual}
                  disabled={isGeneratingVisual}
                  className="btn-secondary w-full"
                >
                  {isGeneratingVisual ? t('gen.genVisualBtnLoading') : t('gen.genVisualBtn')}
                </button>

                {visualSvg && (
                  <div className="mt-8 space-y-4">
                    <div 
                      id="visual-preview"
                      className="w-full bg-white border border-brand-bordeaux/10 rounded-lg overflow-hidden shadow-inner"
                      dangerouslySetInnerHTML={{ __html: sanitizeSvg(visualSvg) }}
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={handleDownloadPng}
                        className="flex-1 py-2 border border-brand-teal/20 rounded-lg text-[10px] font-bold text-brand-teal uppercase tracking-widest hover:bg-brand-teal/5 transition-all"
                      >
                        {t('gen.downloadPng')}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-brand-navy/5 rounded-xl p-8 border border-brand-bordeaux/5">
            <h3 className="text-[10px] font-bold text-brand-coral uppercase tracking-widest mb-6">
              {platform === 'LinkedIn' ? t('gen.linkedinPreview') : t('gen.whatsappPreview')}
            </h3>
            
            {platform === 'LinkedIn' ? (
              <div className="bg-white rounded-md shadow-sm border border-black/5 overflow-hidden max-w-[550px] mx-auto">
                <div className="p-3 flex items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-headline font-bold text-xl"
                    style={{ backgroundColor: selectedVoice?.avatarColor || '#6B1E2E' }}
                  >
                    {selectedVoice?.name.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black/90">{selectedVoice?.name || 'User Name'}</p>
                    <p className="text-[10px] text-black/60 truncate max-w-[300px]">{selectedVoice?.role || 'Professional Role'}</p>
                    <p className="text-[10px] text-black/40">1h • 🌐</p>
                  </div>
                </div>
                <div className="px-4 pb-4 text-sm text-black/90 whitespace-pre-wrap">
                  {generatedContent || t('gen.previewPlaceholder')}
                </div>
                {visualSvg && (
                  <div className="px-4 pb-4">
                    <div 
                      className="w-full rounded-md overflow-hidden border border-black/5"
                      dangerouslySetInnerHTML={{ __html: sanitizeSvg(visualSvg) }}
                    />
                  </div>
                )}
                <div className="border-t border-black/5 p-2 flex justify-around">
                  {['Like', 'Comment', 'Repost', 'Send'].map(action => (
                    <button key={action} className="text-xs font-bold text-black/60 hover:bg-black/5 px-4 py-2 rounded-md transition-all">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-[350px] mx-auto">
                <div className="bg-[#E2FED6] rounded-2xl rounded-tl-none p-4 shadow-sm relative">
                  <div className="text-sm text-black/90 whitespace-pre-wrap">
                    {generatedContent || t('gen.previewPlaceholder')}
                  </div>
                  <div className="text-[10px] text-black/40 text-right mt-1">
                    10:45 AM
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save-to-Calendar Modal */}
      <AnimatePresence>
        {saveCalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSaveCalOpen(false)}
              className="fixed inset-0 bg-brand-navy/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[110] p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-2xl text-brand-bordeaux">{t('gen.saveCalTitle')}</h3>
                <button onClick={() => setSaveCalOpen(false)} className="p-2 hover:bg-brand-navy/5 rounded-full text-brand-navy/40">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="input-label">{t('gen.titleLabel')}</label>
                  <input
                    type="text"
                    value={calForm.title}
                    onChange={(e) => setCalForm({ ...calForm, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">{t('gen.voiceLabel')}</label>
                    <input
                      type="text"
                      value={calForm.voice}
                      onChange={(e) => setCalForm({ ...calForm, voice: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">{t('gen.dateLabel')}</label>
                    <input
                      type="date"
                      value={calForm.date}
                      onChange={(e) => setCalForm({ ...calForm, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('gen.statusLabel')}</label>
                  <select
                    value={calForm.status}
                    onChange={(e) => setCalForm({ ...calForm, status: e.target.value as PostStatus })}
                    className="input-field"
                  >
                    {(['A rediger', 'Brouillon', 'Pret', 'Publie'] as PostStatus[]).map(s => (
                      <option key={s} value={s}>{t(`status.${s}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setSaveCalOpen(false)} className="px-4 py-2 text-brand-navy/60 font-bold text-sm">{t('gen.cancelBtn')}</button>
                <button onClick={confirmSaveCal} disabled={!calForm.title || !calForm.date} className="btn-primary py-2">{t('gen.saveBtn')}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-bordeaux text-white px-5 py-3 rounded-lg shadow-lg text-xs font-bold uppercase tracking-widest z-[200]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voices Slide-over */}
      <AnimatePresence>
        {isVoiceCreatorOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVoiceCreatorOpen(false)}
              className="fixed inset-0 bg-brand-navy/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[110] p-12 overflow-y-auto"
            >
              <VoiceCreator 
                onClose={() => setIsVoiceCreatorOpen(false)}
                onSuccess={(newVoice) => {
                  setVoices(prev => [...prev, newVoice]);
                  setSelectedVoice(newVoice);
                  setIsVoiceCreatorOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
