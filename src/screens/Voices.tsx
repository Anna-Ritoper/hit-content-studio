import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Edit3,
  ArrowRight,
  Languages,
  PenTool,
  Image as ImageIcon,
  Upload,
  X as CloseIcon,
  RotateCcw
} from 'lucide-react';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { VoiceProfile, Language, EmojiUsage } from '../types';
import { SIMONE_WHALE_DEFAULT } from '../constants';
import { analyseTone } from '../services/aiService';
import VoiceCreator from '../components/VoiceCreator';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRESET_COLORS = [
  '#6B1E2E', // Bordeaux
  '#D4614A', // Coral
  '#2A7D6B', // Teal
  '#1A1F3C', // Navy
  '#F59E0B', // Amber
  '#10B981', // Sage
  '#EC4899', // Dusty Rose
  '#374151', // Charcoal
];

export default function Voices() {
  const [user] = useAuthState(auth);
  const [voices, setVoices] = useState<VoiceProfile[]>([SIMONE_WHALE_DEFAULT]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchVoices();
    }
  }, [user]);

  const fetchVoices = async () => {
    const q = query(collection(db, 'voiceProfiles'));
    const querySnapshot = await getDocs(q);
    const voicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VoiceProfile));
    setVoices(voicesData);

    // Seed Simone if empty and user is admin
    const isAdmin = user?.email === 'anna.ritoper@gmail.com';
    if (voicesData.length === 0 && isAdmin) {
      const { id, ...simoneData } = SIMONE_WHALE_DEFAULT;
      await addDoc(collection(db, 'voiceProfiles'), simoneData);
      fetchVoices();
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">
      {/* Left Side - List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl text-brand-bordeaux">Voices</h2>
          <button 
            onClick={() => setIsCreating(true)}
            className="p-2 bg-brand-bordeaux text-white rounded-full hover:bg-brand-bordeaux/90 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {voices.map(voice => (
            <div key={voice.id} className="card p-4 hover:border-brand-bordeaux/30 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-headline font-bold"
                  style={{ backgroundColor: voice.avatarColor }}
                >
                  {voice.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">{voice.name}</p>
                  <p className="text-[10px] text-brand-navy/60 truncate">{voice.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {voice.styleTags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-brand-bordeaux/5 text-brand-bordeaux text-[8px] font-bold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-brand-bordeaux/5">
                <div className="flex gap-1">
                  {voice.languages.map(l => (
                    <span key={l} className="text-[8px] font-bold text-brand-navy/40">{l}</span>
                  ))}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="text-brand-navy/40 hover:text-brand-bordeaux"><Edit3 className="w-3 h-3" /></button>
                  <button className="text-brand-navy/40 hover:text-brand-coral"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Wizard */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-8"
            >
              <VoiceCreator 
                onClose={() => setIsCreating(false)} 
                onSuccess={() => {
                  setIsCreating(false);
                  fetchVoices();
                }} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-12"
            >
              <div className="w-20 h-20 bg-brand-bordeaux/5 rounded-full flex items-center justify-center text-brand-bordeaux mb-6">
                <PenTool className="w-10 h-10" />
              </div>
              <h3 className="font-headline text-3xl text-brand-bordeaux mb-4">Build AI Tone Profiles</h3>
              <p className="text-brand-navy/60 max-w-md mb-8">
                Extract the unique writing style of your team members to generate posts that sound exactly like them.
              </p>
              <button 
                onClick={() => setIsCreating(true)}
                className="btn-primary"
              >
                Create New Profile
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const RotateCcwIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
