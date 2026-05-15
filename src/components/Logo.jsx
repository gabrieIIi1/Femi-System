// ─── LOGO FEMI SYSTEM ────────────────────────────────────────
// Uso: <FemiLogo /> | <FemiLogo variant="icon" /> | <FemiLogo variant="stacked" />
// variant: "horizontal" (padrão) | "icon" | "stacked"
// color: cor principal (padrão: #b5416a)
// onDark: true para versão branca (sidebar, hero)

export default function FemiLogo({
  variant = "horizontal",
  color   = "#b5416a",
  onDark  = false,
  width,
}) {
  const main    = onDark ? "#ffffff"  : color
  const accent  = onDark ? "#ff8db4"  : color
  const sub     = onDark ? "#ff8db4"  : color
  const dotOpacity = onDark ? 0.5 : 0.4

  // ── Estrela SVG ──────────────────────────────────────────
  const Star = ({ x, y, r = 10, opacity = 0.9 }) => {
    const p = r, s = r * 0.27
    return (
      <polygon
        points={`${x},${y-p} ${x+s},${y-s} ${x+p},${y} ${x+s},${y+s} ${x},${y+p} ${x-s},${y+s} ${x-p},${y} ${x-s},${y-s}`}
        fill={accent} opacity={opacity}
      />
    )
  }

  // ── Variante: ÍCONE quadrado ──────────────────────────────
  if (variant === "icon") {
    const w = width || 48
    return (
      <svg viewBox="0 0 48 48" width={w} height={w} xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill={color} />
        <text
          x="24" y="20"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="16" fontWeight="700" fontStyle="italic"
          fill="white"
        >fe</text>
        <text
          x="26" y="36"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="16" fontWeight="700" fontStyle="italic"
          fill="white"
        >mi</text>
        <Star x={40} y={10} r={6} opacity={0.9} />
        <Star x={12} y={14} r={3} opacity={0.5} />
      </svg>
    )
  }

  // ── Variante: EMPILHADO ───────────────────────────────────
  if (variant === "stacked") {
    const w = width || 120
    return (
      <svg viewBox="0 0 120 110" width={w} xmlns="http://www.w3.org/2000/svg">
        <text
          x="8" y="55"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="58" fontWeight="700" fontStyle="italic"
          fill={main}
        >fe</text>
        <text
          x="18" y="108"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="58" fontWeight="700" fontStyle="italic"
          fill={main}
        >mi</text>
        <Star x={110} y={14} r={13} opacity={0.9} />
        <Star x={6}   y={118} r={7}  opacity={0.55} />
        <circle cx={105} cy={40} r={3} fill={accent} opacity={dotOpacity} />
      </svg>
    )
  }

  // ── Variante: HORIZONTAL (padrão) ────────────────────────
  const w = width || 220
  return (
    <svg viewBox="0 0 220 72" width={w} xmlns="http://www.w3.org/2000/svg">
      {/* "femi" */}
      <text
        x="110" y="46"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="52" fontWeight="700" fontStyle="italic"
        fill={main}
      >femi</text>
      {/* "system" */}
      <text
        x="110" y="62"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="9" fontWeight="700"
        fill={sub}
        letterSpacing="6"
      >system</text>
      {/* Linha */}
      <line x1="50" y1="66" x2="170" y2="66" stroke={sub} strokeWidth="0.6" opacity="0.3" />
      {/* Estrelas */}
      <Star x={28}  y={22} r={13} opacity={0.9} />
      <Star x={16}  y={38} r={6}  opacity={0.5} />
      <Star x={192} y={20} r={15} opacity={0.9} />
      <Star x={206} y={38} r={6}  opacity={0.5} />
      {/* Pontos */}
      <circle cx={22}  cy={44} r={2.5} fill={accent} opacity={dotOpacity} />
      <circle cx={198} cy={44} r={2}   fill={accent} opacity={dotOpacity} />
    </svg>
  )
}
