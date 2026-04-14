// Build Loick F2 LinkedIn carousel (3 slides, 1080x1080)
const PptxGenJS = require('pptxgenjs');
const path = require('path');

const LOGO = '/tmp/edhec_logo/EDHEC_Logo_horizontal/BUREAUTIQUE/EDHEC_Logo_horizontal_Blanc/EDHEC_Logo_horizontal_Blanc.png';

const BORDEAUX = '6B1E2E';
const CREAM = 'F5F0EC';
const CORAL = 'E07065';
const WHITE = 'FFFFFF';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'SQ', width: 10, height: 10 });
pptx.layout = 'SQ';

const FONT = 'Montserrat';

function buildSlide({ stat, main, secondary }) {
  const s = pptx.addSlide();
  s.background = { color: BORDEAUX };

  // Logo top left
  s.addImage({ path: LOGO, x: 0.45, y: 0.45, w: 1.6, h: 0.45 });

  // Small section tag top right
  s.addText('BAROMÈTRE IPSOS × EDHEC', {
    x: 4.5, y: 0.5, w: 5.1, h: 0.35,
    fontFace: FONT, fontSize: 10, color: CREAM, bold: true,
    charSpacing: 4, align: 'right',
  });

  // Hero circle
  const cx = 5.0, cy = 3.9, r = 1.85;
  s.addShape(pptx.ShapeType.ellipse, {
    x: cx - r, y: cy - r, w: r * 2, h: r * 2,
    fill: { color: CREAM }, line: { color: CREAM, width: 0 },
  });

  // Stat number inside circle
  s.addText(stat, {
    x: cx - r, y: cy - r, w: r * 2, h: r * 2,
    fontFace: FONT, fontSize: 80, bold: true, color: BORDEAUX,
    align: 'center', valign: 'middle',
  });

  // Thin cream divider line
  s.addShape(pptx.ShapeType.rect, {
    x: 4.4, y: 6.25, w: 1.2, h: 0.04,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });

  // Main line
  s.addText(main, {
    x: 0.8, y: 6.45, w: 8.4, h: 1.3,
    fontFace: FONT, fontSize: 22, bold: true, color: CREAM,
    align: 'center', valign: 'top',
  });

  // Secondary line
  s.addText(secondary, {
    x: 1.0, y: 7.95, w: 8.0, h: 0.9,
    fontFace: FONT, fontSize: 15, color: CORAL,
    align: 'center', valign: 'top', italic: false,
  });

  // Footer bar
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 9.35, w: 10, h: 0.65,
    fill: { color: '581824' }, line: { color: '581824', width: 0 },
  });
  s.addText('Source : Baromètre Ipsos x EDHEC, 2025', {
    x: 0.5, y: 9.42, w: 6, h: 0.5,
    fontFace: FONT, fontSize: 10, color: CREAM, align: 'left', valign: 'middle',
  });
  s.addText('Swipe →', {
    x: 7.5, y: 9.42, w: 2, h: 0.5,
    fontFace: FONT, fontSize: 10, bold: true, color: CORAL,
    align: 'right', valign: 'middle',
  });
}

buildSlide({
  stat: '60 %',
  main: "des Français estiment que l'IA peut améliorer la qualité des soins",
  secondary: "58 % pensent qu'elle peut réduire les inégalités d'accès aux soins",
});
buildSlide({
  stat: '51 %',
  main: 'craignent les cyberattaques sur leurs données de santé',
  secondary: '48 % redoutent la perte de confidentialité',
});
buildSlide({
  stat: '+80 %',
  main: "souhaiteraient un second avis si l'IA et le médecin sont en désaccord",
  secondary: "Près de 4 Français sur 10 font davantage confiance au duo médecin + IA",
});

const out = path.join(__dirname, '..', 'outputs', 'Loick_F2_Barometre.pptx');
pptx.writeFile({ fileName: out }).then(f => console.log('Wrote', f));
