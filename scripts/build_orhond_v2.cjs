// Carrousel LinkedIn Céline Orhond - version minimaliste
const PptxGenJS = require('pptxgenjs');

const INK = '121218';        // near-black base
const INK_SOFT = '1E1E2E';   // charcoal
const INK_LINE = '2B2B3D';   // divider
const WHITE = 'FFFFFF';
const DIM = 'A8A8B8';        // dimmed white
const MUTED = '6E6E80';
const ACCENT = 'FF6A4D';     // vivid coral
const ACCENT_SOFT = 'FFE0D6';

const DISPLAY = 'Georgia';
const BODY = 'Arial';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'SQ', width: 10, height: 10 });
pptx.layout = 'SQ';

function base(dark = true) {
  const s = pptx.addSlide();
  s.background = { color: dark ? INK_SOFT : WHITE };
  // thin accent line top
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.6, w: 0.6, h: 0.05,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });
  return s;
}

function pageMark(s, n, total, dark = true) {
  s.addText(`0${n} / 0${total}`, {
    x: 8.2, y: 0.55, w: 1.3, h: 0.35,
    fontFace: BODY, fontSize: 10, bold: true,
    color: dark ? DIM : MUTED, align: 'right', charSpacing: 3,
  });
}

function signature(s, dark = true) {
  s.addText('DR CÉLINE ORHOND  ·  EXPe-SANTÉ', {
    x: 0.6, y: 9.25, w: 8.8, h: 0.35,
    fontFace: BODY, fontSize: 9, bold: true,
    color: dark ? DIM : MUTED, charSpacing: 4, align: 'left',
  });
}

const TOTAL = 8;

// ===== Slide 1 : TITRE =====
{
  const s = base(true);
  s.addText('TRIBUNE  ·  SANTÉ & INNOVATION', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });
  s.addText('Transformer', {
    x: 0.6, y: 2.1, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 56, bold: true, color: WHITE,
  });
  s.addText('le système', {
    x: 0.6, y: 3.1, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 56, bold: true, color: WHITE,
  });
  s.addText('de santé.', {
    x: 0.6, y: 4.1, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 56, bold: true, color: WHITE,
  });
  s.addText("L'innovation numérique est un levier,", {
    x: 0.6, y: 5.6, w: 8.8, h: 0.55,
    fontFace: DISPLAY, fontSize: 20, italic: true, color: DIM,
  });
  s.addText('pas un but.', {
    x: 0.6, y: 6.15, w: 8.8, h: 0.55,
    fontFace: DISPLAY, fontSize: 20, italic: true, bold: true, color: ACCENT,
  });
  // author block
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 7.9, w: 0.05, h: 0.9,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });
  s.addText('Dr Céline Orhond', {
    x: 0.85, y: 7.85, w: 8, h: 0.45,
    fontFace: BODY, fontSize: 16, bold: true, color: WHITE,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.85, y: 8.3, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 13, color: DIM,
  });
  s.addText('SWIPE  →', {
    x: 7.5, y: 8.3, w: 2, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT,
    charSpacing: 4, align: 'right',
  });
  pageMark(s, 1, TOTAL);
}

// ===== Slide 2 : LE PARADOXE =====
{
  const s = base(true);
  s.addText('01  ·  LE PARADOXE', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });
  s.addText('Jamais autant de', {
    x: 0.6, y: 2.5, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 44, bold: true, color: WHITE,
  });
  s.addText('solutions digitales.', {
    x: 0.6, y: 3.35, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 44, bold: true, color: WHITE,
  });
  s.addText('Pourtant', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 44, italic: true, color: DIM,
  });
  s.addText('la majorité reste', {
    x: 0.6, y: 5.8, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 44, bold: true, color: ACCENT,
  });
  s.addText('sous-utilisée.', {
    x: 0.6, y: 6.65, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 44, bold: true, color: ACCENT,
  });
  signature(s);
  pageMark(s, 2, TOTAL);
}

