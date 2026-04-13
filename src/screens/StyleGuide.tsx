import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Lock,
  X as CloseIcon,
  Check,
  AlertCircle,
  BookOpen,
  Ban,
  MessageSquare,
  Flag,
  Hand,
  Hash,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  'ban': Ban,
  'message-square': MessageSquare,
  'flag': Flag,
  'hand': Hand,
  'hash': Hash,
  'alert-circle': AlertCircle,
  'sparkles': Sparkles,
  'check': Check,
  'book-open': BookOpen,
};

function RuleIcon({ name, color }: { name: string; color: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span className="text-2xl leading-none">{name}</span>;
  return <Icon className="w-6 h-6" style={{ color }} strokeWidth={2} />;
}
import { db } from '../firebase';
import { useI18n } from '../i18n';
import {
  collection, 
  query, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { StyleRule, StyleCategory } from '../types';
import { HARDCODED_STYLE_RULES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES: StyleCategory[] = ['Formatage', 'Ton', 'Langue', 'Contenu', 'Autre'];

export default function StyleGuide() {
  const { t } = useI18n();
  const [userRules, setUserRules] = useState<StyleRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<StyleRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StyleCategory>('Formatage');
  const [icon, setIcon] = useState('sparkles');

  useEffect(() => { fetchUserRules(); }, []);

  const fetchUserRules = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'styleRules'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const rules = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as StyleRule));
      setUserRules(rules);
    } catch (error) {
      console.error("Error fetching style rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (rule?: StyleRule) => {
    if (rule) {
      setEditingRule(rule);
      setTitle(rule.title);
      setDescription(rule.description);
      setCategory(rule.category);
      setIcon(rule.icon);
    } else {
      setEditingRule(null);
      setTitle('');
      setDescription('');
      setCategory('Formatage');
      setIcon('sparkles');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const ruleData = {
      title,
      description,
      category,
      icon,
      isLocked: false,
      updatedAt: Timestamp.now(),
    };

    try {
      if (editingRule) {
        await updateDoc(doc(db, 'styleRules', editingRule.id), ruleData);
      } else {
        await addDoc(collection(db, 'styleRules'), {
          ...ruleData,
          createdAt: Timestamp.now(),
        });
      }
      fetchUserRules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving style rule:", error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Supprimer cette règle ?")) return;
    try {
      await deleteDoc(doc(db, 'styleRules', id));
      fetchUserRules();
    } catch (error) {
      console.error("Error deleting style rule:", error);
    }
  };

  const BORDER_CYCLE = ['#6B1E2E', '#E07065', '#2A7D6B', '#D4A017'];
  const allRules = [...HARDCODED_STYLE_RULES, ...userRules];

  return (
    <div className="max-w-7xl mx-auto space-y-12" data-tour="module-styleguide">
      <header>
        <h1 className="font-headline text-4xl font-bold text-brand-bordeaux mb-2">{t('sg.title')}</h1>
        <p className="font-body text-brand-navy/60">{t('sg.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allRules.map((rule, idx) => (
          <motion.div
            key={rule.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => !rule.isLocked && handleOpenModal(rule)}
            style={{ borderLeftWidth: 4, borderLeftColor: BORDER_CYCLE[idx % BORDER_CYCLE.length] }}
            className={cn(
              "relative bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 group",
              !rule.isLocked && "cursor-pointer hover:shadow-md hover:-translate-y-1"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <RuleIcon name={rule.icon} color={BORDER_CYCLE[idx % BORDER_CYCLE.length]} />
              {rule.isLocked ? (
                <Lock className="w-3 h-3 text-brand-navy/20" />
              ) : (
                <button 
                  onClick={(e) => handleDelete(rule.id, e)}
                  className="p-1.5 text-brand-navy/20 hover:text-brand-coral opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="font-bold text-brand-navy mb-2">{rule.title}</h3>
            <p className="text-xs text-brand-navy/60 leading-relaxed mb-4">{rule.description}</p>
            <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-bordeaux text-white">
              {rule.category}
            </span>
          </motion.div>
        ))}

        <button
          onClick={() => handleOpenModal()}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-brand-bordeaux hover:bg-brand-bordeaux/5 transition-all group min-h-[180px]"
        >
          <div className="w-10 h-10 rounded-full bg-brand-bordeaux/5 flex items-center justify-center text-brand-bordeaux mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-brand-bordeaux">{t('sg.add')}</span>
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-navy/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-brand-navy/5 rounded-full text-brand-navy/40"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <h2 className="font-headline text-2xl font-bold text-brand-bordeaux mb-6">
                {editingRule ? t('sg.editRule') : t('sg.newRule')}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="input-label">Titre</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    placeholder="ex: Pas de jargon"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Expliquez la règle en quelques mots..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Catégorie</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value as StyleCategory)}
                      className="input-field"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Icône</label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="input-field"
                    >
                      {Object.keys(ICON_MAP).map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-brand-bordeaux/20 rounded-xl text-brand-bordeaux font-bold text-sm"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
