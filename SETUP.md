# EDUTECSOL Reifegrad-Diagnose · Update v2

## Was sich geändert hat

### 1. Inhaltlich
- **Neue 9. Dimension: D9 Prüfungskultur & KI im Leistungsnachweis**
  - 3 neue Fragen zu Prüfungsformaten, Regeln und Lehrpersonen-Begleitung
  - 4 ausgearbeitete Empfehlungen pro Level
  - Bewusst NICHT als Cap-Dimension – Begründung siehe Code-Kommentar
- **D1, D3, D4, D5 minimal geschärft** – Fragen weniger suggestiv, näher an Führungsrealität
- **D2 umbenannt** zu "KI im Lehren und Lernen" (weil D9 die KI-Prüfungs-Frage übernimmt)
- **Kontaktdaten umgestellt** auf Enikö / EDUTECSOL als primäre Ansprechperson

### 2. Lead-Capture-Mechanik
- **Neues Modal** vor PDF-Download (`LeadCaptureModal.tsx`)
- **Felder**: Vorname, Mail, Schule, Funktion
- **Optionale Checkbox** für Follow-up-Erlaubnis
- **API-Route** `/api/lead` für Brevo-Integration (Mailchimp-Variante kommentiert)
- **Bestätigungsmail** wird automatisch versendet mit Calendly-Link

### 3. Neue CTA-Box auf der Result-Seite
- Drei abgestufte Anschluss-Optionen:
  1. PDF anfordern (öffnet Modal) – primärer CTA
  2. 30-Minuten-Gespräch buchen (Calendly)
  3. Klausurtagung erfahren (Link zu mitPlan-Seite)

### 4. Kleine Verbesserungen
- Radar in `pdf.ts` ist jetzt dynamisch (`n = DIMENSIONS.length` statt hardcoded `8`)
- PDF-Dateiname enthält Schulname (wenn vorhanden)
- PDF enthält Personalisierung mit Schulname auf Seite 1

---

## Datei-Mapping (was wohin)

| Neue Datei                          | Ersetzt / Ergänzt                          |
| ----------------------------------- | ------------------------------------------ |
| `lib/assessment.ts`                 | **ersetzt** `/lib/assessment.ts`           |
| `lib/pdf.ts`                        | **ersetzt** `/lib/pdf.ts`                  |
| `app/page.tsx`                      | **ersetzt** `/app/page.tsx`                |
| `app/LeadCaptureModal.tsx`          | **NEU** in `/app/`                         |
| `app/api/lead/route.ts`             | **NEU** in `/app/api/lead/`                |

---

## Setup-Schritte

### Schritt 1: Dateien einsetzen
Kopiere die Dateien aus `edutecsol-updates/` an die entsprechenden Stellen in deinem Repo.

### Schritt 2: Kontaktdaten anpassen
Öffne `lib/assessment.ts` und ersetze die TODO-Platzhalter:

```ts
export const CONTACT_URL    = 'https://www.edutecsol.ch/kontakt'    // TODO
export const CONTACT_PHONE  = '+41 XX XXX XX XX'                    // TODO
export const CONTACT_EMAIL  = 'enikoe.parrag@edutecsol.ch'          // TODO
export const CALENDLY_URL   = 'https://calendly.com/edutecsol/30min' // TODO
```

### Schritt 3: Brevo einrichten
1. Brevo-Account → API Keys → neuen Key erstellen
2. Eine Liste anlegen (z.B. "Diagnose-Leads") → ID notieren
3. `.env.local` im Projekt-Root erstellen:

```bash
BREVO_API_KEY=xkeysib-deine-key-hier
BREVO_LIST_ID=5
BREVO_FROM_EMAIL=enikoe.parrag@edutecsol.ch
BREVO_FROM_NAME=Enikö Parrag
CALENDLY_URL=https://calendly.com/edutecsol/30min
```

4. Auf Vercel: gleichen Env-Vars im Dashboard hinterlegen (Project Settings → Environment Variables)

**Hinweis**: Wenn die Env-Vars fehlen, läuft das Tool im "dev-log"-Modus – Leads werden in der Server-Konsole geloggt, aber nichts wird gesendet. Das ist nützlich zum Testen ohne Brevo-Setup.

