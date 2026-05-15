// ─── FORMATAÇÃO ───────────────────────────────────────────────

/** "Ana Souza" → "AS" */
export const initials = (n = "") =>
  n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase()

/** 90 → "1h30"  |  45 → "45min" */
export const fmtDur = (m) =>
  m < 60
    ? `${m}min`
    : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`

/** "2025-05-14" → "14/05/2025" */
export const fmtData = (iso) =>
  iso ? iso.split("-").reverse().join("/") : ""

/** "(41) 98888-1111" → "5541988881111" */
export function formatarNumeroWpp(wpp) {
  const d = wpp.replace(/\D/g, "")
  if (d.length === 13) return d
  if (d.length === 11) return "55" + d
  if (d.length === 10) return "55" + d
  throw new Error(`Número inválido: ${wpp}`)
}

// ─── CALENDÁRIO ────────────────────────────────────────────────

/** Retorna array de 7 datas ISO da semana, a partir de offset */
export function getWeekDates(baseDate = "2025-05-11", offset = 0) {
  const base = new Date(baseDate)
  base.setDate(base.getDate() + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    return d.toISOString().split("T")[0]
  })
}

/** Retorna grid de dias para a visão mensal */
export function getMonthDays(year, month) {
  const days  = []
  const first = new Date(year, month, 1).getDay()
  const prev  = new Date(year, month, 0).getDate()

  for (let i = first - 1; i >= 0; i--)
    days.push({ d: prev - i, other: true })

  const last = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= last; d++)
    days.push({ d, other: false })

  while (days.length % 7 !== 0)
    days.push({ d: days.length - last - first + 1, other: true })

  return days
}

// ─── WHATSAPP ──────────────────────────────────────────────────

/** Substitui {variáveis} numa string de template */
export function processarMensagem(template, dados = {}) {
  return template
    .replace(/{nome}/g,    dados.nome    || "")
    .replace(/{hora}/g,    dados.hora    || "")
    .replace(/{data}/g,    dados.data    || "")
    .replace(/{servico}/g, dados.servico || "")
    .replace(/{pontos}/g,  String(dados.pontos  ?? ""))
    .replace(/{desconto}/g,String(dados.desconto ?? ""))
}
