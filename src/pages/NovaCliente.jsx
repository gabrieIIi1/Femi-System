import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { C, css, STATUS, STATUS_WPP, CAT_COLOR, CAT_COLORS_FIN } from "../constants/theme"
import { Ico, Avatar, Badge, MetricCard, Topbar, MiniDonut } from "../components/UI"
import { initials, fmtDur, fmtData, getWeekDates, getMonthDays, processarMensagem } from "../utils/helpers"
import { MESES, DIAS_SEMANA, HORAS_AGENDA, HORARIOS_BUSY, ORIGEM_OPTS, HORARIO_OPTS,
         PREFS_OPTS, SAUDE_OPTS, CATS_SERVICO, EMOJIS_SERVICO, GASTO_CATS, RECOMPENSAS,
         META_PONTOS, TODAY, AUTOMACOES_INIT } from "../constants/data"
import { useLocalStorage } from "../hooks/useLocalStorage"


function NovaCliente() {
  const navigate = useNavigate()
  const { addCliente } = useApp()
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ nome: "", wpp: "", nasc: "", email: "", origem: "", servicos: [], horario: "Tarde", alergias: [], saude: [], obs: "" })
  const [erro, setErro] = useState("")

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const tog = (k, v) => set(k, form[k].includes(v) ? form[k].filter(x => x !== v) : [...form[k], v])

  const handleSave = () => {
    if (!form.nome.trim() || !form.wpp.trim()) {
      setErro("Informe o nome e o WhatsApp da cliente para continuar.")
      return
    }
    setErro("")
    addCliente({ ...form, servicos: form.servicos.map(s => s.replace(/^.+\s/, "")) })
    setSaved(true)
  }

  const Pill2 = ({ val, k }) => {
    const active = form[k].includes(val)
    return <button onClick={() => tog(k, val)} style={{ ...css.pill(active), marginRight: 4, marginBottom: 6 }}>{val}</button>
  }

  if (saved) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg }}>
      <div style={{ ...css.card, maxWidth: 340, textAlign: "center", padding: "2.5rem" }}>
        <Avatar name={form.nome} size={60} fontSize={20} />
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginTop: 12, marginBottom: 4 }}>{form.nome}</div>
        <div style={{ fontSize: 13, color: C.textLight, marginBottom: 20 }}>Cadastrada com sucesso! 🎉</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setSaved(false); setStep(1); setForm({ nome:"",wpp:"",nasc:"",email:"",origem:"",servicos:[],horario:"Tarde",alergias:[],saude:[],obs:"" }) }} style={css.btn("ghost")}>+ Nova</button>
          <button onClick={() => navigate("/agendamento")} style={{ ...css.btn(), flex: 1 }}>Agendar agora →</button>
        </div>
      </div>
    </div>
  )

  const stepLabels = ["Dados pessoais", "Preferências", "Saúde & obs."]

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => navigate("/clientes")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <Ico name="arrow" size={14} /> Clientes
        </button>
        <span style={{ color: C.textLight }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Nova cliente</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.textLight }}>Passo {step} de 3</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          {stepLabels.map((l, i) => {
            const n = i + 1, isDone = n < step, isActive = n === step
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: isDone ? C.green : isActive ? C.primary : "#f0f0f0", color: isDone || isActive ? "#fff" : C.textLight, border: `2px solid ${isDone ? C.green : isActive ? C.primary : "#e0e0e0"}` }}>
                  {isDone ? <Ico name="check" size={12} color="#fff" /> : n}
                </div>
                <span style={{ fontSize: 12, marginLeft: 6, color: isActive ? C.primary : isDone ? C.green : C.textLight, fontWeight: isActive ? 700 : 400 }}>{l}</span>
                {i < 2 && <div style={{ flex: 1, height: 2, background: isDone ? C.green : C.border, margin: "0 8px", borderRadius: 2 }} />}
              </div>
            )
          })}
        </div>

        {step === 1 && (
          <div style={css.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 16 }}>Dados pessoais</div>
            <label style={css.label}>Nome completo *</label>
            <input style={css.input} placeholder="Ex: Mariana Costa" value={form.nome} onChange={e => set("nome", e.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={css.label}>WhatsApp *</label><input style={css.input} placeholder="(11) 99999-0000" value={form.wpp} onChange={e => set("wpp", e.target.value)} /></div>
              <div><label style={css.label}>Data de nascimento</label><input style={css.input} placeholder="DD/MM/AAAA" value={form.nasc} onChange={e => set("nasc", e.target.value)} /></div>
            </div>
            <label style={css.label}>E-mail</label>
            <input style={css.input} placeholder="cliente@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
            <label style={css.label}>Como nos conheceu?</label>
            <select style={css.input} value={form.origem} onChange={e => set("origem", e.target.value)}>
              <option value="">Selecione</option>
              {ORIGEM_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
            {step === 1 && !form.nome.trim() && !form.wpp.trim() && (
              <div style={{ marginTop: 12, color: C.red, fontSize: 12, fontWeight: 600 }}>
                Nome e WhatsApp são obrigatórios para avançar.
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={css.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 16 }}>Preferências</div>
            <label style={{ ...css.label, marginTop: 0 }}>Serviços de interesse</label>
            <div style={{ marginTop: 6 }}>
              {PREFS_OPTS.map(v => <Pill2 key={v} val={v} k="servicos" />)}
            </div>
            <label style={css.label}>Horário preferido</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {HORARIO_OPTS.map(h => (
                <button key={h} onClick={() => set("horario", h)} style={css.pill(form.horario === h)}>{h}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={css.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 16 }}>Saúde & observações</div>
            <label style={{ ...css.label, marginTop: 0 }}>Condições de saúde relevantes</label>
            <div style={{ marginTop: 6 }}>
              {SAUDE_OPTS.map(v => <Pill2 key={v} val={v} k="saude" />)}
            </div>
            <label style={css.label}>Alergias conhecidas</label>
            <input style={css.input} placeholder="Ex: látex, nichel, acrílico..." value={form.alergias.join(", ")} onChange={e => set("alergias", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
            <label style={css.label}>Observações adicionais</label>
            <textarea style={{ ...css.input, height: 70, resize: "none" }} placeholder="Preferências especiais, histórico relevante..." value={form.obs} onChange={e => set("obs", e.target.value)} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: "#fff" }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)} style={css.btn("ghost")}>← Voltar</button>}
        {step < 3 ? (
          <button onClick={() => { if (step === 1 && (!form.nome.trim() || !form.wpp.trim())) return; setStep(s => s + 1) }} style={{ ...css.btn(), flex: 2, opacity: step === 1 && (!form.nome.trim() || !form.wpp.trim()) ? 0.6 : 1, cursor: step === 1 && (!form.nome.trim() || !form.wpp.trim()) ? "not-allowed" : "pointer" }} disabled={step === 1 && (!form.nome.trim() || !form.wpp.trim())}>
            Próximo →
          </button>
        ) : (
          <button onClick={handleSave} style={{ ...css.btn(), flex: 2 }}>
            <Ico name="check" size={14} /> Cadastrar cliente
          </button>
        )}
      </div>
      {erro && (
        <div style={{ padding: "12px 20px", color: C.red, background: "#fff0f4", border: `1px solid #ffd1df`, borderRadius: 12, margin: "0 20px 20px", fontSize: 13, fontWeight: 600 }}>
          {erro}
        </div>
      )}
    </div>
  )
}


export default NovaCliente
