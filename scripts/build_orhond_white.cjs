// Carrousel Céline Orhond V3 WHITE - 4 slides, éditorial, pur blanc
const PptxGenJS = require('pptxgenjs');

const BORDEAUX = '6B1E2E';
const CORAL = 'E07065';
const INK = '1F1216';
const MUTED = '8A6B72';

const DISPLAY = 'Georgia';
const BODY = 'Arial';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'SQ', width: 10, height: 10 });
pptx.layout = 'SQ';

function base() {
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 0.7, w: 0.5, h: 0.04,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  return s;
}
function pageMark(s, n, total) {
  s.addText(`0${n} / 0${total}`, {
    x: 8.2, y: 0.65, w: 1.3, h: 0.35,
    fontFace: BODY, fontSize: 10, bold: true,
    color: MUTED, align: 'right', charSpacing: 3,
  });
}

const TOTAL = 4;

// ===== 1 : TITRE =====
{
  const s = base();
  s.addText('TRIBUNE  ·  SANTÉ & INNOVATION', {
    x: 0.7, y: 1.1, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText('Transformer', {
    x: 0.7, y: 2.4, w: 8.6, h: 1.2,
    fontFace: DISPLAY, fontSize: 60, bold: true, color: BORDEAUX,
  });
  s.addText('le système', {
    x: 0.7, y: 3.55, w: 8.6, h: 1.2,
    fontFace: DISPLAY, fontSize: 60, bold: true, color: BORDEAUX,
  });
  s.addText('de santé.', {
    x: 0.7, y: 4.7, w: 8.6, h: 1.2,
    fontFace: DISPLAY, fontSize: 60, bold: true, color: BORDEAUX,
  });
  s.addText("L'innovation numérique est un levier,", {
    x: 0.7, y: 6.4, w: 8.6, h: 0.5,
    fontFace: DISPLAY, fontSize: 22, italic: true, color: INK,
  });
  s.addText('pas un but.', {
    x: 0.7, y: 6.95, w: 8.6, h: 0.5,
    fontFace: DISPLAY, fontSize: 22, italic: true, bold: true, color: CORAL,
  });
  // author
  s.addText('Dr Céline Orhond', {
    x: 0.7, y: 8.6, w: 8.6, h: 0.45,
    fontFace: BODY, fontSize: 15, bold: true, color: BORDEAUX,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.7, y: 9.0, w: 6, h: 0.4,
    fontFace: BODY, fontSize: 12, color: MUTED,
  });
  s.addText('SWIPE  →', {
    x: 7.5, y: 9.0, w: 2, h: 0.4,
    fontFace: BODY, fontSize: 10, bold: true, color: CORAL,
    charSpacing: 4, align: 'right',
  });
  pageMark(s, 1, TOTAL);
}

// ===== 2 : L'ENJEU =====
{
  const s = base();
  s.addText("01  ·  L'ENJEU", {
    x: 0.7, y: 1.1, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });

  s.addText("L'IA n'est pas un outil", {
    x: 0.7, y: 2.1, w: 8.6, h: 0.9,
    fontFace: DISPLAY, fontSize: 38, color: INK,
  });
  s.addText('à déployer.', {
    x: 0.7, y: 2.95, w: 8.6, h: 0.9,
    fontFace: DISPLAY, fontSize: 38, italic: true, color: MUTED,
  });
  s.addText("C'est un", {
    x: 0.7, y: 4.3, w: 8.6, h: 0.9,
    fontFace: DISPLAY, fontSize: 40, color: BORDEAUX,
  });
  s.addText('choix stratégique', {
    x: 0.7, y: 5.15, w: 8.6, h: 1.0,
    fontFace: DISPLAY, fontSize: 44, bold: true, color: BORDEAUX,
  });
  s.addText('qui engage la gouvernance des organisations.', {
    x: 0.7, y: 6.15, w: 8.6, h: 0.9,
    fontFace: DISPLAY, fontSize: 22, color: BORDEAUX,
  });

  // thin accent rule
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 7.45, w: 1.2, h: 0.03,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText(
    "Arbitrer les investissements. Anticiper les impacts. Évaluer la valeur produite pour les patients, les professionnels et les organisations.",
    {
      x: 0.7, y: 7.7, w: 8.6, h: 1.6,
      fontFace: DISPLAY, fontSize: 16, italic: true, color: INK,
    }
  );
  pageMark(s, 2, TOTAL);
}

// ===== 3 : LA DÉMARCHE =====
{
  const s = base();
  s.addText('02  ·  LA DÉMARCHE', {
    x: 0.7, y: 1.1, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });

  s.addText("Passer de l'ambition", {
    x: 0.7, y: 2.2, w: 8.6, h: 1.0,
    fontFace: DISPLAY, fontSize: 42, color: BORDEAUX,
  });
  s.addText('stratégique', {
    x: 0.7, y: 3.15, w: 8.6, h: 1.0,
    fontFace: DISPLAY, fontSize: 42, italic: true, color: CORAL,
  });
  s.addText('au déploiement collectif.', {
    x: 0.7, y: 4.1, w: 8.6, h: 1.0,
    fontFace: DISPLAY, fontSize: 42, bold: true, color: BORDEAUX,
  });

  // thin rule
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 5.65, w: 1.2, h: 0.03,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });

  const lines = [
    'Alignement stratégique et coopération interdisciplinaire.',
    'Appropriation par les équipes et conduite du changement.',
    "L'expérience patient comme levier de valeur et de sens.",
  ];
  lines.forEach((t, i) => {
    const y = 6.0 + i * 0.95;
    s.addText('·', {
      x: 0.7, y, w: 0.3, h: 0.6,
      fontFace: DISPLAY, fontSize: 28, bold: true, color: CORAL,
    });
    s.addText(t, {
      x: 1.1, y, w: 8.2, h: 0.9,
      fontFace: DISPLAY, fontSize: 20, color: INK, valign: 'top',
    });
  });
  pageMark(s, 3, TOTAL);
}

