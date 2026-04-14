// Carrousel LinkedIn - Dr Céline Orhond / EXPe-Santé / EDHEC
const PptxGenJS = require('pptxgenjs');

const BORDEAUX = '6B1E2E';
const BORDEAUX_DARK = '4E1521';
const CREAM = 'F5F0EC';
const CREAM_DARK = 'EAE2DB';
const CORAL = 'E07065';
const WHITE = 'FFFFFF';
const INK = '2A1418';

const HEAD = 'Georgia';
const BODY = 'Arial';

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'SQ', width: 10, height: 10 });
pptx.layout = 'SQ';

const FOOTER = 'Dr Céline Orhond  |  EXPe-Santé  |  EDHEC';

function addFooter(s, { onDark = false, page = null, total = null } = {}) {
  const bar = onDark ? BORDEAUX_DARK : CREAM_DARK;
  const txt = onDark ? CREAM : BORDEAUX;
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 9.45, w: 10, h: 0.55,
    fill: { color: bar }, line: { color: bar, width: 0 },
  });
  s.addText(FOOTER, {
    x: 0.45, y: 9.5, w: 7, h: 0.45,
    fontFace: BODY, fontSize: 9, color: txt, valign: 'middle', align: 'left',
    charSpacing: 2,
  });
  if (page && total) {
    s.addText(`${page} / ${total}`, {
      x: 8.2, y: 9.5, w: 1.4, h: 0.45,
      fontFace: BODY, fontSize: 9, bold: true, color: onDark ? CORAL : BORDEAUX,
      valign: 'middle', align: 'right',
    });
  }
}

function coralBar(s, x, y, h) {
  s.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.12, h,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
}

function contentSlide({ tag, title, body, note, page, total }) {
  const s = pptx.addSlide();
  s.background = { color: CREAM };

  // top bordeaux band
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.7,
    fill: { color: BORDEAUX }, line: { color: BORDEAUX, width: 0 },
  });
  s.addText('TRIBUNE  ·  CHAIRE MANAGEMENT IN INNOVATIVE HEALTH', {
    x: 0.45, y: 0, w: 9.1, h: 0.7,
    fontFace: BODY, fontSize: 10, bold: true, color: CREAM,
    valign: 'middle', align: 'left', charSpacing: 4,
  });

  // tag
  s.addText(tag, {
    x: 0.9, y: 1.1, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL,
    charSpacing: 4,
  });

  // coral bar + title
  coralBar(s, 0.7, 1.6, 1.6);
  s.addText(title, {
    x: 0.95, y: 1.5, w: 8.3, h: 1.8,
    fontFace: HEAD, fontSize: 30, bold: true, color: BORDEAUX,
    valign: 'top', align: 'left', paraSpaceAfter: 4,
  });

  // body card
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 3.7, w: 8.6, h: note ? 4.2 : 5.0,
    fill: { color: WHITE }, line: { color: CREAM_DARK, width: 1 },
  });
  s.addText(body, {
    x: 1.0, y: 3.95, w: 8.0, h: note ? 3.6 : 4.4,
    fontFace: BODY, fontSize: 16, color: INK,
    valign: 'top', align: 'left', paraSpaceAfter: 8,
  });

  if (note) {
    s.addShape(pptx.ShapeType.rect, {
      x: 0.7, y: 8.05, w: 8.6, h: 1.15,
      fill: { color: BORDEAUX }, line: { color: BORDEAUX, width: 0 },
    });
    s.addText(note, {
      x: 1.0, y: 8.1, w: 8.0, h: 1.05,
      fontFace: HEAD, fontSize: 13, italic: true, color: CREAM,
      valign: 'middle', align: 'left',
    });
  }

  addFooter(s, { onDark: false, page, total });
}

function darkSlide({ kicker, title, subtitle, page, total, centered = true }) {
  const s = pptx.addSlide();
  s.background = { color: BORDEAUX };

  // decorative coral corner
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.25, h: 10,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });

  if (kicker) {
    s.addText(kicker, {
      x: 0.8, y: 1.0, w: 8.6, h: 0.4,
      fontFace: BODY, fontSize: 12, bold: true, color: CORAL,
      charSpacing: 5, align: centered ? 'center' : 'left',
    });
  }
  s.addText(title, {
    x: 0.8, y: centered ? 3.2 : 1.8, w: 8.6, h: centered ? 4.0 : 5.5,
    fontFace: HEAD, fontSize: centered ? 34 : 30, bold: true, color: CREAM,
    align: centered ? 'center' : 'left', valign: 'middle',
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.8, y: 7.5, w: 8.6, h: 1.2,
      fontFace: BODY, fontSize: 14, color: CREAM,
      italic: true, align: centered ? 'center' : 'left', valign: 'top',
    });
  }
  addFooter(s, { onDark: true, page, total });
  return s;
}