// ===== Slide 3 : QUOTE =====
{
  const s = base(true);
  s.addText('“', {
    x: 0.45, y: 0.9, w: 2, h: 2.5,
    fontFace: DISPLAY, fontSize: 180, bold: true, color: ACCENT, valign: 'top',
  });
  s.addText(
    "Chaque solution sous-utilisée représente un coût financier et humain.",
    {
      x: 0.6, y: 3.3, w: 8.8, h: 2.2,
      fontFace: DISPLAY, fontSize: 30, bold: true, color: WHITE, valign: 'top',
    }
  );
  s.addText(
    "Mais surtout une occasion manquée d'améliorer le système de santé.",
    {
      x: 0.6, y: 5.6, w: 8.8, h: 2.2,
      fontFace: DISPLAY, fontSize: 30, italic: true, color: ACCENT, valign: 'top',
    }
  );
  s.addText('DR CÉLINE ORHOND', {
    x: 0.6, y: 8.3, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: DIM, charSpacing: 4,
  });
  pageMark(s, 3, TOTAL);
}

// ===== Slide 4 : CO-CONSTRUCTION =====
{
  const s = base(true);
  s.addText('02  ·  CO-CONSTRUCTION', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });
  s.addText('On dit co-construire.', {
    x: 0.6, y: 2.3, w: 8.8, h: 1.1,
    fontFace: DISPLAY, fontSize: 40, bold: true, color: WHITE,
  });

  // divider
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 4.0, w: 1.2, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });

  // FAUX
  s.addText('LA RÉALITÉ', {
    x: 0.6, y: 4.25, w: 4.3, h: 0.35,
    fontFace: BODY, fontSize: 10, bold: true, color: DIM, charSpacing: 4,
  });
  s.addText('Des solutions « clefs en mains », testées sur 2 ou 3 personnes.', {
    x: 0.6, y: 4.65, w: 4.3, h: 3,
    fontFace: DISPLAY, fontSize: 18, italic: true, color: DIM, valign: 'top',
  });

  // vertical separator
  s.addShape(pptx.ShapeType.rect, {
    x: 5.0, y: 4.25, w: 0.02, h: 3.5,
    fill: { color: INK_LINE }, line: { color: INK_LINE, width: 0 },
  });

  // VRAI
  s.addText('LE VRAI CENTRAGE', {
    x: 5.25, y: 4.25, w: 4.3, h: 0.35,
    fontFace: BODY, fontSize: 10, bold: true, color: ACCENT, charSpacing: 4,
  });
  s.addText("Partir d'un besoin avéré. Construire avec ceux qui vivent le soin.", {
    x: 5.25, y: 4.65, w: 4.3, h: 3,
    fontFace: DISPLAY, fontSize: 20, bold: true, color: WHITE, valign: 'top',
  });

  signature(s);
  pageMark(s, 4, TOTAL);
}

// ===== Slide 5 : SIMPLIFIER =====
{
  const s = base(true);
  s.addText('03  ·  LA RÈGLE', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });

  s.addText('Une innovation doit', {
    x: 0.6, y: 2.8, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 48, color: WHITE,
  });
  s.addText('simplifier', {
    x: 0.6, y: 3.8, w: 8.8, h: 1.3,
    fontFace: DISPLAY, fontSize: 90, bold: true, color: ACCENT,
  });
  s.addText('les tâches.', {
    x: 0.6, y: 5.25, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 48, color: WHITE,
  });
  s.addText('Pas les compliquer.', {
    x: 0.6, y: 7.0, w: 8.8, h: 0.7,
    fontFace: DISPLAY, fontSize: 24, italic: true, color: DIM,
  });
  signature(s);
  pageMark(s, 5, TOTAL);
}

// ===== Slide 6 : 3 QUESTIONS =====
{
  const s = base(true);
  s.addText('04  ·  AVANT DE DÉPLOYER', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });
  s.addText('3 questions.', {
    x: 0.6, y: 1.8, w: 8.8, h: 1.2,
    fontFace: DISPLAY, fontSize: 54, bold: true, color: WHITE,
  });

  const qs = [
    ['01', "Quel impact sur l'organisation, et comment l'accompagner ?"],
    ['02', "Que gagne le patient ? Que perd-il ?"],
    ['03', "Comment l'intégrer au modèle existant ?"],
  ];
  qs.forEach(([n, q], i) => {
    const y = 3.7 + i * 1.7;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: y + 1.3, w: 8.8, h: 0.02,
      fill: { color: INK_LINE }, line: { color: INK_LINE, width: 0 },
    });
    s.addText(n, {
      x: 0.6, y, w: 1.1, h: 1.2,
      fontFace: DISPLAY, fontSize: 34, bold: true, color: ACCENT, valign: 'top',
    });
    s.addText(q, {
      x: 1.9, y: y + 0.1, w: 7.5, h: 1.2,
      fontFace: DISPLAY, fontSize: 20, color: WHITE, valign: 'top',
    });
  });
  signature(s);
  pageMark(s, 6, TOTAL);
}

