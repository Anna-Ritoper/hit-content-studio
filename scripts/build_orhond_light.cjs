// Carrousel LinkedIn Céline Orhond - version LIGHT, 5 slides
const PptxGenJS = require('pptxgenjs');

const CREAM = 'F5F0EC';
const CREAM_DEEP = 'EAE2DB';
const BORDEAUX = '6B1E2E';
const BORDEAUX_DARK = '4E1521';
const CORAL = 'E07065';
const INK = '2A1418';
const MUTED = '8A6B72';

const DISPLAY = 'Georgia';
const BODY = 'Arial';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'SQ', width: 10, height: 10 });
pptx.layout = 'SQ';

function base() {
  const s = pptx.addSlide();
  s.background = { color: CREAM };
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.6, w: 0.6, h: 0.05,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  return s;
}

function pageMark(s, n, total) {
  s.addText(`0${n} / 0${total}`, {
    x: 8.2, y: 0.55, w: 1.3, h: 0.35,
    fontFace: BODY, fontSize: 10, bold: true,
    color: MUTED, align: 'right', charSpacing: 3,
  });
}

function signature(s) {
  s.addText('DR CÉLINE ORHOND  ·  EXPe-SANTÉ', {
    x: 0.6, y: 9.25, w: 8.8, h: 0.35,
    fontFace: BODY, fontSize: 9, bold: true,
    color: MUTED, charSpacing: 4, align: 'left',
  });
}

const TOTAL = 5;

