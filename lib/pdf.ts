import type { Answers } from './assessment'
import {
  DIMENSIONS, LEVEL_NAMES, LEVEL_DESCRIPTIONS, LEVEL_COLORS,
  getDimScore, getOverallLevel, isCapTriggered, getTop3Weak,
  COMPANY_NAME, ASSESSMENT_TITLE,
  CONTACT_PERSON, CONTACT_PHONE, CONTACT_EMAIL,
  PARTNER_NAME,
} from './assessment'

const RED:      [number,number,number] = [18, 49, 67]    // EDUTECSOL petrol #123143
const RED_LIGHT:[number,number,number] = [232, 237, 240]
const ACCENT:   [number,number,number] = [186, 75, 3]    // copper #ba4b03
const GREY_D:   [number,number,number] = [40,  50,  55]
const GREY_M:   [number,number,number] = [110, 120, 128]
const GREY_L:   [number,number,number] = [246, 247, 248]
const WHITE:    [number,number,number] = [255, 255, 255]

function radarPng(scores: number[]): string {
  const sz = 500, cx = 250, cy = 250, r = 170
  const n = DIMENSIONS.length              // ← dynamisch statt hardcoded 8
  const cv = document.createElement('canvas')
  cv.width = sz; cv.height = sz
  const c = cv.getContext('2d')!
  function pt(lv: number, i: number): [number, number] {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    return [cx + (lv / 4) * r * Math.cos(a), cy + (lv / 4) * r * Math.sin(a)]
  }
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, sz, sz)
  ;[1, 2, 3, 4].forEach(lv => {
    c.strokeStyle = lv === 4 ? '#c0c8d0' : '#e4e8ec'
    c.lineWidth = lv === 4 ? 1.2 : 0.7
    c.beginPath()
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(lv, i); i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)
    }
    c.closePath(); c.stroke()
  })
  c.strokeStyle = '#e4e8ec'; c.lineWidth = 0.7
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(4, i)
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke()
  }
  c.fillStyle = 'rgba(18,49,67,0.12)'
  c.strokeStyle = '#3f6476'; c.lineWidth = 2.5
  c.beginPath()
  scores.forEach((s, i) => {
    const [x, y] = pt(s || 0, i); i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)
  })
  c.closePath(); c.fill(); c.stroke()
  c.fillStyle = '#123143'
  scores.forEach((s, i) => {
    const [x, y] = pt(s || 0, i)
    c.beginPath(); c.arc(x, y, 7, 0, 2 * Math.PI); c.fill()
  })
  const lr = r + 36
  c.fillStyle = '#606870'; c.font = 'bold 15px Arial'
  c.textAlign = 'center'; c.textBaseline = 'middle'
  DIMENSIONS.forEach((d, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    c.fillText(d.id, cx + lr * Math.cos(a), cy + lr * Math.sin(a))
  })
  return cv.toDataURL('image/png')
}

