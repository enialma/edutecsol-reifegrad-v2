import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/lead
//  Empfängt Lead-Daten aus dem Modal und legt sie in Brevo (oder Mailchimp) ab.
//  Sendet optional sofort eine Bestätigungsmail mit Calendly-Link.
//
//  Environment-Variablen (.env.local):
//    BREVO_API_KEY       = "xkeysib-..."
//    BREVO_LIST_ID       = "5"                  (numerisch, aus Brevo-Dashboard)
//    BREVO_FROM_EMAIL    = "enikoe.parrag@edutecsol.ch"
//    BREVO_FROM_NAME     = "Enikö Parrag"
//    CALENDLY_URL        = "https://calendly.com/edutecsol/30min"
//
//  Für Mailchimp: siehe Kommentar weiter unten.
// ─────────────────────────────────────────────────────────────────────────────

interface LeadPayload {
  firstName: string;
  email: string;
  school: string;
  role: string;
  consentFollowUp: boolean;
  overallLevel: number;
}

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Minimale Validierung
  if (!body.email || !body.firstName || !body.school || !body.role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  const fromEmail = process.env.BREVO_FROM_EMAIL || "enikoe.parrag@edutecsol.ch";
  const fromName = process.env.BREVO_FROM_NAME || "Enikö Parrag";
  const calendlyUrl = process.env.CALENDLY_URL || "https://calendly.com/edutecsol/30min";

  if (!apiKey || !listId) {
    // Im Dev-Modus: nur loggen, nicht failen
    console.warn("BREVO_API_KEY oder BREVO_LIST_ID fehlt – Lead nur geloggt:", body);
    return NextResponse.json({ ok: true, mode: "dev-log" });
  }

  try {
    // ─── 1. Contact in Brevo anlegen / aktualisieren ──────────────────────────
    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        attributes: {
          FIRSTNAME: body.firstName,
          SCHULE: body.school,
          FUNKTION: body.role,
          REIFEGRAD: body.overallLevel,
          CONSENT_FOLLOWUP: body.consentFollowUp,
          DIAGNOSE_DATUM: new Date().toISOString().slice(0, 10),
        },
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const text = await contactRes.text();
      console.error("Brevo Contact-Fehler:", contactRes.status, text);
      // Trotzdem ok zurückgeben – User soll PDF bekommen
    }

    // ─── 2. Transaktionsmail mit Bestätigung + Calendly-Link ──────────────────
    const followUpLine = body.consentFollowUp
      ? "Ich melde mich in den nächsten 14 Tagen kurz bei Ihnen. Falls Sie zwischendurch sprechen möchten, können Sie auch direkt einen Termin buchen:"
      : "Wenn Sie über die Auswertung sprechen möchten – ohne Verkaufsdruck – können Sie hier einen 30-Minuten-Termin buchen:";

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #1e3a4a; max-width: 560px; line-height: 1.55;">
        <h2 style="color: #123143; font-size: 20px; margin-bottom: 12px;">
          Eure Reifegrad-Diagnose
        </h2>
        <p>Liebe/r ${escapeHtml(body.firstName)}</p>
        <p>
          danke, dass ihr euch die Zeit für die Diagnose genommen habt.
          Im Anhang oder als Download findet ihr die ausführliche PDF-Auswertung
          mit Interpretation und Handlungsempfehlungen pro Dimension.
        </p>
        <p>${followUpLine}</p>
        <p style="margin: 22px 0;">
          <a href="${calendlyUrl}"
             style="display: inline-block; background: #123143; color: white; padding: 12px 22px;
                    border-radius: 8px; text-decoration: none; font-weight: 600;">
            30-Minuten-Klärungsgespräch buchen
          </a>
        </p>
        <p style="font-size: 14px; color: #5a7a8a;">
          Falls die Diagnose im Team Diskussionen ausgelöst hat: Wir bieten dafür
          die Klausurtagung <em>"Strategische Schulführung im digitalen Wandel"</em> an –
          einen strukturierten Arbeitstag, der direkt auf eurer Diagnose aufbaut.
        </p>
        <p style="font-size: 14px; color: #5a7a8a;">
          Herzlich,<br/>
          Enikö Parrag<br/>
          EDUTECSOL GmbH
        </p>
      </div>
    `;

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: body.email, name: body.firstName }],
        subject: "Eure Reifegrad-Diagnose · EDUTECSOL",
        htmlContent: htmlBody,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead-API Fehler:", err);
    // Wir geben trotzdem ok zurück, damit der PDF-Download nicht blockiert wird
    return NextResponse.json({ ok: true, warning: "partial-failure" });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  } as Record<string, string>)[c]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  ALTERNATIVE: Mailchimp statt Brevo
//
//  Wenn du Mailchimp nutzt, ersetze den oberen Brevo-Block durch:
//
//  const dc = process.env.MAILCHIMP_DC;          // z.B. "us12"
//  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
//  const apiKey = process.env.MAILCHIMP_API_KEY;
//
//  await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
//    method: "POST",
//    headers: {
//      Authorization: `Basic ${Buffer.from("anystring:" + apiKey).toString("base64")}`,
//      "Content-Type": "application/json",
//    },
//    body: JSON.stringify({
//      email_address: body.email,
//      status: "subscribed",
//      merge_fields: {
//        FNAME: body.firstName,
//        SCHULE: body.school,
//        FUNKTION: body.role,
//      },
//    }),
//  });
//
//  Für die Transaktionsmail brauchst du Mandrill (Mailchimp Transactional).
// ─────────────────────────────────────────────────────────────────────────────
