import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Layout, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Trash2,
  Check,
  Type,
  BarChart2,
  Columns,
  MessageSquare,
  Palette,
  RotateCcw,
  Download,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { StyleRule } from '../types';
import { generateVisualSvg } from '../services/aiService';
import { formatStyleRules, HARDCODED_STYLE_RULES } from '../constants';
import { EDHEC_LOGO_PATH } from '../edhecLogo';
import PptxGenJS from 'pptxgenjs';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fetch the EDHEC logo SVG and convert to base64 PNG for PPTX embedding
async function fetchLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch(EDHEC_LOGO_PATH);
    const svgText = await res.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 520;
    canvas.height = img.naturalHeight || 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

type SlideType = 'cover' | 'content' | 'stat' | 'columns' | 'cta';
type BackgroundColor = 'bordeaux' | 'cream' | 'white' | 'blue';

interface Slide {
  id: string;
  type: SlideType;
  background: BackgroundColor;
  title: string;
  subtitle?: string;
  body?: string;
  statValue?: string;
  statLabel?: string;
  elements: {
    logo: boolean;
    swipe: boolean;
    pageNumber: boolean;
    footer: boolean;
  };
  isExpanded: boolean;
}

export default function Visuals() {
  const [user] = useAuthState(auth);
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState('');
  const [styleRules, setStyleRules] = useState<StyleRule[]>([]);
  
  // Quick Mode State
  const [quickFormat, setQuickFormat] = useState('Carrousel 5 slides');
  const [quickStyle, setQuickStyle] = useState('Bordeaux classique');
  const [quickProgramme, setQuickProgramme] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickKeyPoints, setQuickKeyPoints] = useState('');

  // Custom Mode State
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      type: 'cover',
      background: 'bordeaux',
      title: '',
      elements: { logo: true, swipe: true, pageNumber: true, footer: true },
      isExpanded: true
    }
  ]);

  const addSlide = () => {
    const newSlide: Slide = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'content',
      background: 'white',
      title: '',
      elements: { logo: true, swipe: true, pageNumber: true, footer: true },
      isExpanded: true
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (id: string) => {
    if (slides.length > 1) {
      setSlides(slides.filter(s => s.id !== id));
    }
  };

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleSlideExpansion = (id: string) => {
    setSlides(slides.map(s => s.id === id ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  const exportPptxQuick = async () => {
    const logoData = await fetchLogoBase64();
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 });
    pptx.layout = 'CUSTOM';

    const addLogo = (slide: ReturnType<typeof pptx.addSlide>) => {
      if (logoData) {
        slide.addImage({ data: logoData, x: 7.5, y: 6.6, w: 2, h: 0.46 });
      }
    };

    // Cover slide
    const cover = pptx.addSlide();
    cover.background = { color: '6B1E2E' };
    cover.addText(quickProgramme.toUpperCase(), { x: 0.8, y: 1, w: 8.4, h: 0.5, fontSize: 12, color: 'D4614A', fontFace: 'Arial', bold: true });
    cover.addText(quickTitle, { x: 0.8, y: 2, w: 8.4, h: 2, fontSize: 32, color: 'FFFFFF', fontFace: 'Arial', bold: true });
    addLogo(cover);

    // Content slides from key points
    const points = quickKeyPoints.split('\n').filter(p => p.trim());
    for (let i = 0; i < points.length; i++) {
      const slide = pptx.addSlide();
      slide.background = { color: 'FAF8F4' };
      slide.addText(`${i + 1}.`, { x: 0.8, y: 0.8, w: 1, h: 0.8, fontSize: 36, color: 'D4614A', fontFace: 'Arial', bold: true });
      slide.addText(points[i].trim(), { x: 0.8, y: 2, w: 8.4, h: 3, fontSize: 20, color: '1A1F3C', fontFace: 'Arial' });
      slide.addText(`${i + 2} / ${points.length + 2}`, { x: 8, y: 6.5, w: 1.5, h: 0.5, fontSize: 9, color: '999999', fontFace: 'Arial', align: 'right' });
      addLogo(slide);
    }

    // Closing slide
    const closing = pptx.addSlide();
    closing.background = { color: '1A1F3C' };
    closing.addText('Chaire Management in Innovative Health', { x: 0.8, y: 2.5, w: 8.4, h: 1.5, fontSize: 24, color: 'FFFFFF', fontFace: 'Arial', bold: true, align: 'center' });
    addLogo(closing);

    await pptx.writeFile({ fileName: `HIT-Visual-${Date.now()}.pptx` });
  };

  const exportPptxCustom = async () => {
    const logoData = await fetchLogoBase64();
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 });
    pptx.layout = 'CUSTOM';

    const addLogo = (s: ReturnType<typeof pptx.addSlide>) => {
      if (logoData) {
        s.addImage({ data: logoData, x: 7.5, y: 6.6, w: 2, h: 0.46 });
      }
    };

    const bgMap: Record<string, string> = {
      bordeaux: '6B1E2E',
      cream: 'FAF8F4',
      white: 'FFFFFF',
      blue: 'F0F4F9',
    };
    const textMap: Record<string, string> = {
      bordeaux: 'FFFFFF',
      cream: '1A1F3C',
      white: '1A1F3C',
      blue: '1A1F3C',
    };

    for (const slide of slides) {
      const s = pptx.addSlide();
      s.background = { color: bgMap[slide.background] || 'FFFFFF' };
      const tc = textMap[slide.background] || '1A1F3C';

      if (slide.type === 'cover') {
        s.addText(slide.title, { x: 0.8, y: 2, w: 8.4, h: 2, fontSize: 32, color: tc, fontFace: 'Arial', bold: true, align: 'center' });
        if (slide.subtitle) {
          s.addText(slide.subtitle, { x: 0.8, y: 4.2, w: 8.4, h: 1, fontSize: 16, color: tc, fontFace: 'Arial', align: 'center' });
        }
      } else if (slide.type === 'stat') {
        s.addText(slide.statValue || '', { x: 0.8, y: 1.5, w: 8.4, h: 2.5, fontSize: 72, color: 'D4614A', fontFace: 'Arial', bold: true, align: 'center' });
        s.addText(slide.statLabel || '', { x: 0.8, y: 4, w: 8.4, h: 1, fontSize: 18, color: tc, fontFace: 'Arial', align: 'center' });
      } else if (slide.type === 'cta') {
        s.background = { color: '1A1F3C' };
        s.addText(slide.title, { x: 0.8, y: 2.5, w: 8.4, h: 1.5, fontSize: 28, color: 'FFFFFF', fontFace: 'Arial', bold: true, align: 'center' });
      } else {
        s.addText(slide.title, { x: 0.8, y: 0.8, w: 8.4, h: 1, fontSize: 24, color: tc === 'FFFFFF' ? 'FFFFFF' : '6B1E2E', fontFace: 'Arial', bold: true });
        if (slide.subtitle) {
          s.addText(slide.subtitle, { x: 0.8, y: 1.8, w: 8.4, h: 0.6, fontSize: 14, color: tc, fontFace: 'Arial' });
        }
        if (slide.body) {
          s.addText(slide.body, { x: 0.8, y: 2.6, w: 8.4, h: 3.5, fontSize: 14, color: tc, fontFace: 'Arial' });
        }
      }
      addLogo(s);
    }

    await pptx.writeFile({ fileName: `HIT-Custom-Visual-${Date.now()}.pptx` });
  };

  useEffect(() => {
    const fetchStyleRules = async () => {
      if (!user) return;
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
  }, [user]);

  const handleGenerateQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedSvg('');
    
    try {
      const additionalRules = formatStyleRules(styleRules);
      const svg = await generateVisualSvg({
        categoryLabel: quickProgramme.toUpperCase(),
        headline: quickTitle,
        subtitle: quickFormat,
        statsArray: quickKeyPoints,
        aspectRatio: quickFormat === 'Visuel unique' ? '1:1' : '4:5',
        additionalRules
      });
      setGeneratedSvg(svg || '');
    } catch (error) {
      console.error("Visual generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    setGeneratedSvg('');
    try {
      const additionalRules = formatStyleRules(styleRules);
      // For custom mode, we'll use the first slide as a base for now
      const mainSlide = slides[0];
      const svg = await generateVisualSvg({
        categoryLabel: "CUSTOM DESIGN",
        headline: mainSlide.title || "Custom Visual",
        subtitle: mainSlide.subtitle || "",
        statsArray: mainSlide.body || "",
        aspectRatio: '1:1',
        additionalRules
      });
      setGeneratedSvg(svg || '');
    } catch (error) {
      console.error("Custom visual generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const bgColors: Record<BackgroundColor, string> = {
    bordeaux: 'bg-brand-bordeaux',
    cream: 'bg-[#FAF8F4]',
    white: 'bg-white',
    blue: 'bg-[#F0F4F9]'
  };

  const bgTextColors: Record<BackgroundColor, string> = {
    bordeaux: 'text-white',
    cream: 'text-brand-navy',
    white: 'text-brand-navy',
    blue: 'text-brand-navy'
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-headline text-brand-bordeaux italic mb-2">Visual Studio</h1>
        <p className="text-brand-navy/60">Créez des visuels pour vos publications</p>
      </header>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-brand-bordeaux/5 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setMode('quick')}
            className={cn(
              "px-6 py-2 rounded-lg font-headline font-bold transition-all",
              mode === 'quick' ? "bg-brand-bordeaux text-white shadow-md" : "text-brand-navy/60 hover:text-brand-bordeaux"
            )}
          >
            Mode rapide
          </button>
          <button
            onClick={() => setMode('custom')}
            className={cn(
              "px-6 py-2 rounded-lg font-headline font-bold transition-all",
              mode === 'custom' ? "bg-brand-bordeaux text-white shadow-md" : "text-brand-navy/60 hover:text-brand-bordeaux"
            )}
          >
            Mode personnalisé
          </button>
        </div>
      </div>

      {mode === 'quick' ? (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleGenerateQuick} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Format</label>
                <select
                  value={quickFormat}
                  onChange={(e) => setQuickFormat(e.target.value)}
                  className="input-field"
                >
                  <option>Carrousel 5 slides</option>
                  <option>Carrousel 3 slides</option>
                  <option>Visuel unique</option>
                </select>
              </div>
              <div>
                <label className="input-label">Style</label>
                <select
                  value={quickStyle}
                  onChange={(e) => setQuickStyle(e.target.value)}
                  className="input-field"
                >
                  <option>Bordeaux classique</option>
                  <option>Crème élégant</option>
                  <option>Baromètre data</option>
                </select>
              </div>
            </div>

            <div>
              <label className="input-label">Programme</label>
              <select
                value={quickProgramme}
                onChange={(e) => setQuickProgramme(e.target.value)}
                className="input-field"
                required
              >
                <option value="" disabled>Sélectionnez un programme</option>
                <option>Stratégie et Leadership en Santé</option>
                <option>HIT Certificates</option>
                <option>Baromètre Santé Connectée</option>
                <option>Événement / Webinaire</option>
                <option>Autre</option>
              </select>
            </div>

            <div>
              <label className="input-label">Titre principal</label>
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="ex: Arbitrer, gouverner, créer de la valeur grâce à l'IA"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="input-label">Points clés</label>
              <textarea
                rows={5}
                value={quickKeyPoints}
                onChange={(e) => setQuickKeyPoints(e.target.value)}
                placeholder="Un point par ligne..."
                className="input-field resize-none"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isGenerating || !quickTitle || !quickProgramme}
                className="btn-primary flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer
                  </>
                )}
              </button>
            </div>
          </form>

          {generatedSvg && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-brand-navy">Résultat</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGeneratedSvg('')}
                    className="p-2 text-brand-navy/40 hover:text-brand-coral"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="card p-0 overflow-hidden bg-white shadow-xl">
                <div
                  className="w-full aspect-square"
                  dangerouslySetInnerHTML={{ __html: generatedSvg }}
                />
              </div>
              <button
                onClick={exportPptxQuick}
                className="w-full py-2 border border-brand-bordeaux/20 rounded-lg text-[10px] font-bold text-brand-bordeaux uppercase tracking-widest hover:bg-brand-bordeaux/5 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export PPTX
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
          {/* Custom Builder */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline text-brand-bordeaux italic">Construisez votre visuel slide par slide</h2>
              <button
                onClick={addSlide}
                className="flex items-center gap-2 text-brand-bordeaux font-bold hover:underline"
              >
                <Plus className="w-4 h-4" />
                Ajouter un slide
              </button>
            </div>

            <div className="space-y-6">
              {slides.map((slide, index) => (
                <div key={slide.id} className="card p-0 overflow-hidden border-2 border-brand-bordeaux/5">
                  <div 
                    className="p-4 bg-brand-bordeaux/5 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSlideExpansion(slide.id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-brand-bordeaux text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="font-headline font-bold text-brand-navy">
                        {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)} - {slide.title || 'Sans titre'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }}
                        className="p-2 text-brand-navy/40 hover:text-brand-coral transition-colors"
                        disabled={slides.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {slide.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {slide.isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="p-8 space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Column: Config */}
                          <div className="space-y-6">
                            <div>
                              <label className="input-label">Type de slide</label>
                              <select
                                value={slide.type}
                                onChange={(e) => updateSlide(slide.id, { type: e.target.value as SlideType })}
                                className="input-field"
                              >
                                <option value="cover">Couverture (titre centré)</option>
                                <option value="content">Contenu (titre + bullets)</option>
                                <option value="stat">Statistique (grand chiffre + légende)</option>
                                <option value="columns">Deux colonnes</option>
                                <option value="cta">CTA / Contact</option>
                              </select>
                            </div>

                            <div>
                              <label className="input-label">Fond</label>
                              <div className="flex gap-2">
                                {(['bordeaux', 'cream', 'white', 'blue'] as BackgroundColor[]).map(color => (
                                  <button
                                    key={color}
                                    onClick={() => updateSlide(slide.id, { background: color })}
                                    className={cn(
                                      "w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center",
                                      bgColors[color],
                                      slide.background === color ? "border-brand-bordeaux scale-110 shadow-md" : "border-transparent"
                                    )}
                                  >
                                    {slide.background === color && (
                                      <Check className={cn("w-4 h-4", color === 'bordeaux' ? "text-white" : "text-brand-bordeaux")} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="input-label">Éléments</label>
                              <div className="grid grid-cols-2 gap-3">
                                {Object.entries(slide.elements).map(([key, value]) => (
                                  <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                    <div 
                                      onClick={() => updateSlide(slide.id, { 
                                        elements: { ...slide.elements, [key]: !value } 
                                      })}
                                      className={cn(
                                        "w-5 h-5 rounded border transition-all flex items-center justify-center",
                                        value ? "bg-brand-bordeaux border-brand-bordeaux" : "border-brand-bordeaux/20 group-hover:border-brand-bordeaux/40"
                                      )}
                                    >
                                      {value && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-xs font-medium text-brand-navy/70 capitalize">
                                      {key === 'pageNumber' ? 'Numéro de page' : key === 'swipe' ? 'Indicateur Swipe' : key === 'footer' ? 'Footer programme' : key}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Content */}
                          <div className="space-y-4">
                            <div>
                              <label className="input-label">Titre</label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                                className="input-field"
                                placeholder="Titre du slide"
                              />
                            </div>

                            {(slide.type === 'cover' || slide.type === 'content' || slide.type === 'columns') && (
                              <div>
                                <label className="input-label">Sous-titre (optionnel)</label>
                                <input
                                  type="text"
                                  value={slide.subtitle || ''}
                                  onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                                  className="input-field"
                                  placeholder="Sous-titre"
                                />
                              </div>
                            )}

                            {(slide.type === 'content' || slide.type === 'columns') && (
                              <div>
                                <label className="input-label">Corps / Bullets (optionnel)</label>
                                <textarea
                                  rows={4}
                                  value={slide.body || ''}
                                  onChange={(e) => updateSlide(slide.id, { body: e.target.value })}
                                  className="input-field resize-none"
                                  placeholder="Contenu du slide..."
                                />
                              </div>
                            )}

                            {slide.type === 'stat' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="input-label">Statistique</label>
                                  <input
                                    type="text"
                                    value={slide.statValue || ''}
                                    onChange={(e) => updateSlide(slide.id, { statValue: e.target.value })}
                                    className="input-field"
                                    placeholder="ex: 54%"
                                  />
                                </div>
                                <div>
                                  <label className="input-label">Légende</label>
                                  <input
                                    type="text"
                                    value={slide.statLabel || ''}
                                    onChange={(e) => updateSlide(slide.id, { statLabel: e.target.value })}
                                    className="input-field"
                                    placeholder="ex: des Français..."
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-8">
              <button
                onClick={addSlide}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter un slide
              </button>
              <button
                onClick={handleGenerateCustom}
                disabled={isGenerating || !slides[0].title}
                className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-bordeaux/20"
              >
                {isGenerating ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer le visuel
                  </>
                )}
              </button>
            </div>

            {generatedSvg && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-brand-navy">Résultat</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setGeneratedSvg('')}
                      className="p-2 text-brand-navy/40 hover:text-brand-coral"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card p-0 overflow-hidden bg-white shadow-xl">
                  <div
                    className="w-full aspect-square"
                    dangerouslySetInnerHTML={{ __html: generatedSvg }}
                  />
                </div>
                <button
                  onClick={exportPptxCustom}
                  className="w-full py-2 border border-brand-bordeaux/20 rounded-lg text-[10px] font-bold text-brand-bordeaux uppercase tracking-widest hover:bg-brand-bordeaux/5 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export PPTX
                </button>
              </motion.div>
            )}
          </div>

          {/* Preview Sidebar */}
          <aside className="sticky top-24 space-y-6">
            <div className="flex items-center gap-2 text-brand-navy/40 font-bold uppercase tracking-widest text-[10px]">
              <ImageIcon className="w-3 h-3" />
              Aperçu rapide
            </div>
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={cn(
                    "aspect-[4/5] rounded-lg border shadow-sm p-3 flex flex-col gap-2 transition-all",
                    bgColors[slide.background],
                    bgTextColors[slide.background]
                  )}
                >
                  <div className="flex justify-between items-start">
                    {slide.elements.logo && <img src={EDHEC_LOGO_PATH} alt="" className="w-6 h-4 object-contain opacity-60" />}
                    <span className="text-[8px] opacity-30 font-bold">#{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center gap-1 text-center">
                    {slide.type === 'cover' && (
                      <>
                        <div className="w-3/4 h-1 bg-current opacity-40 rounded-full" />
                        <div className="w-1/2 h-1 bg-current opacity-20 rounded-full" />
                      </>
                    )}
                    {slide.type === 'content' && (
                      <div className="w-full space-y-1">
                        <div className="w-1/2 h-1 bg-current opacity-40 rounded-full mb-2" />
                        <div className="w-full h-0.5 bg-current opacity-10 rounded-full" />
                        <div className="w-full h-0.5 bg-current opacity-10 rounded-full" />
                        <div className="w-full h-0.5 bg-current opacity-10 rounded-full" />
                      </div>
                    )}
                    {slide.type === 'stat' && (
                      <>
                        <div className="text-xs font-headline font-bold">{slide.statValue || '00'}</div>
                        <div className="w-1/2 h-0.5 bg-current opacity-20 rounded-full" />
                      </>
                    )}
                    {slide.type === 'columns' && (
                      <div className="grid grid-cols-2 gap-1 w-full">
                        <div className="h-8 bg-current opacity-5 rounded" />
                        <div className="h-8 bg-current opacity-5 rounded" />
                      </div>
                    )}
                    {slide.type === 'cta' && (
                      <div className="w-1/2 h-3 bg-current opacity-20 rounded-full mt-2" />
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    {slide.elements.footer && <div className="w-8 h-0.5 bg-current opacity-20 rounded-full" />}
                    {slide.elements.swipe && <div className="w-2 h-2 rounded-full border border-current opacity-20" />}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
