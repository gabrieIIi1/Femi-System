import { C, css, STATUS } from "../constants/theme"
import { initials } from "../utils/helpers"

// ─── ÍCONES SVG INLINE ────────────────────────────────────────
const PATHS = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  calendar:  "M3 4a1 1 0 011-1h16a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4z M16 2v4 M8 2v4 M3 10h18",
  users:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 7a4 4 0 100 8 4 4 0 000-8z",
  scissors:  "M6 3a3 3 0 110 6 3 3 0 010-6z M18 21a3 3 0 110-6 3 3 0 010 6z M8.5 8.5l7 7 M6 21L20 7",
  chart:     "M18 20V10 M12 20V4 M6 20v-6",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  message:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  user:      "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  plus:      "M12 5v14 M5 12h14",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  check:     "M20 6L9 17l-5-5",
  x:         "M18 6L6 18 M6 6l12 12",
  chevLeft:  "M15 18l-6-6 6-6",
  chevRight: "M9 18l6-6-6-6",
  trash:     "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  alert:     "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  sparkles:  "M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z M19 13l.75 1.75L21.5 15.5l-1.75.75L19 18l-.75-1.75L16.5 15.5l1.75-.75L19 13z M5 17l.5 1.25L6.75 19l-1.25.5L5 20.75l-.5-1.25L3.25 19l1.25-.5L5 17z",
  trending:  "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  dollar:    "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  arrow:     "M19 12H5 M12 19l-7-7 7-7",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  phone:     "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
  gift:      "M20 12v10H4V12 M22 7H2v5h20V7z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
}

export function Ico({ name, size = 16, color }) {
  const d = PATHS[name] || ""
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color || "currentColor"}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}

// ─── AVATAR ───────────────────────────────────────────────────
export function Avatar({ name, size = 38, fontSize = 13 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: C.primaryLight,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 700, color: C.primaryDark,
      flexShrink: 0, letterSpacing: 0.5,
    }}>
      {initials(name)}
    </div>
  )
}

// ─── BADGE DE STATUS ──────────────────────────────────────────
export function Badge({ status }) {
  const s = STATUS[status] || STATUS.next
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 12,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  )
}

// ─── CARD DE MÉTRICA ──────────────────────────────────────────
export function MetricCard({ icon, label, value, sub, subColor }) {
  return (
    <div style={{ ...css.card, padding: "18px 20px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10, color: C.textLight,
        marginBottom: 8, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: 0.5,
      }}>
        <Ico name={icon} size={13} color={C.primary} />
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: subColor || C.textLight, marginTop: 5, fontWeight: 600 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ─── TOPBAR ───────────────────────────────────────────────────
export function Topbar({ title, action }) {
  return (
    <div style={{
      height: 56, background: "#fff",
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky", top: 0, zIndex: 20,
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{title}</div>
      {action}
    </div>
  )
}

// ─── MINI DONUT ───────────────────────────────────────────────
export function MiniDonut({ pct, size = 80, stroke = 9, color = C.primary, bg = C.primaryLight, label, sublabel }) {
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg}    strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: size > 70 ? 16 : 12, fontWeight: 800, color: C.text, lineHeight: 1 }}>
            {pct}%
          </div>
        </div>
      </div>
      {label    && <div style={{ fontSize: 11, fontWeight: 700, color: C.text,    marginTop: 6, textAlign: "center" }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 10,                  color: C.textLight,              textAlign: "center" }}>{sublabel}</div>}
    </div>
  )
}
