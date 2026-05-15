import { useState, useEffect, useMemo } from "react"
import { useApp } from "../contexts/AppContext"
import { C, css, STATUS, STATUS_WPP, CAT_COLOR, CAT_COLORS_FIN } from "../constants/theme"
import { Ico, Avatar, Badge, MetricCard, Topbar, MiniDonut } from "../components/UI"
import { initials, fmtDur, fmtData, getWeekDates, getMonthDays, processarMensagem } from "../utils/helpers"
import { MESES, DIAS_SEMANA, HORAS_AGENDA, HORARIOS_BUSY, ORIGEM_OPTS, HORARIO_OPTS,
         PREFS_OPTS, SAUDE_OPTS, CATS_SERVICO, EMOJIS_SERVICO, GASTO_CATS, RECOMPENSAS,
         META_PONTOS, TODAY, AUTOMACOES_INIT } from "../constants/data"
import { useLocalStorage } from "../hooks/useLocalStorage"


function Servicos() {
  const { servicos, addServico, removeServico } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [catFilter, setCatFilter] = useState("")
  const [emoji, setEmoji] = useState("💅")
  const [form, setForm] = useState({ nome: "", cat: "", preco: "", dur: "", desc: "" })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const save = () => {
    if (!form.nome.trim()) return
    addServico({ emoji, nome: form.nome, cat: form.cat || "Outra", preco: parseFloat(form.preco) || 0, dur: parseInt(form.dur) || 60, desc: form.desc })
    setForm({ nome: "", cat: "", preco: "", dur: "", desc: "" })
    setShowForm(false)
  }

  const cats = [...new Set(servicos.map(s => s.cat))]
  const filtered = catFilter ? servicos.filter(s => s.cat === catFilter) : servicos

  return (
    <div>
      <Topbar title={`Serviços (${servicos.length})`} action={
        <button onClick={() => setShowForm(s => !s)} style={css.btn()}>
          <Ico name={showForm ? "x" : "plus"} size={13} /> {showForm ? "Fechar" : "Novo serviço"}
        </button>
      } />

      <div style={{ padding: "20px 24px" }}>
        {showForm && (
          <div style={{ ...css.card, marginBottom: 20, border: `1px solid ${C.primary}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <Ico name="plus" size={14} color={C.primary} /> Novo serviço
            </div>
            <label style={{ ...css.label, marginTop: 0 }}>Ícone</label>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              {EMOJIS_SERVICO.map(e => (
                <button key={e} onClick={() => setEmoji(e)} style={{ width: 34, height: 34, borderRadius: 8, border: `${emoji === e ? 2 : 1}px solid ${emoji === e ? C.primary : C.border}`, background: emoji === e ? C.bg : "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{e}</button>
              ))}
            </div>
            <label style={css.label}>Nome do serviço *</label>
            <input style={css.input} placeholder="Ex: Blindagem de unhas" value={form.nome} onChange={e => set("nome", e.target.value)} />
            <label style={css.label}>Categoria</label>
            <select style={css.input} value={form.cat} onChange={e => set("cat", e.target.value)}>
              <option value="">Selecione</option>
              {CATS_SERVICO.map(c => <option key={c}>{c}</option>)}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={css.label}>Preço (R$)</label><input type="number" style={css.input} placeholder="0,00" value={form.preco} onChange={e => set("preco", e.target.value)} /></div>
              <div><label style={css.label}>Duração (min)</label><input type="number" style={css.input} placeholder="60" value={form.dur} onChange={e => set("dur", e.target.value)} /></div>
            </div>
            <label style={css.label}>Descrição</label>
            <textarea style={{ ...css.input, height: 60, resize: "none" }} placeholder="Detalhes sobre o serviço..." value={form.desc} onChange={e => set("desc", e.target.value)} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => setShowForm(false)} style={css.btn("ghost")}>Cancelar</button>
              <button onClick={save} style={css.btn()}>
                <Ico name="check" size={13} /> Salvar serviço
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {["", ...cats].map(c => (
            <button key={c || "todos"} onClick={() => setCatFilter(c)} style={css.pill(catFilter === c)}>{c || "Todos"}</button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: C.textLight }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✂️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Nenhum serviço cadastrado</div>
            <button onClick={() => setShowForm(true)} style={css.btn()}>+ Adicionar primeiro serviço</button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map(s => {
            const [bg, fg] = CAT_COLOR[s.cat] || ["#f5f5f5", "#555"]
            return (
              <div key={s.id} style={{ ...css.card, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.nome}</div>
                  <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>R${s.preco} · {fmtDur(s.dur)}</div>
                  {s.desc && <div style={{ fontSize: 10, color: C.textLight, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.desc}</div>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: bg, color: fg, fontWeight: 700 }}>{s.cat}</span>
                  <button onClick={() => { if (confirm(`Remover "${s.nome}"?`)) removeServico(s.id) }} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.red }}>
                    <Ico name="trash" size={12} color={C.red} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


export default Servicos
