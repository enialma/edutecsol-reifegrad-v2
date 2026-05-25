"use client";

import { useState, SVGProps } from "react";
import Navbar from "./Navbar";
import LeadCaptureModal, { type LeadData } from "./LeadCaptureModal";
import { Sparkles, Download, AlertCircle, ChevronLeft, ChevronRight } from "@/app/icons";
import {
  DIMENSIONS, LEVEL_NAMES, LEVEL_COLORS, LEVEL_DESCRIPTIONS,
  getDimScore, getOverallLevel, isCapTriggered, getTop3Weak,
  COMPANY_NAME, PARTNER_NAME,
  CONTACT_PERSON, CONTACT_PHONE, CONTACT_EMAIL, CONTACT_URL,
  CALENDLY_URL, KLAUSUR_URL,
  type Answers,
} from "@/lib/assessment";

// ─── Icon Variante A ──────────────────────────────────────────────────────────
function SchulIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      {/* Gebäude */}
      <rect x="14" y="34" width="52" height="44" rx="4" fill="#123143"/>
      {/* Fenster Reihe 1 */}
      <rect x="22" y="42" width="10" height="10" rx="2" fill="#eaf0f4"/>
      <rect x="35" y="42" width="10" height="10" rx="2" fill="#eaf0f4"/>
      <rect x="48" y="42" width="10" height="10" rx="2" fill="#eaf0f4"/>
      {/* Fenster Reihe 2 */}
      <rect x="22" y="56" width="10" height="10" rx="2" fill="#eaf0f4"/>
      <rect x="35" y="56" width="10" height="10" rx="2" fill="#ba4b03"/>
      <rect x="48" y="56" width="10" height="10" rx="2" fill="#eaf0f4"/>
      {/* Eingang */}
      <rect x="32" y="66" width="16" height="12" rx="2" fill="#3f6476"/>
      {/* Dach */}
      <polygon points="10,34 40,6 70,34" fill="#3f6476"/>
      {/* Pfeil-Kreis */}
      <circle cx="64" cy="16" r="14" fill="#ba4b03"/>
      <path d="M58,10 L68,10 L68,20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="58" y1="20" x2="68" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
const SCALE = [
  { label: "Level 1", desc: "Noch nicht vorhanden – kein Ansatz erkennbar" },
  { label: "Level 2", desc: "In Planung – erste Ideen, aber noch nicht umgesetzt" },
  { label: "Level 3", desc: "Teilweise – Ansätze vorhanden, aber nicht systematisch" },
  { label: "Level 4", desc: "Etabliert – systematisch verankert und gelebte Praxis" },
];

// ─── Level result texts ───────────────────────────────────────────────────────
const LEVEL_TEXT: Record<number, { pill: string; summary: string; next: string }> = {
  1: {
    pill: "Reifegrad 1 – Einsteiger",
    summary: "Ihre Schule steht am Beginn der digitalen Transformation. Viele Bereiche sind noch nicht systematisch adressiert – das bietet grosses Gestaltungspotenzial.",
    next: "Definieren Sie 2–3 konkrete Startprojekte und benennen Sie eine verantwortliche Person für die Digitalisierung.",
  },
  2: {
    pill: "Reifegrad 2 – Entwickler",
    summary: "Erste wichtige Grundlagen sind gelegt. Sie haben begonnen, Strukturen aufzubauen – jetzt geht es darum, diese zu vertiefen und verbindlich zu verankern.",
    next: "Erstellen Sie einen Digitalisierungs-Fahrplan mit messbaren Zielen und klaren Verantwortlichkeiten.",
  },
  3: {
    pill: "Reifegrad 3 – Fortgeschritten",
    summary: "Ihre Schule hat solide Fortschritte gemacht. Viele Bereiche sind strukturiert – nun geht es darum, diese zu konsolidieren und auf das nächste Level zu heben.",
    next: "Überprüfen Sie Ihre Strategie auf Wirksamkeit und stärken Sie die schwächsten 2–3 Dimensionen gezielt.",
  },
  4: {
    pill: "Reifegrad 4 – Vorreiter",
    summary: "Ihre Schule ist ein Vorbild in der digitalen Schulführung. Die Transformation ist nachhaltig verankert – teilen Sie Ihre Erfahrungen und inspirieren Sie andere.",
    next: "Engagieren Sie sich in kantonalen Netzwerken und entwickeln Sie Ihre Schule zur Referenzinstitution.",
  },
};