function quoteSlide({ quote, attribution, page, total }) {
  const s = pptx.addSlide();
  s.background = { color: BORDEAUX };
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.25, h: 10,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('“', {
    x: 0.6, y: 0.6, w: 2, h: 2,
    fontFace: HEAD, fontSize: 140, bold: true, color: CORAL,
    valign: 'top', align: 'left',
  });
  s.addText(quote, {
    x: 1.0, y: 2.4, w: 8.2, h: 5.5,
    fontFace: HEAD, fontSize: 22, italic: true, color: CREAM,
    valign: 'middle', align: 'left',
  });
  s.addText(attribution, {
    x: 1.0, y: 8.2, w: 8, h: 0.5,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL,
    charSpacing: 3, align: 'left',
  });
  addFooter(s, { onDark: true, page, total });
}

const TOTAL = 8;

// --- Slide 1 : titre ---
const s1 = darkSlide({
  kicker: 'TRIBUNE  ·  CHAIRE MANAGEMENT IN INNOVATIVE HEALTH',
  title: "Transformer le système de santé : l'innovation numérique est un levier, pas un but",
  subtitle: "Dr Céline Orhond, Fondatrice d'EXPe-Santé\nIntervenante Chaire Management in Innovative Health",
  page: 1, total: TOTAL,
  centered: false,
});

// --- Slide 2 : le paradoxe ---
contentSlide({
  tag: 'LE CONSTAT',
  title: "Innover n'est plus une option.",
  body:
    "Le système de santé doit gagner en efficience pour faire face à la pression économique, aux tensions sur les ressources humaines et à l'augmentation des besoins de santé.\n\n" +
    "Le paradoxe est fort : il n'y a jamais eu autant de solutions digitales, et pourtant une grande partie d'entre elles restent sous-utilisées ou mal utilisées.",
  note: "Décloisonnement ville-hôpital, virage ambulatoire, structuration des parcours, plan France 2030 : les chantiers sont là.",
  page: 2, total: TOTAL,
});

// --- Slide 3 : quote ---
quoteSlide({
  quote: "« Chaque solution sous-utilisée représente un coût financier et humain, mais surtout une occasion manquée d'améliorer le système de santé. »",
  attribution: "DR CÉLINE ORHOND",
  page: 3, total: TOTAL,
});

// --- Slide 4 : co-construction ---
contentSlide({
  tag: 'CO-CONSTRUCTION OU FAUX CENTRAGE',
  title: "Des solutions « clefs en mains », sans vrais utilisateurs.",
  body:
    "On affirme beaucoup aujourd'hui co-construire avec les utilisateurs, mais la réalité est souvent différente. Trop de solutions sont conçues à partir d'un besoin imaginé par les concepteurs, puis testées sur 2 ou 3 personnes.\n\n" +
    "Mettre réellement les premiers concernés, patients et professionnels, au centre ne signifie pas seulement leur donner une place dans un comité de pilotage : c'est partir du besoin avéré et caractérisé d'un groupe d'utilisateurs.",
  page: 4, total: TOTAL,
});

// --- Slide 5 : simplifier ---
contentSlide({
  tag: "L'INNOVATION UTILE",
  title: "Une innovation doit simplifier les tâches, pas les compliquer.",
  body:
    "Cela paraît évident, et pourtant : certains outils digitaux nécessitent des saisies supplémentaires, et le déclenchement d'alertes peut aider à sécuriser sans être davantage de charge pour l'utilisateur, ou au contraire devenir une friction.\n\n" +
    "La vraie question : au-delà de la technologie, quels sont les freins concrets, et comment tenir compte dès la conception de ce que vivent les utilisateurs au quotidien ?",
  page: 5, total: TOTAL,
});

