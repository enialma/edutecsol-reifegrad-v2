"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  LeadCaptureModal
//  Wird vor dem PDF-Download geöffnet. Sammelt Mailadresse, Schule, Funktion.
//  Sendet die Daten an /api/lead. Bei Erfolg wird onSuccess() aufgerufen,
//  was den eigentlichen PDF-Download auslöst.
// ─────────────────────────────────────────────────────────────────────────────

export interface LeadData {
  firstName: string;
  email: string;
  school: string;
  role: string;
  consentFollowUp: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (lead: LeadData) => void;   // wird aufgerufen nach erfolgreicher API-Antwort
  overallLevel: number;                   // für Kontext in der Mail
}

export default function LeadCaptureModal({ open, onClose, onSuccess, overallLevel }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState("");
  const [consentFollowUp, setConsentFollowUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // Escape-Taste schliesst Modal
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  function validEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !email.trim() || !school.trim() || !role.trim()) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    if (!validEmail(email)) {
      setError("Bitte eine gültige Mailadresse eingeben.");
      return;
    }

    setSubmitting(true);
    const lead: LeadData = { firstName, email, school, role, consentFollowUp };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, overallLevel }),
      });

      if (!res.ok) {
        // Auch bei API-Fehler den PDF-Download trotzdem erlauben –
        // wir wollen das User-Erlebnis nicht blockieren.
        console.error("Lead-API Fehler:", await res.text());
      }
      onSuccess(lead);
    } catch (err) {
      console.error(err);
      // Fallback: PDF trotzdem ausliefern, Lead lokal mitloggen
      onSuccess(lead);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(18,49,67,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          maxWidth: 520, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          padding: "28px 28px 24px",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            color: "var(--ink)",
            marginBottom: 6,
          }}>
            Ausführliche PDF-Auswertung
          </h2>
          <p style={{ fontSize: "0.92rem", color: "var(--ink-3)", lineHeight: 1.5 }}>
            Wir senden Ihnen die PDF mit Interpretation pro Dimension und konkreten Handlungsempfehlungen –
            sofort als Download und zusätzlich per Mail.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Vorname" value={firstName} onChange={setFirstName} placeholder="Anna" />
            <Field label="Mailadresse" value={email} onChange={setEmail} placeholder="anna.muster@meineschule.ch" type="email" />
            <Field label="Schule" value={school} onChange={setSchool} placeholder="Berufsfachschule Beispiel" />
            <Field label="Funktion" value={role} onChange={setRole} placeholder="Schulleitung" />
          </div>

          <label style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            marginTop: 18, fontSize: "0.85rem", color: "var(--ink-2)",
            lineHeight: 1.45, cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={consentFollowUp}
              onChange={e => setConsentFollowUp(e.target.checked)}
              style={{ marginTop: 3, accentColor: "var(--petrol)", flexShrink: 0 }}
            />
            <span>
              Gerne kontaktieren Sie mich in den nächsten Tagen.
              <em style={{ display: "block", marginTop: 4, color: "var(--ink-3)", fontStyle: "normal", fontSize: "0.78rem" }}>
                Optional. Ohne Häkchen erhalten Sie nur die PDF, keine weitere Kontaktaufnahme.
              </em>
            </span>
          </label>

          {error && (
            <div style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "var(--red-bg)",
              border: "1px solid var(--red-border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--red-border)",
              fontSize: "0.85rem",
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: "flex", justifyContent: "space-between", gap: 10,
            marginTop: 22, flexWrap: "wrap" as const,
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sende ..." : "PDF anfordern →"}
            </button>
          </div>

          <p style={{
            marginTop: 16, fontSize: "0.75rem", color: "var(--ink-3)", lineHeight: 1.4,
          }}>
            Ihre Daten werden ausschliesslich für den PDF-Versand und – falls oben angekreuzt –
            für eine einmalige Kontaktaufnahme verwendet. Keine Newsletter, keine Werbung,
            keine Weitergabe an Dritte. Datenschutz nach revDSG.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Field component ─────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{
        display: "block", marginBottom: 5,
        fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-2)",
      }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: "0.92rem",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--white)",
          color: "var(--ink)",
          fontFamily: "var(--font-body)",
          outline: "none",
          transition: "border-color 0.18s",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "var(--petrol)"}
        onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
      />
    </label>
  );
}