// ===== 1 : TITRE =====
{
  const s = base();
  s.addText('TRIBUNE  ·  SANTÉ & INNOVATION', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText('Transformer', {
    x: 0.6, y: 2.1, w: 8.8, h: 1.1,
    fontFace: DISPLAY, fontSize: 56, bold: true, color: BORDEAUX,
  });
  s.addText('le système', {
    x: 0.6, y: 3.1, w: 8.8, h: 1.1,
    fontFace: DISPLAY, fontSize: 56, bold: true, color: BORDEAUX,
  });
  s.addText('de santé.', {
    x: 0.6, y: 4.1, w: 8.8, h: 1.1,
    fontFace: DISPLAY, fontSize: 56, bold: true, color: BORDEAUX,
  });
  s.addText("L'innovation numérique est un levier,", {
    x: 0.6, y: 5.7, w: 8.8, h: 0.55,
    fontFace: DISPLAY, fontSize: 20, italic: true, color: INK,
  });
  s.addText('pas un but.', {
    x: 0.6, y: 6.25, w: 8.8, h: 0.55,
    fontFace: DISPLAY, fontSize: 20, italic: true, bold: true, color: CORAL,
  });
  // author block
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 7.9, w: 0.06, h: 0.9,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('Dr Céline Orhond', {
    x: 0.85, y: 7.85, w: 8, h: 0.45,
    fontFace: BODY, fontSize: 16, bold: true, color: BORDEAUX,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.85, y: 8.3, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 13, color: INK,
  });
  s.addText('SWIPE  →', {
    x: 7.5, y: 8.3, w: 2, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL,
    charSpacing: 4, align: 'right',
  });
  pageMark(s, 1, TOTAL);
}

// ===== 2 : PARADOXE =====
{
  const s = base();
  s.addText('01  ·  LE PARADOXE', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText('Jamais autant de', {
    x: 0.6, y: 2.4, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 42, bold: true, color: BORDEAUX,
  });
  s.addText('solutions digitales.', {
    x: 0.6, y: 3.2, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 42, bold: true, color: BORDEAUX,
  });
  s.addText('Pourtant', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 42, italic: true, color: INK,
  });
  s.addText('la majorité reste', {
    x: 0.6, y: 5.8, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 42, bold: true, color: CORAL,
  });
  s.addText('sous-utilisée.', {
    x: 0.6, y: 6.6, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 42, bold: true, color: CORAL,
  });
  signature(s);
  pageMark(s, 2, TOTAL);
}

// ===== 3 : INSIGHT + 3 QUESTIONS =====
{
  const s = base();
  s.addText("02  ·  LA RÈGLE", {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText('Simplifier les tâches.', {
    x: 0.6, y: 1.8, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 36, bold: true, color: BORDEAUX,
  });
  s.addText('Pas les compliquer.', {
    x: 0.6, y: 2.65, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 36, italic: true, color: CORAL,
  });

  // divider
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 3.85, w: 1.2, h: 0.04,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('3 questions avant de déployer', {
    x: 0.6, y: 4.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: MUTED, charSpacing: 3,
  });

  const qs = [
    ['01', "Quel impact sur l'organisation, et comment l'accompagner ?"],
    ['02', "Que gagne le patient ? Que perd-il ?"],
    ['03', "Comment l'intégrer au modèle existant ?"],
  ];
  qs.forEach(([n, q], i) => {
    const y = 4.7 + i * 1.35;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: y + 1.1, w: 8.8, h: 0.02,
      fill: { color: CREAM_DEEP }, line: { color: CREAM_DEEP, width: 0 },
    });
    s.addText(n, {
      x: 0.6, y, w: 1.1, h: 1.0,
      fontFace: DISPLAY, fontSize: 28, bold: true, color: CORAL, valign: 'top',
    });
    s.addText(q, {
      x: 1.9, y: y + 0.1, w: 7.5, h: 1.0,
      fontFace: DISPLAY, fontSize: 17, color: INK, valign: 'top',
    });
  });
  signature(s);
  pageMark(s, 3, TOTAL);
}

// ===== 4 : PATIENT AU CENTRE =====
{
  const s = base();
  s.addText("03  ·  L'EXPÉRIENCE PATIENT", {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText('Le patient', {
    x: 0.6, y: 2.3, w: 8.8, h: 1.2,
    fontFace: DISPLAY, fontSize: 54, bold: true, color: BORDEAUX,
  });
  s.addText('au centre.', {
    x: 0.6, y: 3.4, w: 8.8, h: 1.2,
    fontFace: DISPLAY, fontSize: 54, bold: true, color: CORAL,
  });
  s.addText("Tout au long du processus d'innovation. Et mesuré.", {
    x: 0.6, y: 4.85, w: 8.8, h: 0.6,
    fontFace: DISPLAY, fontSize: 18, italic: true, color: INK,
  });

  const card = (x, label, title, sub) => {
    s.addShape(pptx.ShapeType.rect, {
      x, y: 6.0, w: 4.2, h: 2.3,
      fill: { color: 'FFFFFF' }, line: { color: CREAM_DEEP, width: 1 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 6.0, w: 0.08, h: 2.3,
      fill: { color: CORAL }, line: { color: CORAL, width: 0 },
    });
    s.addText(label, {
      x: x + 0.3, y: 6.2, w: 3.9, h: 0.35,
      fontFace: BODY, fontSize: 10, bold: true, color: CORAL, charSpacing: 3,
    });
    s.addText(title, {
      x: x + 0.3, y: 6.55, w: 3.9, h: 0.55,
      fontFace: DISPLAY, fontSize: 22, bold: true, color: BORDEAUX,
    });
    s.addText(sub, {
      x: x + 0.3, y: 7.2, w: 3.9, h: 1,
      fontFace: BODY, fontSize: 12, color: INK, valign: 'top',
    });
  };
  card(0.6, 'PROMs', 'État de santé', 'ce que le patient ressent du résultat');
  card(5.2, 'PREMs', 'Vécu du parcours', "ce que le patient vit de l'expérience");

  signature(s);
  pageMark(s, 4, TOTAL);
}

// ===== 5 : CONCLUSION + CTA =====
{
  const s = base();
  s.addText('POUR CONCLURE', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText("L'innovation numérique", {
    x: 0.6, y: 2.1, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 38, color: BORDEAUX,
  });
  s.addText("n'est pas une finalité.", {
    x: 0.6, y: 3.0, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 38, bold: true, color: BORDEAUX,
  });
  s.addText(
    "C'est un projet de transformation humaine et organisationnelle.",
    {
      x: 0.6, y: 4.4, w: 8.8, h: 1.2,
      fontFace: DISPLAY, fontSize: 22, italic: true, color: CORAL,
    }
  );

  // author card
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.4, w: 8.8, h: 1.7,
    fill: { color: 'FFFFFF' }, line: { color: CREAM_DEEP, width: 1 },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.4, w: 0.08, h: 1.7,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('Dr Céline Orhond', {
    x: 0.95, y: 6.55, w: 8, h: 0.5,
    fontFace: DISPLAY, fontSize: 22, bold: true, color: BORDEAUX,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.95, y: 7.05, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 13, color: INK,
  });
  s.addText('Intervenante, Chaire Management in Innovative Health, EDHEC Business School', {
    x: 0.95, y: 7.5, w: 8, h: 0.45,
    fontFace: BODY, fontSize: 11, italic: true, color: MUTED,
  });

  s.addText('Pour aller plus loin', {
    x: 0.6, y: 8.4, w: 8.8, h: 0.3,
    fontFace: BODY, fontSize: 10, bold: true, color: MUTED, charSpacing: 3,
  });
  s.addText('sante.edhec.edu', {
    x: 0.6, y: 8.7, w: 8.8, h: 0.6,
    fontFace: DISPLAY, fontSize: 28, bold: true, color: BORDEAUX,
  });
  pageMark(s, 5, TOTAL);
}

pptx.writeFile({ fileName: '/Users/annaritoper/Desktop/Carrousel_Celine_Orhond_V2_LIGHT.pptx' })
  .then(f => console.log('Wrote', f));
