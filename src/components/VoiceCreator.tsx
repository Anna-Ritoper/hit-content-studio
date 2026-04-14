import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  ArrowRight,
  PenTool,
  Image as ImageIcon,
  Upload,
  X as CloseIcon,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { VoiceProfile, Language } from '../types';
import { analyseTone } from '../services/aiService';
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

interface VoiceCreatorProps {
  onClose: () => void;
  onSuccess: (newVoice: VoiceProfile) => void;
  initialVoice?: VoiceProfile;
}

export default function VoiceCreator({ onClose, onSuccess, initialVoice }: VoiceCreatorProps) {
  const isEdit = !!initialVoice;
  const [step, setStep] = useState(isEdit ? 3 : 1);
  const [isAnalysing, setIsAnalysing] = useState(false);

  // Form state
  const [name, setName] = useState(initialVoice?.name || '');
  const [role, setRole] = useState(initialVoice?.role || '');
  const [languages, setLanguages] = useState<Language[]>(initialVoice?.languages || ['FR']);
  const [avatarColor, setAvatarColor] = useState(initialVoice?.avatarColor || PRESET_COLORS[0]);
  const [inputMethod, setInputMethod] = useState<'text' | 'images'>('images');
  const [samplePosts, setSamplePosts] = useState(['']);
  const [sampleImages, setSampleImages] = useState<{ data: string; mimeType: string; preview: string }[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(
    initialVoice
      ? {
          styleTags: initialVoice.styleTags,
          structurePattern: initialVoice.structurePattern,
          formalityScore: initialVoice.formalityScore,
          emojiUsage: initialVoice.emojiUsage,
          languageNotes: initialVoice.languageNotes,
          sampleSentence: initialVoice.sampleSentence,
          systemPromptFragment: initialVoice.systemPromptFragment,
        }
      : null
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalyse = async () => {
    setIsAnalysing(true);
    setError(null);
    try {
      const result = await analyseTone({
        posts: inputMethod === 'text' ? samplePosts.filter(p => p.trim()) : undefined,
        images: inputMethod === 'images' ? sampleImages.map(img => ({ data: img.data, mimeType: img.mimeType })) : undefined,
      });
      setAnalysisResult(result);
      setStep(3);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "API call failed. Please check your key and try again.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (sampleImages.length + files.length > 10) {
      alert("Maximum 10 images allowed.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSampleImages(prev => [...prev, {
          data: base64String,
          mimeType: file.type,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    const base = {
      name,
      role,
      languages,
      avatarColor,
      ...analysisResult,
      updatedAt: Timestamp.now(),
    };
    if (isEdit && initialVoice) {
      await updateDoc(doc(db, 'voiceProfiles', initialVoice.id), base);
      onSuccess({ ...initialVoice, ...base } as VoiceProfile);
    } else {
      const newVoiceData = { ...base, createdAt: Timestamp.now() };
      const docRef = await addDoc(collection(db, 'voiceProfiles'), newVoiceData);
      onSuccess({ id: docRef.id, ...newVoiceData } as VoiceProfile);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-3xl font-bold text-brand-bordeaux">{isEdit ? 'Edit Voice' : 'Create Voice'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-brand-navy/5 rounded-full text-brand-navy/40">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
              step === s ? "bg-brand-bordeaux text-white" : step > s ? "bg-brand-teal text-white" : "bg-brand-navy/5 text-brand-navy/40"
            )}>
              {step > s ? <Check className="w-3 h-3" /> : s}
            </div>
            {s < 3 && <div className="w-8 h-[1px] bg-brand-navy/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="font-headline text-2xl text-brand-bordeaux">Step 1: Identity Card</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Full name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. Simone Whale"
                />
              </div>
              <div>
                <label className="input-label">Professional role</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field" 
                  placeholder="e.g. Lead Advisor, International Programs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Language profile</label>
                <div className="flex bg-brand-warm-white p-1 rounded-lg border border-brand-bordeaux/10">
                  {['FR', 'EN', 'Both'].map(l => (
                    <button
                      key={l}
                      onClick={() => setLanguages(l === 'Both' ? ['FR', 'EN'] : [l as Language])}
                      className={cn(
                        "flex-1 py-1.5 rounded-md font-body font-bold text-[10px] transition-all",
                        (l === 'Both' ? languages.length === 2 : languages.includes(l as Language) && languages.length === 1) ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="input-label">Avatar color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setAvatarColor(c)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all",
                        avatarColor === c ? "ring-2 ring-brand-bordeaux ring-offset-2 scale-110" : "hover:scale-110"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!name || !role}
                className="btn-primary flex items-center gap-2"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-2xl text-brand-bordeaux">Step 2: Sample Content</h3>
              <div className="flex bg-brand-navy/5 p-1 rounded-lg">
                <button
                  onClick={() => setInputMethod('images')}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2",
                    inputMethod === 'images' ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40"
                  )}
                >
                  <ImageIcon className="w-3 h-3" /> Upload screenshots
                </button>
                <button
                  onClick={() => setInputMethod('text')}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2",
                    inputMethod === 'text' ? "bg-white text-brand-bordeaux shadow-sm" : "text-brand-navy/40"
                  )}
                >
                  <PenTool className="w-3 h-3" /> Paste text
                </button>
              </div>
            </div>

            {inputMethod === 'images' ? (
              <div className="space-y-6">
                <p className="text-sm text-brand-navy/60">Upload up to 10 screenshots of LinkedIn posts. Claude will read the text and analyze the tone.</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {sampleImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-lg border border-brand-bordeaux/10 overflow-hidden group">
                      <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setSampleImages(sampleImages.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-brand-coral opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <CloseIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {sampleImages.length < 10 && (
                    <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-brand-bordeaux/10 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-bordeaux/5 transition-all">
                      <Upload className="w-6 h-6 text-brand-bordeaux/20 mb-2" />
                      <span className="text-[10px] font-bold text-brand-navy/40">Upload</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-brand-navy/60">Paste 3-5 LinkedIn posts from this person to extract their unique writing style.</p>
                
                <div className="space-y-4">
                  {samplePosts.map((post, idx) => (
                    <div key={idx} className="relative">
                      <textarea
                        rows={4}
                        value={post}
                        onChange={(e) => {
                          const newPosts = [...samplePosts];
                          newPosts[idx] = e.target.value;
                          setSamplePosts(newPosts);
                        }}
                        placeholder={`Paste post #${idx + 1} here...`}
                        className="input-field resize-none pr-10"
                      />
                      {samplePosts.length > 1 && (
                        <button 
                          onClick={() => setSamplePosts(samplePosts.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 text-brand-navy/20 hover:text-brand-coral"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {samplePosts.length < 5 && (
                    <button 
                      onClick={() => setSamplePosts([...samplePosts, ''])}
                      className="text-xs font-bold text-brand-bordeaux flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Add another post
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-lg flex items-center gap-2 text-brand-coral text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="pt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-brand-navy/60 font-bold text-sm">Back</button>
              <button 
                onClick={handleAnalyse}
                disabled={isAnalysing || (inputMethod === 'text' ? samplePosts.every(p => !p.trim()) : sampleImages.length === 0)}
                className="btn-primary flex items-center gap-2"
              >
                {isAnalysing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RotateCcwIcon className="w-4 h-4" /></motion.div>
                    Analysing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Analyse Tone
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && analysisResult && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h3 className="font-headline text-2xl text-brand-bordeaux">Step 3: AI Analysis Result</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="input-label">Writing style tags</label>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.styleTags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-brand-bordeaux text-white text-[10px] font-bold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Structure pattern</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {analysisResult.structurePattern.map((step: string, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className="px-3 py-1 bg-brand-navy/5 text-brand-navy text-[10px] font-medium rounded-md whitespace-nowrap">
                          {step}
                        </span>
                        {idx < analysisResult.structurePattern.length - 1 && <ArrowRight className="w-3 h-3 text-brand-navy/20 flex-shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="input-label">Formality Score: {analysisResult.formalityScore}/10</label>
                  <div className="h-2 bg-brand-navy/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisResult.formalityScore * 10}%` }}
                      className="h-full bg-brand-bordeaux"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Emoji Usage</label>
                  <p className="text-sm font-bold text-brand-navy capitalize">{analysisResult.emojiUsage}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Language Notes</label>
              <p className="text-sm italic text-brand-navy/80 leading-relaxed">{analysisResult.languageNotes}</p>
            </div>

            <div>
              <label className="input-label">Sample sentence</label>
              <blockquote className="border-l-4 border-brand-bordeaux pl-6 py-2 font-headline italic text-lg text-brand-navy">
                "{analysisResult.sampleSentence}"
              </blockquote>
            </div>

            <div className="pt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="text-brand-navy/60 font-bold text-sm">Back</button>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-brand-bordeaux/20 rounded-lg text-brand-bordeaux font-bold text-sm">Edit</button>
                <button onClick={handleSave} className="btn-secondary">Save Profile</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RotateCcwIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
