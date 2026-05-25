// ─────────────────────────────────────────────
//  Branding & Contact  (anpassen nach Bedarf)
// ─────────────────────────────────────────────
export const COMPANY_NAME      = 'EDUTECSOL GmbH'
export const COMPANY_SUBTITLE  = 'education technology solutions'
export const ASSESSMENT_TITLE  = 'Strategische Schulführung im digitalen Wandel'

// Primärkontakt für Schulen: Enikö (EDUTECSOL) – die "Insiderin"
export const CONTACT_URL       = 'https://www.edutecsol.ch/kontakt'  // TODO: anpassen
export const CONTACT_PERSON    = 'Enikö Parrag'
export const CONTACT_PHONE     = '+41 XX XXX XX XX'                  // TODO: anpassen
export const CONTACT_EMAIL     = 'enikoe.parrag@edutecsol.ch'        // TODO: anpassen
export const PARTNER_NAME      = 'mitPlan GmbH'

// Externe Anschluss-Links
export const CALENDLY_URL      = 'https://calendly.com/edutecsol/30min'  // TODO: anpassen
export const KLAUSUR_URL       = 'https://www.mitplan.ch/angebote/weiterbildungen/strategische-schulfuehrung-im-digitalen-wandel-139'

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
export type Answers = Record<string, number>  // key: "dimIdx_qIdx"  value: 1‒4

export interface Dimension {
  id: string
  title: string
  isCap: boolean
  questions: string[]
  recommendations: Record<number, string>
}

// ─────────────────────────────────────────────
//  Scale & Level labels
// ─────────────────────────────────────────────
export const SCALE_LABELS = ['Noch nicht', 'In Planung', 'Teilweise', 'Etabliert'] as const

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Einsteiger',
  2: 'Entwickler',
  3: 'Fortgeschritten',
  4: 'Vorreiter',
}

export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Ihre Schule steht am Beginn der digitalen Transformation. Es gibt grosses Entwicklungspotenzial, das gezielt erschlossen werden kann.',
  2: 'Erste wichtige Grundlagen sind gelegt. Mit einem klaren Fahrplan können Sie nun gezielt vorwärtsgehen.',
  3: 'Ihre Schule hat solide Fortschritte gemacht. Jetzt geht es darum, diese zu konsolidieren und weiterzuentwickeln.',
  4: 'Ihre Schule ist ein Vorbild in der digitalen Schulführung. Teilen Sie Ihre Erfahrungen und inspirieren Sie andere.',
}

export const LEVEL_COLORS: Record<number, string> = {
  1: '#E24B4A',
  2: '#EF9F27',
  3: '#378ADD',
  4: '#639922',
}