// ─── Radar Chart ─────────────────────────────────────────────────────────────
function RadarChart({ scores }: { scores: number[] }) {
  const cx = 160, cy = 160, r = 115, n = DIMENSIONS.length;
  function pt(lv: number, i: number): [number, number] {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + (lv / 4) * r * Math.cos(a), cy + (lv / 4) * r * Math.sin(a)];
  }
  const rings = [1, 2, 3, 4].map(lv => {
    const d = DIMENSIONS.map((_, i) => pt(lv, i))
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") + "Z";
    return <path key={lv} d={d} fill="none" stroke="var(--border)" strokeWidth={lv === 4 ? 1 : 0.6} />;
  });
  const axes = DIMENSIONS.map((_, i) => {
    const [x, y] = pt(4, i);
    return <line key={i} x1={cx} y1={cy} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="var(--border)" strokeWidth="0.6" />;
  });
  const poly = scores.map((s, i) => pt(s, i).map(v => v.toFixed(1)).join(",")).join(" ");
  const dots = scores.map((s, i) => {
    const [x, y] = pt(s, i);
    return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="5" fill="var(--petrol)" />;
  });
  const lbls = DIMENSIONS.map((d, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2, lr = r + 24;
    const lx = (cx + lr * Math.cos(a)).toFixed(1), ly = (cy + lr * Math.sin(a)).toFixed(1);
    const anc = Math.abs(parseFloat(lx) - cx) < 4 ? "middle" : parseFloat(lx) > cx ? "start" : "end";
    return (
      <text key={i} x={lx} y={ly}
        textAnchor={anc as SVGProps<SVGTextElement>["textAnchor"]}
        dominantBaseline="middle" fontSize="10.5"
        fill="var(--ink-3)" fontFamily="var(--font-body)" fontWeight="600">
        {d.id}
      </text>
    );
  });
  return (
    <svg viewBox="0 0 320 320" width="100%" style={{ maxWidth: 300, display: "block", margin: "0 auto" }}>
      {rings}{axes}
      <polygon points={poly} fill="rgba(18,49,67,0.12)" stroke="var(--petrol)" strokeWidth="2" />
      {dots}{lbls}
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "start" | "dim" | "result";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [screen, setScreen]   = useState<Screen>("start");
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const dim    = DIMENSIONS[step];
  const isLast = step === DIMENSIONS.length - 1;
  const pct    = Math.round((step / DIMENSIONS.length) * 100);

  const stepDone = dim?.questions.every((_, qi) => !!answers[`${step}_${qi}`]);

  function setLevel(qi: number, val: number) {
    setAnswers(prev => ({ ...prev, [`${step}_${qi}`]: val }));
  }

  function goNext() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isLast) { setScreen("result"); }
    else        { setStep(s => s + 1); }
  }

  function goPrev() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (step === 0) { setScreen("start"); }
    else            { setStep(s => s - 1); }
  }

  function restart() {
    setAnswers({}); setStep(0); setScreen("start");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Lead-Modal öffnen statt direktem PDF-Download
  function onRequestPDF() {
    setLeadModalOpen(true);
  }

  // Nach erfolgreichem Lead-Capture: PDF generieren und Modal schliessen
  async function onLeadSuccess(lead: LeadData) {
    setLeadModalOpen(false);
    setPdfLoading(true);
    try {
      const { exportPDF } = await import("@/lib/pdf");
      await exportPDF(answers, { name: lead.firstName, school: lead.school });
    } finally {
      setPdfLoading(false);
    }
  }

  const scores   = DIMENSIONS.map((_, i) => getDimScore(i, answers));
  const ol       = getOverallLevel(answers);
  const govLow   = getDimScore(2, answers) <= 2;
  const riskLow  = getDimScore(3, answers) <= 2;

  // ── START ──────────────────────────────────────────────────────────────────
  if (screen === "start") return (
    <main>
      <Navbar />
      <div className="page-wrap">
        <div className="hero">
          <div className="hero-eyebrow"><SchulIcon size={14} /> Schulleitung-Modus</div>
          <h1>Strategische Schulführung<br />im digitalen Wandel</h1>
          <p>
            Reifegrad-Diagnose in 9 Dimensionen: Strategie, KI, Governance, Datenschutz,
            Infrastruktur, Personal, Kommunikation, Schulkultur und Prüfungskultur.
          </p>
        </div>

        {/* Overview tiles */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10, margin: "24px 0",
        }}>
          {DIMENSIONS.map(d => (
            <div key={d.id} style={{
              padding: "12px 14px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: "var(--white)",
              fontSize: "0.85rem",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, color: "var(--petrol)",
                background: "var(--petrol-surface)", padding: "2px 8px", borderRadius: 999,
              }}>{d.id}</span>
              <span style={{ color: "var(--ink-2)", fontSize: "0.82rem" }}>{d.title}</span>
              {d.isCap && (
                <span title="Cap-Kriterium" style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#7a4500", background: "#fef3dc", padding: "1px 7px", borderRadius: 999, fontWeight: 700 }}>
                  Cap
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="card-title">Bereit für die Diagnose?</h3>
          <p className="card-hint">
            9 Dimensionen · 3 Fragen je Dimension · Ca. 10 Minuten<br />
            Keine Datenspeicherung – alle Antworten bleiben in Ihrem Browser,
            solange Sie keine PDF anfordern.
          </p>
          <button className="btn btn-primary" onClick={() => setScreen("dim")}>
            Diagnose starten <ChevronRight size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="footer">
          <span>© {new Date().getFullYear()} {COMPANY_NAME} & {PARTNER_NAME}</span>
          <span>Anonym, sicher, ohne Tracking</span>
        </div>
      </div>
    </main>
  );

  // ── DIM ────────────────────────────────────────────────────────────────────
  if (screen === "dim") return (
    <main>
      <Navbar />
      <div className="page-wrap">

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            height: 4, background: "var(--border)", borderRadius: 999, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${pct}%`, background: "var(--petrol)",
              transition: "width 0.3s",
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 6,
            fontSize: "0.78rem", color: "var(--ink-3)",
          }}>
            <span>Dimension {step + 1} / {DIMENSIONS.length}</span>
            <span>{pct}%</span>
          </div>
        </div>

        <div className="card" style={{ borderTop: `3px solid var(--petrol)` }}>
          {/* Dim header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const,
              letterSpacing: "0.07em", color: "var(--petrol)",
              background: "var(--petrol-surface)", padding: "2px 10px", borderRadius: 999,
            }}>{dim.id}</span>
            {dim.isCap && (
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7a4500", background: "#fef3dc", padding: "2px 10px", borderRadius: 999 }}>
                Cap-Kriterium
              </span>
            )}
          </div>

          <h3 className="card-title" style={{ fontSize: "1.2rem", marginBottom: 6 }}>{dim.title}</h3>

          {dim.isCap && (
            <div className="warn-box" style={{ margin: "8px 0 18px" }}>
              <AlertCircle size={14} strokeWidth={2} />
              <span>Wert ≤ 2 in dieser Dimension begrenzt den Gesamtreifegrad auf maximal Level 3.</span>
            </div>
          )}

          {/* Questions */}
          {dim.questions.map((q, qi) => {
            const key  = `${step}_${qi}`;
            const sel  = answers[key];
            return (
              <div key={qi} style={{ marginBottom: qi < dim.questions.length - 1 ? 24 : 0 }}>
                <p className="card-hint" style={{ fontWeight: 600, color: "var(--ink-2)", marginBottom: 10, fontSize: "0.92rem" }}>
                  {qi + 1}. {q}
                </p>
                <div className="radio-group">
                  {SCALE.map((opt, si) => {
                    const val = si + 1, checked = sel === val;
                    return (
                      <label key={si} className={`radio-option${checked ? " selected" : ""}`}>
                        <input type="radio" name={key} value={val} checked={checked}
                          onChange={() => setLevel(qi, val)} />
                        <span className="radio-level-tag">{opt.label}</span>
                        <span className="radio-text">{opt.desc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="actions-row" style={{ justifyContent: "space-between" }}>
          <button className="btn btn-secondary" onClick={goPrev}>
            <ChevronLeft size={15} strokeWidth={2} /> Zurück
          </button>
          <span className="btn-note" style={{ textAlign: "center" }}>
            {DIMENSIONS.filter((_, i) => i < step && DIMENSIONS[i].questions.every((_, qi) => !!answers[`${i}_${qi}`])).length + (stepDone ? 1 : 0)} / {DIMENSIONS.length} abgeschlossen
          </span>
          <button className="btn btn-primary" onClick={goNext} disabled={!stepDone}
            style={{ background: isLast ? "var(--accent)" : undefined, borderColor: isLast ? "var(--accent)" : undefined }}>
            {isLast ? <><Sparkles size={15} strokeWidth={2} /> Auswertung</> : <>Weiter <ChevronRight size={15} strokeWidth={2} /></>}
          </button>
        </div>

      </div>
    </main>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  return (
    <main>
      <Navbar />
      <div className="page-wrap">

        <div className="hero" style={{ paddingBottom: 24 }}>
          <div className="hero-eyebrow"><Sparkles size={13} strokeWidth={2.5} /> Ihre Auswertung</div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>Reifegrad-Diagnose<br />abgeschlossen</h1>
        </div>

        {/* Result panel */}
        <div className="result-panel">
          <div className="result-header">
            <h2>Strategische Schulführung im digitalen Wandel</h2>
            <span className="result-level-pill">
              {LEVEL_TEXT[ol].pill} · Ø {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)} / 4.0
            </span>
          </div>
          <div className="result-body">
            <p className="result-summary">{LEVEL_TEXT[ol].summary}</p>
            <div className="result-next">
              <strong>Empfohlener nächster Schritt:</strong> {LEVEL_TEXT[ol].next}
            </div>

            {(govLow || riskLow) && (
              <div className="warn-box" style={{ marginBottom: 20 }}>
                <AlertCircle size={14} strokeWidth={2} />
                <span>
                  <strong>Cap-Funktion aktiv:</strong>{" "}
                  {govLow && riskLow ? "D3 und D4 sind" : govLow ? "D3 (Governance) ist" : "D4 (Datenschutz) ist"}{" "}
                  kritisch (≤ 2) – Gesamtreifegrad max. Level 3. Handeln Sie hier prioritär.
                </span>
              </div>
            )}

            {/* Radar */}
            <div style={{ margin: "20px 0" }}>
              <RadarChart scores={scores} />
            </div>

            {/* Dim table */}
            <p className="section-label">Ergebnisse nach Dimension</p>
            <div className="dim-grid" style={{ marginBottom: 20 }}>
              {DIMENSIONS.map((d, i) => {
                const s = scores[i];
                return (
                  <div key={i} className="dim-row">
                    <span>
                      <strong>{d.id}</strong> {d.title}
                      {d.isCap && <span style={{ fontSize: "0.72rem", color: "var(--ink-3)", marginLeft: 4 }}>(Cap)</span>}
                    </span>
                    <span className="dim-level" style={{ background: LEVEL_COLORS[s] + "22", color: LEVEL_COLORS[s] }}>
                      Level {s} – {LEVEL_NAMES[s]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Top-3 */}
            <p className="section-label">Top-3 Handlungsfelder</p>
            {getTop3Weak(answers).map((dimIdx, rank) => {
              const d = DIMENSIONS[dimIdx], s = scores[dimIdx];
              return (
                <div key={rank} className="result-next" style={{ marginBottom: 10 }}>
                  <strong style={{ color: LEVEL_COLORS[s] }}>{rank + 1}. {d.id} – {d.title}</strong>
                  <br />{d.recommendations[s]}
                </div>
              );
            })}

            {/* ═══════════════════════════════════════════════════════════════
                NEUE CTA-BOX: Drei abgestufte Anschluss-Optionen
                ═══════════════════════════════════════════════════════════════ */}
            <div style={{ marginTop: 28 }}>
              <p className="section-label">Drei mögliche nächste Schritte</p>

              <div style={{ display: "grid", gap: 12 }}>

                {/* Option 1: PDF (Lead-Capture) */}
                <ActionCard
                  icon="📄"
                  title="Ausführliche Auswertung als PDF"
                  desc="Mit Interpretation und Empfehlungen pro Dimension – sofort als Download und per Mail."
                  buttonText={pdfLoading ? "Wird erstellt …" : "PDF anfordern"}
                  buttonAction={onRequestPDF}
                  buttonDisabled={pdfLoading}
                  primary={true}
                />

                {/* Option 2: Calendly-Gespräch */}
                <ActionCard
                  icon="☕"
                  title="30-Minuten-Klärungsgespräch (kostenlos)"
                  desc="Wir gehen gemeinsam durch eure Ergebnisse und überlegen, was sinnvolle nächste Schritte wären – ohne Verkaufsdruck."
                  buttonText="Termin buchen"
                  buttonHref={CALENDLY_URL}
                  primary={false}
                />

                {/* Option 3: Klausurtagung */}
                <ActionCard
                  icon="🎯"
                  title="Klausurtagung 'Strategische Schulführung'"
                  desc="Ein strukturierter Arbeitstag für euer Führungsteam – aufbauend auf eurer Diagnose. Mit mitPlan & EDUTECSOL."
                  buttonText="Mehr erfahren"
                  buttonHref={KLAUSUR_URL}
                  primary={false}
                />

              </div>

              {/* Kontakt-Footer */}
              <div style={{
                marginTop: 20, padding: "14px 18px",
                background: "var(--chalk)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                fontSize: "0.85rem", color: "var(--ink-2)", lineHeight: 1.5,
              }}>
                <strong>Kontakt:</strong> {CONTACT_PERSON} · {COMPANY_NAME}<br />
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--petrol)" }}>{CONTACT_EMAIL}</a> · {CONTACT_PHONE}
              </div>

              <button onClick={restart} className="btn btn-secondary" style={{ marginTop: 14 }}>
                Diagnose zurücksetzen
              </button>
            </div>

          </div>
        </div>

        <div className="footer">
          <span>© {new Date().getFullYear()} {COMPANY_NAME} & {PARTNER_NAME}</span>
          <span>Anonyme Antworten · Mailadresse nur bei PDF-Anforderung</span>
        </div>
      </div>

      {/* Lead-Capture Modal */}
      <LeadCaptureModal
        open={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSuccess={onLeadSuccess}
        overallLevel={ol}
      />
    </main>
  );
}

// ─── ActionCard Component ────────────────────────────────────────────────────
function ActionCard({
  icon, title, desc, buttonText, buttonAction, buttonHref, buttonDisabled, primary,
}: {
  icon: string;
  title: string;
  desc: string;
  buttonText: string;
  buttonAction?: () => void;
  buttonHref?: string;
  buttonDisabled?: boolean;
  primary?: boolean;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 16, alignItems: "center",
      padding: "16px 18px",
      background: primary ? "var(--petrol-surface)" : "var(--white)",
      border: `1px solid ${primary ? "var(--petrol)" : "var(--border)"}`,
      borderRadius: "var(--radius-md)",
    }}>
      <div style={{ fontSize: "1.6rem", lineHeight: 1 }}>{icon}</div>
      <div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem", fontWeight: 600,
          color: "var(--ink)", marginBottom: 3,
        }}>{title}</div>
        <div style={{ fontSize: "0.84rem", color: "var(--ink-3)", lineHeight: 1.45 }}>
          {desc}
        </div>
      </div>
      <div>
        {buttonHref ? (
          <a
            href={buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            className={primary ? "btn btn-primary" : "btn btn-secondary"}
          >
            {buttonText}
          </a>
        ) : (
          <button
            onClick={buttonAction}
            disabled={buttonDisabled}
            className={primary ? "btn btn-primary" : "btn btn-secondary"}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
