import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reifegrad-Diagnose | mitPlan GmbH',
  description: 'Strategische Schulführung im digitalen Wandel – Reifegrad-Diagnose für Schulleitungen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