function h2r(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

export async function exportPDF(answers: Answers, leadInfo?: { name?: string; school?: string }): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pw = 210, ph = 297, mg = 18, cw = pw - 2 * mg

  type Align = 'left' | 'center' | 'right'
  function t(text: string, x: number, y: number,
    sz = 10, col: [number,number,number] = GREY_D,
    bold = false, align: Align = 'left') {
    doc.setFontSize(sz); doc.setTextColor(...col)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.text(text, x, y, { align })
  }

  function pill(label: string, x: number, y: number, w: number, h: number,
    bgHex: string, fg: [number,number,number] = WHITE) {
    doc.setFillColor(...h2r(bgHex))
    doc.roundedRect(x, y, w, h, 1.5, 1.5, 'F')
    t(label, x + w / 2, y + h * 0.68, 8, fg, true, 'center')
  }

  const BOTTOM = ph - 14

  function pageHeader(right: string) {
    doc.setFillColor(...RED); doc.rect(0, 0, pw, 15, 'F')
    t(`${COMPANY_NAME}  &  ${PARTNER_NAME}`, mg, 10, 9, WHITE, true)
    t(right, pw - mg, 10, 8, [160, 190, 205], false, 'right')
  }

  function newPage(label: string): number {
    doc.addPage(); pageHeader(label); return 24
  }

  // PAGE 1 - Uebersicht + Radar + Dimensionstabelle
  pageHeader('Reifegrad-Diagnose')
  let y = 24

  t('Strategische Schulführung im digitalen Wandel', mg, y, 14, RED, true); y += 6
  // Personalisierung wenn leadInfo vorhanden
  if (leadInfo?.school) {
    t(`Auswertung für: ${leadInfo.school}`, mg, y, 9, GREY_M); y += 4
  }
  t(new Date().toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }), mg, y, 8.5, GREY_M); y += 12

  const ol = getOverallLevel(answers)
  doc.setFillColor(...h2r(LEVEL_COLORS[ol]))
  doc.roundedRect(mg, y, 50, 22, 3, 3, 'F')
  t('Reifegrad', mg + 25, y + 7.5, 7.5, WHITE, false, 'center')
  t(`${ol}  ${LEVEL_NAMES[ol]}`, mg + 25, y + 16, 10.5, WHITE, true, 'center')
  doc.setFontSize(8.5); doc.setTextColor(...GREY_M); doc.setFont('helvetica', 'normal')
  const dl = doc.splitTextToSize(LEVEL_DESCRIPTIONS[ol], cw - 56)
  doc.text(dl, mg + 55, y + 7); y += 30

  if (isCapTriggered(answers)) {
    doc.setFillColor(...RED_LIGHT); doc.rect(mg, y, cw, 8, 'F')
    doc.setFillColor(...RED); doc.rect(mg, y, 2.5, 8, 'F')
    t('Cap aktiv: D3 oder D4 = 1-2  -->  Gesamtreifegrad max. Level 3.', mg + 6, y + 5.5, 8, [18, 49, 67])
    y += 12
  }

  const scores = DIMENSIONS.map((_, i) => getDimScore(i, answers))
  const csz = 70
  doc.addImage(radarPng(scores), 'PNG', (pw - csz) / 2, y, csz, csz)
  y += csz + 9

  t('Ergebnisse nach Dimension', mg, y, 10.5, RED, true); y += 6
  doc.setFillColor(230, 236, 240); doc.rect(mg, y, cw, 6, 'F')
  t('Dimension', mg + 3, y + 4.2, 7.5, GREY_M)
  t('Level', pw - mg - 16, y + 4.2, 7.5, GREY_M, false, 'center')
  y += 6

  DIMENSIONS.forEach((dim, i) => {
    if (y > BOTTOM - 8) { y = newPage('Reifegrad-Diagnose') }
    const s = getDimScore(i, answers)
    if (i % 2 === 0) { doc.setFillColor(...GREY_L); doc.rect(mg, y, cw, 7, 'F') }
    const cap = dim.isCap ? ' (Cap)' : ''
    t(`${dim.id}  ${dim.title}${cap}`, mg + 3, y + 4.8, 8.5, GREY_D)
    pill(String(s), pw - mg - 23, y + 1.3, 8, 5, LEVEL_COLORS[s])
    t(LEVEL_NAMES[s], pw - mg - 24, y + 4.8, 7.5, GREY_M, false, 'right')
    y += 7
  })

  // PAGE 2 – Top-3 Handlungsfelder
  y = newPage('Top-3 Handlungsfelder')
  t('Ihre Top-3 Handlungsfelder', mg, y, 13, RED, true); y += 6
  t('Die drei Dimensionen mit dem groessten Entwicklungsbedarf und konkrete Massnahmen:', mg, y, 9, GREY_M); y += 11

  getTop3Weak(answers).forEach((dimIdx, rank) => {
    const dim = DIMENSIONS[dimIdx]
    const s = getDimScore(dimIdx, answers)
    const cap = dim.isCap ? ' (Cap)' : ''
    const recLines = doc.splitTextToSize(dim.recommendations[s], cw - 12)
    const cardH = 25 + recLines.length * 5
    if (y + cardH > BOTTOM - 10) { y = newPage('Top-3 Handlungsfelder') }
    doc.setFillColor(...GREY_L); doc.setDrawColor(210, 218, 224); doc.setLineWidth(0.3)
    doc.roundedRect(mg, y, cw, cardH, 3, 3, 'FD')
    doc.setFillColor(...RED); doc.roundedRect(mg, y, 3, cardH, 1.5, 1.5, 'F')
    doc.setFillColor(...h2r(LEVEL_COLORS[s])); doc.circle(mg + 13, y + 8.5, 5.5, 'F')
    t(String(rank + 1), mg + 13, y + 10, 10.5, WHITE, true, 'center')
    t(`${dim.id} - ${dim.title}${cap}`, mg + 22, y + 8.5, 10.5, RED, true)
    pill(`Level ${s}: ${LEVEL_NAMES[s]}`, mg + 22, y + 13, 40, 5.5, LEVEL_COLORS[s])
    doc.setFontSize(9); doc.setTextColor(...GREY_D); doc.setFont('helvetica', 'normal')
    doc.text(recLines, mg + 6, y + 24)
    y += cardH + 8
  })

  // PAGE 3 – Alle Empfehlungen
  y = newPage('Empfehlungen')
  t('Empfehlungen nach Dimension', mg, y, 13, RED, true); y += 6
  t('Konkrete Massnahmen je Dimension basierend auf Ihrem Ergebnis:', mg, y, 9, GREY_M); y += 11

  DIMENSIONS.forEach((dim, i) => {
    const s = getDimScore(i, answers)
    const recLines = doc.splitTextToSize(dim.recommendations[s], cw - 52)
    const rowH = Math.max(12, recLines.length * 4.8 + 5)
    if (y + rowH > BOTTOM - 8) { y = newPage('Empfehlungen') }
    if (i % 2 === 0) { doc.setFillColor(...GREY_L); doc.rect(mg, y, cw, rowH, 'F') }
    const cap = dim.isCap ? '*' : ''
    t(`${dim.id}${cap}`, mg + 3, y + rowH / 2 + 1.5, 8, RED, true)
    pill(String(s), mg + 15, y + (rowH - 5) / 2, 8, 5, LEVEL_COLORS[s])
    doc.setFontSize(8); doc.setTextColor(...GREY_D); doc.setFont('helvetica', 'normal')
    doc.text(recLines, mg + 27, y + 4.5)
    y += rowH
  })
  y += 6

  // CTA
  if (y + 36 > BOTTOM) { y = newPage('Kontakt') }
  doc.setFillColor(...RED)
  doc.roundedRect(mg, y, cw, 36, 3, 3, 'F')
  t('Naechste Schritte planen?', pw / 2, y + 9, 12, WHITE, true, 'center')
  t('Fuer eine unverbindliche Beratung:', pw / 2, y + 17, 8.5, [160, 190, 205], false, 'center')
  t(CONTACT_PERSON, pw / 2, y + 25, 10.5, WHITE, true, 'center')
  t(`${CONTACT_PHONE}  |  ${CONTACT_EMAIL}`, pw / 2, y + 32, 8.5, [160, 190, 205], false, 'center')

  // Footer on all pages
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFillColor(...GREY_L); doc.rect(0, ph - 10, pw, 10, 'F')
    doc.setFontSize(7); doc.setTextColor(...GREY_M)
    doc.text(
      `(c) ${new Date().getFullYear()} ${COMPANY_NAME} & ${PARTNER_NAME}  |  edutecsol.ch  |  Seite ${p} / ${total}`,
      pw / 2, ph - 3.5, { align: 'center' }
    )
  }
  // Personalisierter Dateiname
  const filename = leadInfo?.school
    ? `Reifegrad-Diagnose-${leadInfo.school.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    : 'Reifegrad-Diagnose.pdf'
  doc.save(filename)
}
