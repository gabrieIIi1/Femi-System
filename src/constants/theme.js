// ─── PALETA DE CORES ─────────────────────────────────────────
export const C = {
  primary:      "#b5416a",
  primaryDark:  "#8f2f53",
  primaryLight: "#fce4ec",
  primaryMid:   "#f0bfce",
  bg:           "#fff8fa",
  bgCard:       "#ffffff",
  text:         "#2e1019",
  textMid:      "#7a4558",
  textLight:    "#b08292",
  border:       "#f0d6dc",
  borderMid:    "#e0bfca",
  green:        "#22a96a",
  greenBg:      "#e6f9f0",
  red:          "#e24b4a",
  redBg:        "#fdf0f0",
  amber:        "#f5a623",
  amberBg:      "#fff8e6",
  sidebar:      "#1e0c14",
}

// ─── ESTILOS REUTILIZÁVEIS ────────────────────────────────────
export const css = {
  card: {
    background:   C.bgCard,
    border:       `1px solid ${C.border}`,
    borderRadius: 16,
    padding:      "20px 22px",
  },

  pill: (active) => ({
    fontSize:     12,
    padding:      "5px 14px",
    borderRadius: 20,
    border:       `1px solid ${active ? C.primary : C.border}`,
    background:   active ? C.primary : "#fff",
    color:        active ? "#fff" : C.textMid,
    cursor:       "pointer",
    fontFamily:   "inherit",
    fontWeight:   active ? 600 : 400,
    transition:   "all .15s",
  }),

  btn: (variant = "primary") => ({
    border:       "none",
    borderRadius: 22,
    padding:      "10px 20px",
    fontSize:     13,
    fontWeight:   600,
    cursor:       "pointer",
    fontFamily:   "inherit",
    display:      "flex",
    alignItems:   "center",
    gap:          6,
    transition:   "all .15s",
    ...(variant === "primary" && {
      background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
      color:      "#fff",
      boxShadow:  `0 4px 14px rgba(181,65,106,.28)`,
    }),
    ...(variant === "ghost" && {
      background: "transparent",
      color:      C.primary,
      border:     `1px solid ${C.border}`,
    }),
  }),

  input: {
    width:        "100%",
    border:       `1px solid ${C.border}`,
    borderRadius: 10,
    padding:      "10px 14px",
    fontSize:     14,
    color:        C.text,
    background:   "#fff",
    fontFamily:   "inherit",
    outline:      "none",
    boxSizing:    "border-box",
  },

  label: {
    fontSize:     12,
    color:        C.textMid,
    fontWeight:   600,
    display:      "block",
    marginBottom: 5,
    marginTop:    14,
  },
}

// ─── STATUS DE AGENDAMENTO ────────────────────────────────────
export const STATUS = {
  done:   { bg: "#e6f9f0", color: "#22a96a", border: "#C0DD97",  label: "Concluído"    },
  now:    { bg: "#fce4ec", color: "#8f2f53", border: "#f0bfce",  label: "Em andamento" },
  next:   { bg: "#fff8e6", color: "#7a4a08", border: "#FAC775",  label: "Próximo"      },
  cancel: { bg: "#f5f5f5", color: "#999",    border: "#e0e0e0",  label: "Cancelado"    },
}

// ─── STATUS DO WHATSAPP ───────────────────────────────────────
export const STATUS_WPP = {
  ativo:    { bg: "#e6f9f0", color: "#22a96a", border: "#C0DD97", label: "Ativo",     dot: "#22a96a" },
  agendado: { bg: "#fff8e6", color: "#7a4a08", border: "#FAC775", label: "Agendado",  dot: "#f5a623" },
  pausado:  { bg: "#fdf0f0", color: "#e24b4a", border: "#f7c1c1", label: "Pausado",   dot: "#e24b4a" },
}

// ─── CORES POR CATEGORIA DE SERVIÇO ──────────────────────────
export const CAT_COLOR = {
  Unhas:        ["#fce4ec", "#8f2f53"],
  Sobrancelhas: ["#e8eaf6", "#3C3489"],
  Cílios:       ["#fff8e6", "#633806"],
  Cabelo:       ["#e6f9f0", "#27500A"],
  Estética:     ["#f3e5f5", "#6a1b9a"],
  Outra:        ["#f1f1f1", "#555555"],
}

export const CAT_COLORS_FIN = {
  Cílios:       "#b5416a",
  Unhas:        "#e07baa",
  Sobrancelhas: "#7c6fc9",
  Cabelo:       "#22a96a",
  Estética:     "#f5a623",
  Outra:        "#b08292",
}
