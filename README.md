# EDUTECSOL Reifegrad-Diagnose v2

Interaktives Diagnose-Tool für Schulleitungen und Führungsteams:
**Strategische Schulführung im digitalen Wandel**

## Was ist neu in v2

- **9 statt 8 Dimensionen** – D9 "Prüfungskultur & KI im Leistungsnachweis" hinzugefügt
- **Lead-Capture-Modal** vor PDF-Download (Mail, Schule, Funktion)
- **Brevo-Integration** für automatische Mailingliste und Bestätigungsmail
- **Neue CTA-Box** mit drei abgestuften Anschluss-Optionen (PDF / Gespräch / Klausurtagung)
- **Enikö Parrag** als primäre Kontaktperson (EDUTECSOL als Eingang für Schulen)

Siehe `SETUP.md` für die vollständige Änderungsliste.

## Features

- 9 Dimensionen, je 3 Fragen (27 Fragen total)
- 4-stufige Skala (Noch nicht → Etabliert)
- Cap-Funktion: D3 oder D4 ≤ 2 → Gesamtreifegrad max. Level 3
- Sofort-Auswertung mit SVG-Radar-Chart
- Empfehlungen pro Dimension & Level
- PDF-Export (mehrseitig, personalisiert)
- Lead-Capture mit Brevo-Anbindung (optional – funktioniert auch ohne)
- Datenschutz: Antworten anonym im Browser bis zur freiwilligen Mail-Eingabe

## Lokales Testen (ohne Brevo-Setup)

```bash
npm install
npm run dev
# → http://localhost:3000
```

Du kannst sofort durchklicken. Ohne `.env.local` werden Leads nur in der Konsole
geloggt, keine Mails versendet – ideal zum Funktions-Test.

## Mit Brevo testen

1. `cp .env.local.example .env.local`
2. Werte in `.env.local` einsetzen (Brevo API-Key, Listen-ID, etc.)
3. `npm run dev` neu starten

## Deployment auf Vercel (als Test-Site parallel zur bestehenden)

```bash
git init
git add .
git commit -m "v2: D9 Prüfungskultur, Lead-Capture, neue CTA"
git remote add origin https://github.com/DEIN-REPO-v2.git
git push -u origin main
```

Dann auf Vercel:
1. Neues Projekt anlegen
2. Repository auswählen
3. Environment Variables einsetzen (Settings → Environment Variables)
4. Deploy

→ Du erhältst eine URL wie `reifegrad-v2.vercel.app` zum Testen.
Die bestehende Seite bleibt unverändert.

## Anpassungen vor Live-Gang

In `lib/assessment.ts` die TODO-Platzhalter ersetzen:

```ts
export const CONTACT_URL    = 'https://www.edutecsol.ch/kontakt'    // TODO
export const CONTACT_PHONE  = '+41 XX XXX XX XX'                    // TODO
export const CONTACT_EMAIL  = 'enikoe.parrag@edutecsol.ch'          // TODO
export const CALENDLY_URL   = 'https://calendly.com/edutecsol/30min' // TODO
```

## Tech-Stack
- Next.js 14 (App Router)
- TypeScript
- jsPDF (PDF-Export, client-seitig)
- Brevo API (Lead-Capture, transaktionale Mails)

## Projektstruktur

```
edutecsol-reifegrad-v2/
├── app/
│   ├── api/lead/route.ts        ← API-Endpoint für Lead-Capture
│   ├── LeadCaptureModal.tsx     ← Modal vor PDF-Download
│   ├── Navbar.tsx               ← (unverändert)
│   ├── globals.css              ← (unverändert)
│   ├── icons.tsx                ← (unverändert)
│   ├── layout.tsx               ← (unverändert)
│   └── page.tsx                 ← Hauptseite (mit neuer CTA-Box)
├── lib/
│   ├── assessment.ts            ← 9 Dimensionen, Fragen, Empfehlungen
│   └── pdf.ts                   ← PDF-Generierung
├── public/                      ← Logos
├── .env.local.example           ← Vorlage für Environment Variables
├── SETUP.md                     ← Detaillierte Setup-Anleitung
└── package.json
```

## Versionshistorie

| Version | Was                                                                  |
|---------|----------------------------------------------------------------------|
| v1.0    | Launch: 8 Dimensionen, Radar, PDF, Cap-Logik                         |
| v2.0    | D9 Prüfungskultur, Lead-Capture, Brevo, neue CTA-Box, Enikö als Lead |