// ===== 4 : CONCLUSION + CTA =====
{
  const s = base();
  s.addText('POUR CONCLURE', {
    x: 0.7, y: 1.1, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 5,
  });

  s.addText('Créer de la valeur', {
    x: 0.7, y: 2.3, w: 8.6, h: 1.1,
    fontFace: DISPLAY, fontSize: 50, bold: true, color: BORDEAUX,
  });
  s.addText("grâce à l'IA,", {
    x: 0.7, y: 3.35, w: 8.6, h: 1.1,
    fontFace: DISPLAY, fontSize: 50, color: BORDEAUX,
  });
  s.addText('avec responsabilité', {
    x: 0.7, y: 4.45, w: 8.6, h: 1.0,
    fontFace: DISPLAY, fontSize: 36, italic: true, color: CORAL,
  });
  s.addText('et impact.', {
    x: 0.7, y: 5.35, w: 8.6, h: 1.0,
    fontFace: DISPLAY, fontSize: 36, italic: true, bold: true, color: CORAL,
  });

  // thin rule
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 7.0, w: 1.2, h: 0.03,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('Dr Céline Orhond', {
    x: 0.7, y: 7.25, w: 8.6, h: 0.5,
    fontFace: DISPLAY, fontSize: 22, bold: true, color: BORDEAUX,
  });
  s.addText("Fondatrice d'EXPe-Santé", {
    x: 0.7, y: 7.75, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 13, color: INK,
  });
  s.addText('Intervenante, Certificat Stratégie et Leadership en Santé', {
    x: 0.7, y: 8.15, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 12, color: MUTED,
  });
  s.addText('Chaire Management in Innovative Health, EDHEC Business School', {
    x: 0.7, y: 8.5, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 12, italic: true, color: MUTED,
  });
  s.addText('sante.edhec.edu', {
    x: 0.7, y: 9.05, w: 8.6, h: 0.5,
    fontFace: DISPLAY, fontSize: 20, bold: true, color: BORDEAUX,
  });
  pageMark(s, 4, TOTAL);
}

pptx.writeFile({ fileName: '/Users/annaritoper/Desktop/Carrousel_Celine_Orhond_V3_WHITE.pptx' })
  .then(f => console.log('Wrote', f));
