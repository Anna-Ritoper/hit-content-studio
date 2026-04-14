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
import { db } from '../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { StyleRule } from '../types';
import { generateVisualSvg } from '../services/aiService';
import { formatStyleRules, HARDCODED_STYLE_RULES } from '../constants';
import { EDHEC_LOGO_DARK_PATH, EDHEC_LOGO_WHITE_PATH } from '../edhecLogo';
import { isDemoMode } from '../demoData';
import PptxGenJS from 'pptxgenjs';
import { useI18n } from '../i18n';
import { sanitizeSvg } from '../services/sanitizeSvg';
import {
  buildSlideSpecs, renderSvg, slideCountForFormat, parsePoints,
  toPptxColor, type StyleId, type SlideSpec,
} from '../services/visualTemplates';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function stripSvgFences(raw: string): string {
  if (!raw) return '';
  let out = raw.trim();
  out = out.replace(/^```(?:svg|xml|html)?\s*/i, '');
  out = out.replace(/```\s*$/i, '');
  const match = out.match(/<svg[\s\S]*<\/svg>/i);
  return match ? match[0] : out;
}

// Load an EDHEC logo PNG and return a data URL usable by pptxgenjs.
async function fetchLogoBase64(variant: 'dark' | 'white' = 'dark'): Promise<string | null> {
  try {
    const path = variant === 'white' ? EDHEC_LOGO_WHITE_PATH : EDHEC_LOGO_DARK_PATH;
    const res = await fetch(path);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Build all carousel slides from the current Quick Mode inputs. Both the
// preview and the PPTX exporter consume this same array, so WYSIWYG holds.
function buildQuickSlideSpecs(opts: {
  format: string; style: string; programme: string; title: string; keyPoints: string;
}): SlideSpec[] {
  return buildSlideSpecs({
    format: opts.format,
    style: (opts.style as StyleId) || 'Bordeaux classique',
    programme: opts.programme,
    title: opts.title,
    points: parsePoints(opts.keyPoints),
  });
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
  const { t } = useI18n();
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState('');
  const [styleRules, setStyleRules] = useState<StyleRule[]>([]);

  // Quick Mode carousel state: array of slide specs + active index.
  // The preview and the PPTX export both consume this exact array so what
  // the user sees is what they get in the file.
  const [slideSpecs, setSlideSpecs] = useState<SlideSpec[]>([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

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
    try {
      // Rebuild specs from current inputs so the PPTX always matches the latest form,
      // whether or not the user hit "Générer à nouveau" first.
      const specs = slideSpecs.length > 0
        ? slideSpecs
        : buildQuickSlideSpecs({
            format: quickFormat,
            style: quickStyle,
            programme: quickProgramme || 'Chaire Management in Innovative Health',
            title: quickTitle,
            keyPoints: quickKeyPoints,
          });

      const logoDark = await fetchLogoBase64('dark');
      const logoWhite = await fetchLogoBase64('white');
      const pptx = new PptxGenJS();
      // 1080x1080 at 96 dpi : 11.25in x 11.25in square for LinkedIn carousels
      pptx.defineLayout({ name: 'SQUARE', width: 11.25, height: 11.25 });
      pptx.layout = 'SQUARE';

      const addLogo = (slide: ReturnType<typeof pptx.addSlide>, variant: 'dark' | 'white', opts?: { centered?: boolean }) => {
        const data = variant === 'white' ? logoWhite : logoDark;
        if (!data) return;
        // PNG native 2213x837, ratio about 2.64
        const w = 2.4;
        const h = w * 837 / 2213;
        if (opts?.centered) {
          slide.addImage({ data, x: (11.25 - w) / 2, y: (11.25 - h) / 2 + 1, w, h });
        } else {
          slide.addImage({ data, x: 11.25 - w - 0.5, y: 11.25 - h - 0.5, w, h });
        }
      };

      const isDarkHex = (hex: string) => {
        const h = hex.replace('#', '');
        if (h.length !== 6) return false;
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
      };

      for (const s of specs) {
        const slide = pptx.addSlide();
        const theme = s.theme;

        if (s.kind === 'cover') {
          slide.background = { color: toPptxColor(theme.coverBg) };
          const onDark = isDarkHex(theme.coverBg);
          slide.addText(s.programme.toUpperCase(), {
            x: 0.8, y: 1.4, w: 9.65, h: 0.5,
            fontSize: 14, color: toPptxColor(theme.coverAccent),
            fontFace: 'Montserrat', bold: true, charSpacing: 4, align: 'center',
          });
          slide.addShape(pptx.ShapeType.line, {
            x: 4.6, y: 2, w: 2, h: 0,
            line: { color: toPptxColor(theme.coverAccent), width: 2 },
          });
          slide.addText(s.title || 'HIT Content Studio', {
            x: 0.5, y: 3.5, w: 10.25, h: 3.5,
            fontSize: 40, color: toPptxColor(theme.coverText),
            fontFace: 'Montserrat', bold: true, align: 'center', valign: 'middle',
          });
          if (s.body) {
            slide.addText(s.body.split('\n')[0], {
              x: 0.8, y: 7.3, w: 9.65, h: 0.6,
              fontSize: 18, color: toPptxColor(theme.coverText),
              fontFace: 'Montserrat', align: 'center',
            });
          }
          addLogo(slide, onDark ? 'white' : 'dark');
        } else if (s.kind === 'closing') {
          slide.background = { color: toPptxColor(theme.closingBg) };
          const onDark = isDarkHex(theme.closingBg);
          slide.addText('EN SAVOIR PLUS', {
            x: 0.8, y: 3.6, w: 9.65, h: 0.5,
            fontSize: 14, color: toPptxColor(theme.closingAccent),
            fontFace: 'Montserrat', bold: true, charSpacing: 4, align: 'center',
          });
          slide.addText('Chaire Management in Innovative Health', {
            x: 0.8, y: 4.5, w: 9.65, h: 1,
            fontSize: 32, color: toPptxColor(theme.closingText),
            fontFace: 'Montserrat', bold: true, align: 'center',
          });
          slide.addText('EDHEC Business School', {
            x: 0.8, y: 5.8, w: 9.65, h: 0.8,
            fontSize: 20, color: toPptxColor(theme.closingText),
            fontFace: 'Montserrat', align: 'center',
          });
          addLogo(slide, onDark ? 'white' : 'dark');
        } else {
          // content slide
          slide.background = { color: toPptxColor(theme.bodyBg) };
          const onDark = isDarkHex(theme.bodyBg);
          const badge = String(s.index - 1).padStart(2, '0');
          slide.addText(`${badge}   ${(s.title || '').toUpperCase()}`, {
            x: 0.8, y: 0.8, w: 9.65, h: 0.8,
            fontSize: 18, color: toPptxColor('#6B1E2E'),
            fontFace: 'Montserrat', bold: true, charSpacing: 4,
          });
          slide.addShape(pptx.ShapeType.line, {
            x: 0.8, y: 1.6, w: 1.5, h: 0,
            line: { color: toPptxColor(theme.bodyAccent), width: 3 },
          });

          if (s.stat) {
            slide.addText(s.stat, {
              x: 0.5, y: 3, w: 10.25, h: 3,
              fontSize: 140, color: toPptxColor(theme.bodyAccent),
              fontFace: 'Montserrat', bold: true, align: 'center', valign: 'middle',
            });
            if (s.body) {
              slide.addText(s.body, {
                x: 1, y: 6.5, w: 9.25, h: 2,
                fontSize: 20, color: toPptxColor(theme.bodyText),
                fontFace: 'Montserrat', align: 'center', valign: 'top',
              });
            }
          } else {
            if (s.heading) {
              slide.addText(s.heading, {
                x: 0.8, y: 2.5, w: 9.65, h: 2,
                fontSize: 34, color: toPptxColor('#6B1E2E'),
                fontFace: 'Montserrat', bold: true, valign: 'top',
              });
            }
            if (s.body) {
              slide.addText(s.body, {
                x: 0.8, y: 4.8, w: 9.65, h: 4,
                fontSize: 20, color: toPptxColor(theme.bodyText),
                fontFace: 'Montserrat', valign: 'top',
              });
            }
          }
          addLogo(slide, onDark ? 'white' : 'dark');
        }
      }

      await pptx.writeFile({ fileName: `HIT-Visual-${Date.now()}.pptx` });
    } catch (err) {
      console.error('PPTX export failed:', err);
      alert('PPTX export failed : ' + (err as Error).message);
    }
  };

  const exportPptxCustom = async () => {
    try {
    const logoDark = await fetchLogoBase64('dark');
    const logoWhite = await fetchLogoBase64('white');
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'SQUARE', width: 11.25, height: 11.25 });
    pptx.layout = 'SQUARE';

    const addLogo = (s: ReturnType<typeof pptx.addSlide>, variant: 'dark' | 'white') => {
      const data = variant === 'white' ? logoWhite : logoDark;
      if (!data) return;
      const w = 2.4;
      const h = w * 837 / 2213;
      s.addImage({ data, x: 11.25 - w - 0.5, y: 11.25 - h - 0.5, w, h });
    };

    const bgMap: Record<string, string> = {
      bordeaux: '6B1E2E',
      cream: 'F5F0EC',
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
      const title = slide.title || 'Untitled slide';
      const logoVariant: 'dark' | 'white' = slide.background === 'bordeaux' ? 'white' : 'dark';

      if (slide.type === 'cover') {
        s.addText(title, { x: 0.8, y: 4, w: 9.65, h: 3, fontSize: 36, color: tc, fontFace: 'Montserrat', bold: true, align: 'center' });
        if (slide.subtitle) {
          s.addText(slide.subtitle, { x: 0.8, y: 7.2, w: 9.65, h: 1, fontSize: 18, color: tc, fontFace: 'Montserrat', align: 'center' });
        }
      } else if (slide.type === 'stat') {
        s.addText(slide.statValue || '0', { x: 0.5, y: 3.5, w: 10.25, h: 2.8, fontSize: 120, color: 'E07065', fontFace: 'Montserrat', bold: true, align: 'center' });
        s.addText(slide.statLabel || title, { x: 1, y: 6.8, w: 9.25, h: 1.5, fontSize: 20, color: tc, fontFace: 'Montserrat', align: 'center' });
      } else if (slide.type === 'cta') {
        s.background = { color: '6B1E2E' };
        s.addText('Chaire Management in Innovative Health', { x: 0.8, y: 3, w: 9.65, h: 1, fontSize: 32, color: 'FFFFFF', fontFace: 'Montserrat', bold: true, align: 'center' });
        s.addText(title, { x: 0.8, y: 4.2, w: 9.65, h: 1, fontSize: 20, color: 'F5F0EC', fontFace: 'Montserrat', align: 'center' });
        if (logoWhite) {
          const w = 3.6;
          const h = w * 837 / 2213;
          s.addImage({ data: logoWhite, x: (11.25 - w) / 2, y: 6.5, w, h });
        }
        continue;
      } else {
        s.addText(title, { x: 0.8, y: 0.8, w: 9.65, h: 1, fontSize: 28, color: tc === 'FFFFFF' ? 'FFFFFF' : '6B1E2E', fontFace: 'Montserrat', bold: true });
        s.addShape(pptx.ShapeType.line, { x: 0.8, y: 1.8, w: 1.5, h: 0, line: { color: 'E07065', width: 3 } });
        if (slide.subtitle) {
          s.addText(slide.subtitle, { x: 0.8, y: 2.2, w: 9.65, h: 0.8, fontSize: 18, color: tc, fontFace: 'Montserrat' });
        }
        if (slide.body) {
          s.addText(slide.body, { x: 0.8, y: 3.2, w: 9.65, h: 6, fontSize: 16, color: tc, fontFace: 'Montserrat', valign: 'top' });
        }
      }
      addLogo(s, logoVariant);
    }

    await pptx.writeFile({ fileName: `HIT-Custom-Visual-${Date.now()}.pptx` });
    } catch (err) {
      console.error('PPTX export failed:', err);
      alert('PPTX export failed : ' + (err as Error).message);
    }
  };

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

  const handleGenerateQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedSvg('');

    // Deterministic: every slide is built from the current form inputs.
    // No LLM involved here, so the preview is exactly what the PPTX will contain.
    const specs = buildQuickSlideSpecs({
      format: quickFormat,
      style: quickStyle,
      programme: quickProgramme || 'Chaire Management in Innovative Health',
      title: quickTitle,
      keyPoints: quickKeyPoints,
    });

    // Tiny delay for UX feedback so the spinner is visible.
    await new Promise(r => setTimeout(r, 250));
    setSlideSpecs(specs);
    setCurrentSlideIdx(0);
    setGeneratedSvg(renderSvg(specs[0]));
    setIsGenerating(false);
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
      setGeneratedSvg(stripSvgFences(svg || ''));
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
    <div className="max-w-6xl mx-auto pb-20 px-4" data-tour="module-visuals">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-brand-bordeaux mb-2">Visual Studio</h1>
        <p className="text-brand-navy/60">Créez des visuels pour vos publications</p>
      </header>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-12">
        <div data-tour="visuals-mode-toggle" className="bg-brand-bordeaux/5 p-1 rounded-xl flex gap-1">
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
                placeholder={t('vis.titlePh')}
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
                placeholder={t('vis.pointsPh')}
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

          {slideSpecs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-brand-navy">
                  Résultat
                  {slideSpecs.length > 1 && (
                    <span className="ml-2 text-xs text-brand-navy/50 font-medium">
                      Slide {currentSlideIdx + 1} sur {slideSpecs.length}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => { setSlideSpecs([]); setGeneratedSvg(''); }}
                  className="p-2 text-brand-navy/40 hover:text-brand-coral"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                {slideSpecs.length > 1 && (
                  <button
                    onClick={() => setCurrentSlideIdx((i) => Math.max(0, i - 1))}
                    disabled={currentSlideIdx === 0}
                    className="p-2 rounded-full bg-white border border-brand-bordeaux/10 text-brand-bordeaux hover:bg-brand-bordeaux/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Slide précédent"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div
                  className="bg-white border border-brand-bordeaux/10 rounded-xl shadow-xl p-4 overflow-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                  style={{ maxWidth: 600, maxHeight: 600, width: '100%', aspectRatio: '1 / 1' }}
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(renderSvg(slideSpecs[currentSlideIdx])) }}
                />
                {slideSpecs.length > 1 && (
                  <button
                    onClick={() => setCurrentSlideIdx((i) => Math.min(slideSpecs.length - 1, i + 1))}
                    disabled={currentSlideIdx === slideSpecs.length - 1}
                    className="p-2 rounded-full bg-white border border-brand-bordeaux/10 text-brand-bordeaux hover:bg-brand-bordeaux/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Slide suivant"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {slideSpecs.length > 1 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {slideSpecs.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIdx(i)}
                      className={cn(
                        "w-16 aspect-square rounded border-2 transition-all overflow-hidden [&>svg]:w-full [&>svg]:h-full",
                        currentSlideIdx === i ? "border-brand-bordeaux scale-105" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                      dangerouslySetInnerHTML={{ __html: sanitizeSvg(renderSvg(s)) }}
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={exportPptxQuick}
                  className="py-3 bg-brand-bordeaux text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-bordeaux/90 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> {t('act.download')}
                </button>
                <button
                  onClick={(e) => handleGenerateQuick(e as any)}
                  disabled={isGenerating}
                  className="py-3 border-2 border-brand-teal text-brand-teal rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-teal/5 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Générer à nouveau
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
          {/* Custom Builder */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold text-brand-bordeaux">Construisez votre visuel slide par slide</h2>
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
                                placeholder={t('vis.slideTitlePh')}
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
                                  placeholder={t('vis.slideSubtitlePh')}
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
                                  placeholder={t('vis.slideBodyPh')}
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
                  <button
                    onClick={() => setGeneratedSvg('')}
                    className="p-2 text-brand-navy/40 hover:text-brand-coral"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <div
                    className="bg-white border border-brand-bordeaux/10 rounded-xl shadow-xl p-4 overflow-auto flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                    style={{ maxWidth: 600, maxHeight: 600, width: '100%', aspectRatio: '1 / 1' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeSvg(generatedSvg) }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={exportPptxCustom}
                    className="py-3 bg-brand-bordeaux text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-bordeaux/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> {t('act.download')}
                  </button>
                  <button
                    onClick={handleGenerateCustom}
                    disabled={isGenerating}
                    className="py-3 border-2 border-brand-teal text-brand-teal rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-teal/5 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Générer à nouveau
                  </button>
                </div>
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
                    {slide.elements.logo && <img src={slide.background === 'bordeaux' ? EDHEC_LOGO_WHITE_PATH : EDHEC_LOGO_DARK_PATH} alt="" className="w-6 h-4 object-contain opacity-60" />}
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