### Schritt 4: Mail-Sender verifizieren (Brevo)
In Brevo unter "Senders & IPs" die Absender-Mail verifizieren – sonst werden Mails als Spam markiert.

### Schritt 5: Calendly einrichten
- Calendly-Account → 30-Min-Event-Typ anlegen
- Link in `.env.local` und in `assessment.ts` eintragen

### Schritt 6: Testen
```bash
npm install      # falls neue Dependencies (keine, eigentlich)
npm run dev      # → http://localhost:3000
```

1. Diagnose komplett durchklicken
2. Auf "PDF anfordern" klicken → Modal sollte öffnen
3. Test-Mail eintragen → "PDF anfordern"
4. PDF sollte herunterladen, Test-Mail sollte in Brevo-Liste erscheinen, Bestätigungsmail kommt an

### Schritt 7: Deployen
```bash
git add .
git commit -m "Add D9 Prüfungskultur, lead capture, restructured CTA"
git push
```
Vercel deployt automatisch.

---

## Was du noch anpassen solltest

### Anpassung 1: Mailchimp statt Brevo (optional)
Falls du Mailchimp bevorzugst, siehe Kommentar am Ende von `app/api/lead/route.ts`.
Du musst dann zusätzlich Mailchimp Transactional (Mandrill) für die Bestätigungsmail
einrichten – Brevo hat das alles in einem Tool.

### Anpassung 2: Cap für D9 aktivieren (optional)
Wenn du Prüfungskultur als kritisches Fundament markieren willst:
In `lib/assessment.ts`, Zeile mit D9: `isCap: false` → `isCap: true`
Und die Cap-Logik in `getOverallLevel` erweitern:
```ts
if (scores[2] <= 2 || scores[3] <= 2 || scores[8] <= 2) level = Math.min(level, 3)
```

### Anpassung 3: PDF-Empfehlungen vertiefen
Die aktuellen Empfehlungen in `assessment.ts` sind solide, aber teilweise generisch.
Wenn du Zeit hast: erweitere jede Empfehlung um eine **konkrete erste Massnahme**
für die nächsten 30 Tage. Beispiel siehe Chat-Verlauf.

### Anpassung 4: Team-Modus
Aktuell füllt eine Person aus. Erweiterung: mehrere Personen füllen mit gleicher
Team-Code-Sequenz aus → gemeinsame Auswertung mit Streuungsanalyse.
Das wäre der grösste Verkaufs-Hebel für die Klausurtagung, weil es die Diskrepanz
im Führungsteam sichtbar macht. Aber: separate Entwicklung, nicht in diesem Update.

---

## Bekannte Trade-offs

1. **PDF wird sofort heruntergeladen UND per Mail versendet** – aktuell wird die PDF
   nur client-seitig generiert (jsPDF). Die Bestätigungsmail enthält den Calendly-Link,
   aber NICHT das PDF als Anhang. Wenn du das willst: PDF als Base64 client-seitig
   generieren, an `/api/lead` mitsenden, Brevo-Transactional mit Anhang.

2. **Anonymität bis zur PDF-Anforderung** ist real – Antworten landen erst beim
   PDF-Klick auf dem Server. Vorher: nur im Browser.

3. **Bei Brevo-Ausfall** wird der PDF-Download trotzdem ausgeführt (graceful degradation).
   Der Lead wird in dem Fall in der Server-Konsole geloggt. Achte auf Vercel-Logs in
   den ersten Wochen.

4. **DSG-Compliance**: Die Lösung sollte konform sein (revDSG ab Sept. 2023). Trotzdem:
   ein Anwalt darf draufgucken, wenn du auf Nummer sicher gehen willst.

---

## Nächste sinnvolle Schritte

1. **Diese Woche**: Dateien einbauen, Brevo-Setup, deployen, selbst durchtesten
2. **In 2 Wochen**: Mahara-hui-Nachfass-Mail versenden mit Link auf die neue Diagnose
3. **In 4 Wochen**: Erste Ergebnisse anschauen – Konversionsraten, Drop-offs, was funktioniert
4. **In 8 Wochen**: Auswertung erweitern wenn nötig, Team-Modus prototypen

Viel Erfolg!
