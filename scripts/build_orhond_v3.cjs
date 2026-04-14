// Carrousel Céline Orhond V3 - 4 slides, liens Certificat HIT
const PptxGenJS = require('pptxgenjs');

const CREAM = 'F5F0EC';
const CREAM_DEEP = 'EAE2DB';
const BORDEAUX = '6B1E2E';
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
    color: MUTED, charSpacing: 4,
  });
}

const TOTAL = 4;

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

// ===== 2 : L'ENJEU / ARBITRAGE STRATÉGIQUE =====
{
  const s = base();
  s.addText("01  ·  L'ENJEU", {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText("L'enjeu n'est pas", {
    x: 0.6, y: 2.2, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 44, color: INK,
  });
  s.addText('technologique.', {
    x: 0.6, y: 3.1, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 44, italic: true, color: MUTED,
  });
  s.addText("C'est un", {
    x: 0.6, y: 4.5, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 44, color: BORDEAUX,
  });
  s.addText('arbitrage stratégique.', {
    x: 0.6, y: 5.4, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 44, bold: true, color: BORDEAUX,
  });
  s.addText(
    "Comment transformer les organisations de santé pour que l'innovation crée réellement de la valeur ?",
    {
      x: 0.6, y: 7.3, w: 8.8, h: 1.5,
      fontFace: DISPLAY, fontSize: 17, italic: true, color: CORAL,
    }
  );
  signature(s);
  pageMark(s, 2, TOTAL);
}

// ===== 3 : LA DÉMARCHE COLLECTIVE =====
{
  const s = base();
  s.addText('02  ·  LA DÉMARCHE', {
    x: 0.6, y: 1.0, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText('Pas un outil.', {
    x: 0.6, y: 1.8, w: 8.8, h: 0.9,
    fontFace: DISPLAY, fontSize: 36, italic: true, color: MUTED,
  });
  s.addText('Une démarche collective.', {
    x: 0.6, y: 2.7, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 40, bold: true, color: BORDEAUX,
  });

  // divider
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 4.2, w: 1.2, h: 0.04,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('Trois leviers concrets', {
    x: 0.6, y: 4.35, w: 8.8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: MUTED, charSpacing: 3,
  });

  const items = [
    ['01', "Simplifier", "Une innovation doit alléger les tâches, pas les complexifier."],
    ['02', "Centrer sur le patient", "Positionner l'expérience patient au cœur de la transformation."],
    ['03', "Mobiliser les équipes", "Co-construire avec celles et ceux qui vivent le soin."],
  ];
  items.forEach(([n, h, b], i) => {
    const y = 5.05 + i * 1.25;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.6, y: y + 1.05, w: 8.8, h: 0.02,
      fill: { color: CREAM_DEEP }, line: { color: CREAM_DEEP, width: 0 },
    });
    s.addText(n, {
      x: 0.6, y, w: 0.9, h: 1.0,
      fontFace: DISPLAY, fontSize: 22, bold: true, color: CORAL, valign: 'top',
    });
    s.addText(h, {
      x: 1.6, y: y, w: 7.8, h: 0.45,
      fontFace: DISPLAY, fontSize: 17, bold: true, color: BORDEAUX,
    });
    s.addText(b, {
      x: 1.6, y: y + 0.45, w: 7.8, h: 0.6,
      fontFace: BODY, fontSize: 12, color: INK,
    });
  });
  signature(s);
  pageMark(s, 3, TOTAL);
}

// ===== 4 : CONCLUSION + CTA =====
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
  s.addText('est un projet de', {
    x: 0.6, y: 3.0, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 38, color: BORDEAUX,
  });
  s.addText('transformation', {
    x: 0.6, y: 3.9, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 38, bold: true, color: BORDEAUX,
  });
  s.addText('humaine et organisationnelle.', {
    x: 0.6, y: 4.8, w: 8.8, h: 1.0,
    fontFace: DISPLAY, fontSize: 26, italic: true, color: CORAL,
  });

  // author card
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.5, w: 8.8, h: 1.7,
    fill: { color: 'FFFFFF' }, line: { color: CREAM_DEEP, width: 1 },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 6.5, w: 0.08, h: 1.7,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('Dr Céline Orhond', {
    x: 0.95, y: 6.65, w: 8, h: 0.5,
    fontFace: DISPLAY, fontSize: 22, bold: true, color: BORDEAUX,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.95, y: 7.15, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 13, color: INK,
  });
  s.addText('Intervenante, Chaire Management in Innovative Health, EDHEC Business School', {
    x: 0.95, y: 7.6, w: 8, h: 0.45,
    fontFace: BODY, fontSize: 11, italic: true, color: MUTED,
  });

  s.addText('Pour aller plus loin', {
    x: 0.6, y: 8.45, w: 8.8, h: 0.3,
    fontFace: BODY, fontSize: 10, bold: true, color: MUTED, charSpacing: 3,
  });
  s.addText('sante.edhec.edu', {
    x: 0.6, y: 8.75, w: 8.8, h: 0.6,
    fontFace: DISPLAY, fontSize: 28, bold: true, color: BORDEAUX,
  });
  pageMark(s, 4, TOTAL);
}

pptx.writeFile({ fileName: '/Users/annaritoper/Desktop/Carrousel_Celine_Orhond_V3_4PAGES.pptx' })
  .then(f => console.log('Wrote', f));
