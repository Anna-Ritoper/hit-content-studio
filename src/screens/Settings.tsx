import React, { useState, useEffect } from 'react';
import {
  Hash,
  Key,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { HashtagSet } from '../types';
import { CONTENT_GUIDELINES } from '../constants';
import { isDemoMode } from '../demoData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useI18n } from '../i18n';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Settings() {
  const { t } = useI18n();
  const [hashtagSets, setHashtagSets] = useState<HashtagSet[]>([]);
  const [newSetName, setNewSetName] = useState('');
  const [newSetTags, setNewSetTags] = useState('');
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'missing_key' | 'error' | 'demo'>('checking');
  const [demo, setDemo] = useState(isDemoMode());

  useEffect(() => {
    const handler = () => {
      const on = isDemoMode();
      setDemo(on);
      if (on) setApiStatus('demo');
    };
    window.addEventListener('demo-mode-change', handler);
    return () => window.removeEventListener('demo-mode-change', handler);
  }, []);

  useEffect(() => {
    fetchHashtagSets();
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    if (isDemoMode()) { setApiStatus('demo'); return; }
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiStatus(data.status === 'ok' ? 'ok' : 'missing_key');
    } catch {
      setApiStatus('error');
    }
  };

  const fetchHashtagSets = async () => {
    try {
      const q = query(collection(db, 'hashtagSets'));
      const querySnapshot = await getDocs(q);
      const sets = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as HashtagSet));
      setHashtagSets(sets);
    } catch (e) {
      console.error('fetch hashtags failed', e);
    }
  };

  const handleAddSet = async () => {
    if (!newSetName || !newSetTags) return;
    const hashtags = newSetTags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`);
    await addDoc(collection(db, 'hashtagSets'), { name: newSetName, hashtags });
    setNewSetName('');
    setNewSetTags('');
    setIsAddingSet(false);
    fetchHashtagSets();
  };

  const handleDeleteSet = async (id: string) => {
    await deleteDoc(doc(db, 'hashtagSets', id));
    fetchHashtagSets();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h1 className="font-headline text-4xl text-brand-bordeaux">{t('set.title')}</h1>
        <p className="font-body text-brand-navy/60 mt-2">{t('set.subtitle')}</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-bordeaux/10 pb-4">
          <Hash className="w-5 h-5 text-brand-bordeaux" />
          <h2 className="font-headline text-2xl text-brand-bordeaux">Hashtag Manager</h2>
        </div>

        <div className="space-y-4">
          {hashtagSets.map(set => (
            <div key={set.id} className="card p-4 flex items-center justify-between group">
              <div>
                <p className="font-bold text-brand-navy text-sm mb-1">{set.name}</p>
                <p className="text-[10px] text-brand-navy/40 font-mono">{set.hashtags.join(' ')}</p>
              </div>
              <button
                onClick={() => handleDeleteSet(set.id)}
                className="p-2 text-brand-navy/20 hover:text-brand-coral opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="pt-4">
            {isAddingSet ? (
              <div className="card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Set Name</label>
                    <input type="text" value={newSetName} onChange={(e) => setNewSetName(e.target.value)} className="input-field" placeholder="e.g. Innovation" />
                  </div>
                  <div>
                    <label className="input-label">Hashtags (comma separated)</label>
                    <input type="text" value={newSetTags} onChange={(e) => setNewSetTags(e.target.value)} className="input-field" placeholder="#Health, #Tech" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsAddingSet(false)} className="text-brand-navy/60 font-bold text-sm">Cancel</button>
                  <button onClick={handleAddSet} className="btn-primary py-2">Add Set</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAddingSet(true)} className="flex items-center gap-2 text-brand-bordeaux font-bold text-sm hover:underline">
                <Plus className="w-4 h-4" /> Add new hashtag set
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-bordeaux/10 pb-4">
          <Key className="w-5 h-5 text-brand-bordeaux" />
          <h2 className="font-headline text-2xl text-brand-bordeaux">API Configuration</h2>
        </div>
        <div className="card space-y-4">
          <p className="text-sm text-brand-navy/60">The API key is managed server-side.</p>
          <div className="pt-4 border-t border-brand-bordeaux/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                apiStatus === 'demo' ? "bg-brand-teal animate-pulse" : apiStatus === 'ok' ? "bg-brand-teal animate-pulse" : apiStatus === 'checking' ? "bg-brand-navy/20 animate-pulse" : "bg-brand-coral"
              )} />
              <p className="font-bold text-brand-navy text-sm">
                {apiStatus === 'demo' ? "Demo Mode (pas d'appel API)" : apiStatus === 'ok' ? 'Anthropic Claude Connected' : apiStatus === 'checking' ? 'Checking...' : 'Server not reachable'}
              </p>
              {demo && <CheckCircle2 className="w-3 h-3 text-brand-teal" />}
            </div>
            <p className="text-[10px] text-brand-navy/40 font-mono">
              {apiStatus === 'demo' ? 'Donnees fictives' : 'Model: claude-sonnet-4-6'}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-bordeaux/10 pb-4">
          <BookOpen className="w-5 h-5 text-brand-bordeaux" />
          <h2 className="font-headline text-2xl text-brand-bordeaux">Style Guide</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="card space-y-4">
            <h3 className="font-headline font-bold text-brand-navy flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-bordeaux" />
              Text Formatting Rules
            </h3>
            <ul className="space-y-2">
              {CONTENT_GUIDELINES.textFormatting.map((rule, i) => (
                <li key={i} className="text-sm text-brand-navy/70 flex gap-3">
                  <span className="text-brand-bordeaux font-bold">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div className="card space-y-4">
            <h3 className="font-headline font-bold text-brand-navy flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal" />
              Humanization Rules
            </h3>
            <ul className="space-y-2">
              {CONTENT_GUIDELINES.humanization.map((rule, i) => (
                <li key={i} className="text-sm text-brand-navy/70 flex gap-3">
                  <span className="text-brand-teal font-bold">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