// ===== Slide 7 : EXPERIENCE PATIENT =====
{
  const s = base(true);
  s.addText("05  ·  L'EXPÉRIENCE PATIENT", {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });
  s.addText('Le patient', {
    x: 0.6, y: 2.3, w: 8.8, h: 1.2,
    fontFace: DISPLAY, fontSize: 54, bold: true, color: WHITE,
  });
  s.addText('au centre.', {
    x: 0.6, y: 3.4, w: 8.8, h: 1.2,
    fontFace: DISPLAY, fontSize: 54, bold: true, color: ACCENT,
  });
  s.addText("Tout au long du processus d'innovation, et mesuré.", {
    x: 0.6, y: 4.85, w: 8.8, h: 0.6,
    fontFace: DISPLAY, fontSize: 18, italic: true, color: DIM,
  });

  // two cards
  const card = (x, label, title, sub) => {
    s.addShape(pptx.ShapeType.rect, {
      x, y: 6.0, w: 4.2, h: 2.3,
      fill: { color: INK }, line: { color: INK_LINE, width: 1 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 6.0, w: 0.08, h: 2.3,
      fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
    });
    s.addText(label, {
      x: x + 0.3, y: 6.2, w: 3.9, h: 0.35,
      fontFace: BODY, fontSize: 10, bold: true, color: ACCENT, charSpacing: 3,
    });
    s.addText(title, {
      x: x + 0.3, y: 6.55, w: 3.9, h: 0.55,
      fontFace: DISPLAY, fontSize: 26, bold: true, color: WHITE,
    });
    s.addText(sub, {
      x: x + 0.3, y: 7.25, w: 3.9, h: 1,
      fontFace: BODY, fontSize: 12, color: DIM, valign: 'top',
    });
  };
  card(0.6, 'PROMs', 'État de santé', 'ce que le patient ressent du résultat');
  card(5.2, 'PREMs', 'Vécu du parcours', "ce que le patient vit de l'expérience");

  signature(s);
  pageMark(s, 7, TOTAL);
}

// ===== Slide 8 : CONCLUSION + CTA =====
{
  const s = base(true);
  s.addText('POUR CONCLURE', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: ACCENT, charSpacing: 5,
  });
  s.addText("L'innovation numérique", {
    x: 0.6, y: 2.1, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 40, color: WHITE,
  });
  s.addText("n'est pas une finalité.", {
    x: 0.6, y: 3.0, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 40, bold: true, color: WHITE,
  });
  s.addText(
    "C'est un projet de transformation humaine et organisationnelle.",
    {
      x: 0.6, y: 4.4, w: 8.8, h: 1.2,
      fontFace: DISPLAY, fontSize: 24, italic: true, color: ACCENT,
    }
  );

  // author card
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.5, w: 8.8, h: 1.6,
    fill: { color: INK }, line: { color: INK_LINE, width: 1 },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.5, w: 0.08, h: 1.6,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });
  s.addText('Dr Céline Orhond', {
    x: 0.95, y: 6.65, w: 6, h: 0.5,
    fontFace: DISPLAY, fontSize: 22, bold: true, color: WHITE,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.95, y: 7.15, w: 6, h: 0.4,
    fontFace: BODY, fontSize: 13, color: DIM,
  });
  s.addText('Intervenante, Chaire Management in Innovative Health, EDHEC', {
    x: 0.95, y: 7.55, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 11, italic: true, color: MUTED,
  });

  // CTA
  s.addText('Pour aller plus loin', {
    x: 0.6, y: 8.4, w: 8.8, h: 0.3,
    fontFace: BODY, fontSize: 10, bold: true, color: DIM, charSpacing: 3,
  });
  s.addText('sante.edhec.edu', {
    x: 0.6, y: 8.7, w: 8.8, h: 0.6,
    fontFace: DISPLAY, fontSize: 28, bold: true, color: ACCENT,
  });
  pageMark(s, 8, TOTAL);
}

pptx.writeFile({ fileName: '/Users/annaritoper/Desktop/Carrousel_Celine_Orhond_EDHEC.pptx' })
  .then(f => console.log('Wrote', f));
