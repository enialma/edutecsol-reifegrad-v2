"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="top-nav" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/edutecsol-logo.png" alt="EDUTECSOL" style={{ height: 30, width: "auto" }} />
        <span className="brand-product">Reifegrad-Diagnose</span>
      </div>
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>in Zusammenarbeit mit</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--petrol)" }}>mitPlan GmbH</span>
      </div>
    </nav>
  );
}
