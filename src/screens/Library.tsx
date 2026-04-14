import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Copy,
  Download,
  Save,
  RotateCcw
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { useI18n } from '../i18n';
import { Draft, PostStatus } from '../types';
import { format } from 'date-fns';
import { isDemoMode, DEMO_DRAFTS } from '../demoData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STATUS_COLORS: Record<string, string> = {
  'A rediger': 'bg-gray-100 text-gray-600',
  'Brouillon': 'bg-amber-100 text-amber-600',
  'Pret': 'bg-brand-teal/10 text-brand-teal',
  'Publie': 'bg-brand-bordeaux text-white',
};

const STATUS_OPTIONS: PostStatus[] = ['A rediger', 'Brouillon', 'Pret', 'Publie'];

export default function Library() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [demo, setDemo] = useState(isDemoMode());

  // Listen for demo mode changes
  useEffect(() => {
    const handler = () => setDemo(isDemoMode());
    window.addEventListener('demo-mode-change', handler);
    return () => window.removeEventListener('demo-mode-change', handler);
  }, []);

  useEffect(() => { fetchDrafts(); }, []);

  const fetchDrafts = async () => {
    try {
      const q = query(collection(db, 'drafts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const draftsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Draft));
      setDrafts(draftsData);
    } catch (e) {
      console.error('fetch drafts failed', e);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'drafts', id));
    if (selectedDraft?.id === id) setSelectedDraft(null);
    fetchDrafts();
  };

  const handleSaveEdit = async () => {
    if (!selectedDraft) return;
    setIsSaving(true);
    await updateDoc(doc(db, 'drafts', selectedDraft.id), {
      editedText: editText,
      updatedAt: Timestamp.now(),
    });
    const updated = { ...selectedDraft, editedText: editText };
    setSelectedDraft(updated);
    setDrafts(prev => prev.map(d => d.id === updated.id ? updated : d));
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleStatusChange = async (id: string, status: PostStatus) => {
    await updateDoc(doc(db, 'drafts', id), { status, updatedAt: Timestamp.now() });
    if (selectedDraft?.id === id) {
      setSelectedDraft({ ...selectedDraft, status });
    }
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const openInGenerate = (draft: Draft) => {
    const params = new URLSearchParams({
      topic: draft.topic,
      voice: draft.voiceName,
      platform: draft.platform,
      language: draft.language,
      mode: 'refine',
      draft: draft.editedText || draft.generatedText,
    });
    navigate(`/generate?${params.toString()}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExport = (draft: Draft) => {
    const text = draft.editedText || draft.generatedText;
    const header = `Voice: ${draft.voiceName}\nPlatform: ${draft.platform}\nLanguage: ${draft.language}\nTopic: ${draft.topic}\nType: ${draft.contentType}\nStatus: ${draft.status}\n\n---\n\n`;
    const blob = new Blob([header + text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draft-${draft.voiceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditing = () => {
    if (!selectedDraft) return;
    setEditText(selectedDraft.editedText || selectedDraft.generatedText);
    setIsEditing(true);
  };

  const allDrafts = demo ? [...DEMO_DRAFTS, ...drafts] : drafts;

  const filteredDrafts = allDrafts.filter(d =>
    d.topic.toLowerCase().includes(search.toLowerCase()) ||
    d.voiceName.toLowerCase().includes(search.toLowerCase()) ||
    (d.editedText || d.generatedText).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto" data-tour="module-library">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold text-brand-bordeaux uppercase tracking-[0.2em] mb-2 block">{t('lib.repo')}</span>
          <h1 className="font-headline font-bold text-5xl text-brand-bordeaux">{t('lib.title')}</h1>
          <p className="font-body text-brand-navy/60 mt-4 text-lg max-w-2xl">
            {t('lib.subtitle')}
          </p>
        </div>
      </header>

      <div className="mb-10 flex flex-col md:flex-row gap-4">
        <div data-tour="library-search" className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('lib.search')}
            className="input-field pl-12"
          />
        </div>
      </div>

      {filteredDrafts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-brand-navy/40 text-lg">{t('lib.empty')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrafts.map(draft => (
          <motion.div
            key={draft.id}
            layoutId={draft.id}
            onClick={() => { setSelectedDraft(draft); setIsEditing(false); }}
            className="card p-6 cursor-pointer group hover:border-brand-bordeaux/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-bordeaux flex items-center justify-center text-white text-[10px] font-bold">
                  {draft.voiceName.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-navy">{draft.voiceName}</p>
                  <p className="text-[8px] text-brand-navy/40 uppercase tracking-widest">{draft.platform} | {draft.language}</p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter",
                STATUS_COLORS[draft.status] || 'bg-gray-100 text-gray-600'
              )}>
                {draft.status}
              </span>
            </div>

            <p className="text-sm text-brand-navy/80 line-clamp-3 mb-6 leading-relaxed">
              {draft.editedText || draft.generatedText}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-brand-bordeaux/5">
              <span className="text-[10px] text-brand-navy/40">
                {draft.createdAt && format((draft.createdAt as any).toDate(), 'MMM d, yyyy')}
              </span>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); openInGenerate(draft); }}
                  className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-md text-[9px] font-bold uppercase tracking-widest hover:bg-brand-teal/20 flex items-center gap-1"
                  title="Refine in Generate"
                >
                  <RotateCcw className="w-3 h-3" /> Refine
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(draft.id); }}
                  className="text-brand-navy/40 hover:text-brand-coral"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDraft && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedDraft(null); setIsEditing(false); }}
              className="fixed inset-0 bg-brand-navy/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] p-12 overflow-y-auto"
            >
              <button
                onClick={() => { setSelectedDraft(null); setIsEditing(false); }}
                className="absolute top-8 right-8 text-brand-navy/40 hover:text-brand-navy"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                <header>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand-bordeaux flex items-center justify-center text-white text-xl font-headline font-bold">
                      {selectedDraft.voiceName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-headline text-3xl text-brand-bordeaux">{selectedDraft.voiceName}</h2>
                      <p className="text-xs text-brand-navy/60 uppercase tracking-widest">{selectedDraft.platform} | {selectedDraft.language}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <select
                      value={selectedDraft.status}
                      onChange={(e) => handleStatusChange(selectedDraft.id, e.target.value as PostStatus)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest appearance-none cursor-pointer",
                        STATUS_COLORS[selectedDraft.status] || 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="px-3 py-1 bg-brand-navy/5 text-brand-navy/60 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {selectedDraft.contentType}
                    </span>
                  </div>
                </header>

                <div className="space-y-2">
                  <label className="input-label">Topic</label>
                  <p className="text-lg font-bold text-brand-navy">{selectedDraft.topic}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="input-label">Post Content</label>
                    <span className="text-[10px] text-brand-navy/40">
                      {(isEditing ? editText : (selectedDraft.editedText || selectedDraft.generatedText)).length} chars
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={16}
                      className="w-full bg-brand-warm-white/30 border-l-4 border-brand-teal p-8 font-body text-sm leading-relaxed resize-none focus:outline-none"
                    />
                  ) : (
                    <div className="bg-brand-warm-white/30 border-l-4 border-brand-bordeaux p-8 font-body text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedDraft.editedText || selectedDraft.generatedText}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-8 border-t border-brand-bordeaux/10">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-brand-bordeaux/20 rounded-lg text-brand-navy/60 font-bold text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={startEditing}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => openInGenerate(selectedDraft)}
                        className="px-6 py-3 border border-brand-teal/20 rounded-lg text-brand-teal font-bold text-sm flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Reopen in Generate
                      </button>
                      <button
                        onClick={() => handleCopy(selectedDraft.editedText || selectedDraft.generatedText)}
                        className="px-6 py-3 border border-brand-bordeaux/20 rounded-lg text-brand-bordeaux font-bold text-sm flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" /> Copy
                      </button>
                      <button
                        onClick={() => handleExport(selectedDraft)}
                        className="px-6 py-3 border border-brand-bordeaux/20 rounded-lg text-brand-bordeaux font-bold text-sm flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Export .txt
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