// ─────────────────────────────────────────────
//  Dimensions & Questions
// ─────────────────────────────────────────────
export const DIMENSIONS: Dimension[] = [
  {
    id: 'D1', title: 'Digitale Strategie & Zielbild', isCap: false,
    questions: [
      'Unser Digitalisierungskonzept ist im Führungsteam bekannt und wird aktiv zur Steuerung genutzt.',
      'Digitale Ziele sind verbindlich in der Jahresplanung verankert und mit Ressourcen hinterlegt.',
      'Die Schulleitung kommuniziert die digitale Vision regelmässig und aktiv ins Kollegium.',
    ],
    recommendations: {
      1: 'Entwickeln Sie ein einfaches Digitalisierungskonzept. Kantonale Vorlagen oder ein Kick-off-Workshop sind ein guter Einstieg.',
      2: 'Konkretisieren Sie Ihre Ziele mit messbaren Meilensteinen und verankern Sie diese verbindlich in der Jahresplanung.',
      3: 'Überprüfen Sie die Wirksamkeit Ihrer Strategie jährlich und kommunizieren Sie Fortschritte transparent.',
      4: 'Vorbildlich! Teilen Sie Ihr Konzept als Best Practice und entwickeln Sie Ihre Strategie für die nächste Stufe weiter.',
    },
  },
  {
    id: 'D2', title: 'KI im Lehren und Lernen', isCap: false,
    questions: [
      'Lehrpersonen nutzen KI-Tools gezielt in der Unterrichtsvorbereitung und -gestaltung.',
      'Es gibt schulweit gültige Richtlinien für den KI-Einsatz im Unterricht.',
      'Lernende werden systematisch im kompetenten und kritischen KI-Umgang geschult.',
    ],
    recommendations: {
      1: 'Starten Sie mit einer KI-Sensibilisierung im Kollegium. Zeigen Sie konkrete Beispiele für den Berufsschulalltag.',
      2: 'Erarbeiten Sie gemeinsam einfache KI-Richtlinien und fördern Sie erste Pilotprojekte im Unterricht.',
      3: 'Systemisieren Sie die KI-Kompetenzvermittlung und verankern Sie sie curricular in den Fächern.',
      4: 'Hervorragend! Positionieren Sie Ihre Schule als KI-Kompetenzzentrum und vernetzen Sie sich aktiv.',
    },
  },
  {
    id: 'D3', title: 'Governance & Entscheidungsstrukturen', isCap: true,
    questions: [
      'Digitale Zuständigkeiten (z.B. Digitalverantwortliche/r) sind klar geregelt und mit Mandat hinterlegt.',
      'Digitalisierungsprojekte werden strukturiert geplant, umgesetzt und evaluiert.',
      'Lehrpersonen sind aktiv in digitale Entscheidungsprozesse einbezogen.',
    ],
    recommendations: {
      1: 'Benennen Sie eine digitale Anlaufstelle. Klare Zuständigkeiten sind das Fundament erfolgreicher Digitalstrategien.',
      2: 'Entwickeln Sie ein Steuerungsmodell mit klaren Verantwortlichkeiten, Ressourcen und Evaluationsprozessen.',
      3: 'Stärken Sie die partizipative Steuerung: Binden Sie das Kollegium noch stärker in Entscheidungen ein.',
      4: 'Ihre Governance ist vorbildlich. Dokumentieren Sie Ihre Strukturen für andere Schulen als Referenzmodell.',
    },
  },
  {
    id: 'D4', title: 'Datenschutz & digitale Ethik', isCap: true,
    questions: [
      'Alle eingesetzten Tools wurden auf Datenschutzkonformität (revDSG) geprüft und dokumentiert.',
      'Das Kollegium kennt die geltenden Datenschutz- und Urheberrechtsregeln.',
      'Ethische Fragen rund um KI und Digitalisierung werden aktiv und regelmässig thematisiert.',
    ],
    recommendations: {
      1: 'Erstellen Sie eine Tool-Übersicht und prüfen Sie deren DSG-Konformität. Dies ist rechtlich verpflichtend.',
      2: 'Schulen Sie das Kollegium zu Datenschutzgrundlagen und erarbeiten Sie eine Richtlinie für digitale Tools.',
      3: 'Vertiefen Sie die ethische Reflexion: Diskutieren Sie KI-Bias, Transparenz und Fairness im Team.',
      4: 'Ihr Umgang mit Datenschutz und Ethik ist vorbildlich. Teilen Sie Ihre Ansätze mit anderen Schulen.',
    },
  },
  {
    id: 'D5', title: 'Infrastruktur & digitale Tools', isCap: false,
    questions: [
      'Die IT-Infrastruktur (WLAN, Geräte, Software) ist stabil, sicher und ausreichend dimensioniert.',
      'Lehrpersonen erhalten schnellen und kompetenten IT-Support.',
      'Digitale Tools (Lernplattformen, Portfolio, Kollaboration) werden schulweit koordiniert eingesetzt.',
    ],
    recommendations: {
      1: 'Führen Sie eine Infrastruktur-Bestandsaufnahme durch und priorisieren Sie die dringendsten Investitionen.',
      2: 'Entwickeln Sie eine 3-Jahres-Roadmap für IT-Investitionen und klären Sie Support-Strukturen.',
      3: 'Standardisieren Sie den Tool-Einsatz schulweit und stellen Sie verlässliche Support-Kanäle sicher.',
      4: 'Ihre Infrastruktur ist solide. Fokussieren Sie auf kontinuierliche Modernisierung und Usability.',
    },
  },
  {
    id: 'D6', title: 'Personalentwicklung & Kompetenzen', isCap: false,
    questions: [
      'Digitale Weiterbildung ist ein fester Bestandteil der Personalstrategie.',
      'Lehrpersonen werden gezielt und regelmässig für digitale Themen qualifiziert.',
      'Kollegiales Peer-Learning für digitale Praxis (Hospitation, Lerngemeinschaften) ist etabliert.',
    ],
    recommendations: {
      1: 'Erheben Sie den Weiterbildungsbedarf im Kollegium und entwickeln Sie ein einfaches digitales Lernprogramm.',
      2: 'Integrieren Sie digitale Weiterbildung verbindlich in Mitarbeitergespräche und Jahresplanung.',
      3: 'Fördern Sie Peer-Learning-Formate wie Lesson Studies oder digitale Lerngemeinschaften.',
      4: 'Ihre Personalentwicklung ist vorbildlich. Erwägen Sie die Ausbildung interner Digitalcoaches.',
    },
  },
  {
    id: 'D7', title: 'Kommunikation & Stakeholder', isCap: false,
    questions: [
      'Die Schule kommuniziert professionell und digital mit Eltern und Ausbildungsbetrieben.',
      'Unsere Schule vernetzt sich aktiv mit anderen Schulen zu Digitalisierungsthemen.',
      'Der Kanton bzw. die Aufsichtsbehörde ist über unsere digitale Entwicklung informiert.',
    ],
    recommendations: {
      1: 'Definieren Sie klare digitale Kommunikationskanäle und schaffen Sie erste regionale Vernetzungen.',
      2: 'Entwickeln Sie eine Kommunikationsstrategie und treten Sie Bildungsnetzwerken in Ihrer Region bei.',
      3: 'Intensivieren Sie den kantonalen Dialog und positionieren Sie Ihre Schule als aktive Netzwerkpartnerin.',
      4: 'Ihre Vernetzung ist ausgezeichnet. Übernehmen Sie eine aktive Rolle in kantonalen Initiativen.',
    },
  },
  {
    id: 'D8', title: 'Schulkultur & Change-Bereitschaft', isCap: false,
    questions: [
      'Das Kollegium ist mehrheitlich offen für digitale Neuerungen und Experimente.',
      'Eine konstruktive Fehlerkultur beim Ausprobieren neuer digitaler Ansätze ist etabliert.',
      'Die Schulleitung lebt digitale Veränderungsbereitschaft aktiv vor.',
    ],
    recommendations: {
      1: 'Schaffen Sie sichere Räume für Experimente. Feiern Sie Lernmomente öffentlich, nicht nur Erfolge.',
      2: 'Setzen Sie gezielt Changemanagement-Ansätze ein: kleine Piloten, sichtbare Quick Wins.',
      3: 'Stärken Sie die Innovationskultur durch regelmässige Reflexionsformate und kollegiale Anerkennung.',
      4: 'Ihre Schulkultur ist vorbildlich offen. Teilen Sie diese Erfahrungen auf kantonaler Ebene.',
    },
  },
  // ─── D9 NEU: Prüfungskultur & KI im Leistungsnachweis ───────────────────────
  // Bewusst NICHT als Cap-Dimension: Schwächen hier sind ein Inhaltsproblem,
  // nicht ein rechtliches/strukturelles Fundament wie Governance oder Datenschutz.
  // Falls du das schärfer setzen willst: isCap auf true setzen.
  {
    id: 'D9', title: 'Prüfungskultur & KI im Leistungsnachweis', isCap: false,
    questions: [
      'Unsere Prüfungsformate sind bewusst auf das KI-Zeitalter ausgerichtet (z.B. mündliche Verteidigung, Open-Book, kompetenzorientierte Anwendungsaufgaben).',
      'Es gibt klare, schulweit kommunizierte Regeln für den KI-Einsatz bei Lernkontrollen und Prüfungen.',
      'Lehrpersonen werden bei der Weiterentwicklung ihrer Prüfungspraxis aktiv begleitet und unterstützt.',
    ],
    recommendations: {
      1: 'Starten Sie mit einer offenen Bestandsaufnahme: Welche Prüfungsformate sind KI-resistent, welche nicht mehr? Eine moderierte Schulleitungs- oder Steuergruppensitzung zur Prüfungskultur ist der Einstieg.',
      2: 'Erarbeiten Sie verbindliche Regeln zum KI-Einsatz in Prüfungen und begleiten Sie 2–3 Pilot-Fachgruppen bei der Neugestaltung ihrer Prüfungsformate. Halten Sie die Erfahrungen schriftlich fest.',
      3: 'Verankern Sie die neue Prüfungskultur schulweit. Stellen Sie Konsistenz zwischen Bewertungsrastern, Kompetenzorientierung und Lernzielen sicher. Schulen Sie das Kollegium gezielt.',
      4: 'Ihre Prüfungskultur ist vorbildlich. Dokumentieren Sie Ihre Ansätze, teilen Sie diese mit anderen Schulen und treiben Sie die fachliche Diskussion auf kantonaler/nationaler Ebene voran.',
    },
  },
]