// --- Slide 6 : 3 questions ---
{
  const s = pptx.addSlide();
  s.background = { color: CREAM };
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.7,
    fill: { color: BORDEAUX }, line: { color: BORDEAUX, width: 0 },
  });
  s.addText('TRIBUNE  ·  CHAIRE MANAGEMENT IN INNOVATIVE HEALTH', {
    x: 0.45, y: 0, w: 9.1, h: 0.7,
    fontFace: BODY, fontSize: 10, bold: true, color: CREAM,
    valign: 'middle', charSpacing: 4,
  });
  s.addText('AVANT DE DÉPLOYER', {
    x: 0.9, y: 1.1, w: 8, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 4,
  });
  coralBar(s, 0.7, 1.6, 1.4);
  s.addText("3 questions à se poser avant toute innovation numérique en santé.", {
    x: 0.95, y: 1.5, w: 8.3, h: 1.5,
    fontFace: HEAD, fontSize: 28, bold: true, color: BORDEAUX,
  });

  const cards = [
    ['01', 'Impact organisationnel', "Comment cette innovation va-t-elle transformer l'organisation, et comment va-t-on accompagner ce changement ?"],
    ['02', 'Gain pour le patient', "Qu'est-ce que le patient va gagner, et que va-t-il perdre à la fin du processus de soin ?"],
    ['03', 'Intégration au modèle', "Comment cette innovation s'intègre-t-elle concrètement et facilement dans le modèle existant ?"],
  ];
  cards.forEach(([n, h, b], i) => {
    const y = 3.35 + i * 1.85;
    s.addShape(pptx.ShapeType.rect, {
      x: 0.7, y, w: 8.6, h: 1.65,
      fill: { color: WHITE }, line: { color: CREAM_DARK, width: 1 },
    });
    coralBar(s, 0.7, y, 1.65);
    s.addText(n, {
      x: 1.0, y: y + 0.15, w: 1.1, h: 1.4,
      fontFace: HEAD, fontSize: 40, bold: true, color: CORAL, valign: 'middle',
    });
    s.addText(h, {
      x: 2.2, y: y + 0.15, w: 7.0, h: 0.5,
      fontFace: HEAD, fontSize: 17, bold: true, color: BORDEAUX, valign: 'top',
    });
    s.addText(b, {
      x: 2.2, y: y + 0.65, w: 7.0, h: 1.0,
      fontFace: BODY, fontSize: 13, color: INK, valign: 'top',
    });
  });
  addFooter(s, { page: 6, total: TOTAL });
}

// --- Slide 7 : expérience patient + PROMs / PREMs ---
contentSlide({
  tag: "MANAGER PAR L'EXPÉRIENCE PATIENT",
  title: "L'expérience patient, un vrai levier de valeur.",
  body:
    "Positionner l'expérience patient au centre de la démarche de transformation est essentiel pour assurer de l'efficience d'une solution. Le résultat final est destiné au patient, il s'agit donc de se centrer sur lui tout au long du processus d'innovation.\n\n" +
    "Mesurer les PROMs (Patient Reported Outcomes Measures) renseigne sur l'état de santé perçu, et les PREMs (Patient Reported Experience Measures) renseignent sur le vécu : essentiels pour piloter la transformation.",
  page: 7, total: TOTAL,
});

// --- Slide 8 : conclusion + CTA ---
{
  const s = pptx.addSlide();
  s.background = { color: BORDEAUX };
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.25, h: 10,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText('POUR CONCLURE', {
    x: 0.8, y: 0.9, w: 8.6, h: 0.4,
    fontFace: BODY, fontSize: 12, bold: true, color: CORAL, charSpacing: 5,
  });
  s.addText(
    "Innover en santé, ce n'est pas ajouter des outils numériques ou technologiques à un système déjà complexe. C'est accepter de modifier l'équilibre des structures de santé et des équipes, de lancer une démarche de transformation qui fait coopérer, et de recentrer la réflexion sur l'humain : patient, professionnel, organisation.",
    {
      x: 0.9, y: 1.6, w: 8.4, h: 3.6,
      fontFace: HEAD, fontSize: 18, color: CREAM, italic: true,
      valign: 'top', align: 'left', paraSpaceAfter: 6,
    }
  );
  s.addText(
    "L'innovation numérique est une nécessité, et devient un moteur d'une évolution en profondeur du système de santé, à condition de la penser d'abord comme un projet de transformation organisationnelle et humaine.",
    {
      x: 0.9, y: 5.3, w: 8.4, h: 2.3,
      fontFace: BODY, fontSize: 14, color: CREAM, valign: 'top',
    }
  );

  // CTA card
  s.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: 7.75, w: 8.6, h: 1.35,
    fill: { color: CREAM }, line: { color: CREAM, width: 0 },
  });
  s.addText('Pour aller plus loin', {
    x: 1.0, y: 7.85, w: 7, h: 0.4,
    fontFace: BODY, fontSize: 11, bold: true, color: CORAL, charSpacing: 3,
  });
  s.addText('sante.edhec.edu', {
    x: 1.0, y: 8.2, w: 8, h: 0.8,
    fontFace: HEAD, fontSize: 26, bold: true, color: BORDEAUX,
  });
  addFooter(s, { onDark: true, page: 8, total: TOTAL });
}

const out = '/Users/annaritoper/Desktop/Carrousel_Celine_Orhond_EDHEC.pptx';
pptx.writeFile({ fileName: out }).then(f => console.log('Wrote', f));