// ─────────────────────────────────────────────
//  Helper functions
// ─────────────────────────────────────────────
export function answerKey(dimIdx: number, qIdx: number): string {
  return `${dimIdx}_${qIdx}`
}

export function getDimScore(dimIdx: number, answers: Answers): number {
  const dim = DIMENSIONS[dimIdx]
  let sum = 0, count = 0
  dim.questions.forEach((_, q) => {
    const v = answers[answerKey(dimIdx, q)]
    if (v) { sum += v; count++ }
  })
  return count ? Math.round(sum / count) : 0
}

export function isDimComplete(dimIdx: number, answers: Answers): boolean {
  return DIMENSIONS[dimIdx].questions.every((_, q) => !!answers[answerKey(dimIdx, q)])
}

export function getOverallLevel(answers: Answers): number {
  const scores = DIMENSIONS.map((_, i) => getDimScore(i, answers))
  let level = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  // Cap: D3 (idx 2) or D4 (idx 3) ≤ 2 → max level 3
  if (scores[2] <= 2 || scores[3] <= 2) level = Math.min(level, 3)
  return Math.max(1, Math.min(4, level))
}

export function isCapTriggered(answers: Answers): boolean {
  return getDimScore(2, answers) <= 2 || getDimScore(3, answers) <= 2
}

export function getTop3Weak(answers: Answers): number[] {
  return DIMENSIONS
    .map((_, i) => ({ i, s: getDimScore(i, answers) }))
    .sort((a, b) => a.s - b.s)
    .slice(0, 3)
    .map(x => x.i)
}
