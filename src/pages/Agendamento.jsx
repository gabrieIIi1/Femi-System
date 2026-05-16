import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import { C, css } from "../constants/theme"
import { Ico, Avatar } from "../components/UI"
import { fmtDur } from "../utils/helpers"
import { HORAS_AGENDA, HORARIOS_BUSY, TODAY } from "../constants/data"

function Agendamento() {
  const navigate = useNavigate()
  const { clientes, servicos, addAgendamento } = useApp()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [sel, setSel] = useState({ cli: null, srv: null, data: TODAY, hora: "14:00" })
  const set = (k, v) => setSel(s => ({ ...s, [k]: v }))

  const cli = clientes.find(c => c.id === sel.cli)
  const srv = servicos.find(s => s.id === sel.srv)
  const stepValid = useMemo(() => {
    if (step === 1) return !!sel.cli
    if (step === 2) return !!sel.srv
    if (step === 3) return !!sel.data && !!sel.hora && !HORARIOS_BUSY.includes(sel.hora)
    return true
  }, [step, sel])
  const canConfirm = cli && srv

  const StepDot = ({ n, label }) => {
    const done = n < step, active = n === step
    return (
      <div style={{ display: "flex", alignItems: "center", flex: n < 4 ? 1 : "none" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: done ? C.green : active ? C.primary : "#f0f0f0", color: done || active ? "#fff" : C.textLight, flexShrink: 0, border: `2px solid ${done ? C.green : active ? C.primary : "#e0e0e0"}` }}>
          {done ? <Ico name="check" size={12} color="#fff" /> : n}
        </div>
        <span style={{ fontSize: 12, marginLeft: 6, color: active ? C.primary : done ? C.green : C.textLight, fontWeight: active ? 700 : 400 }}>{label}</span>
        {n < 4 && <div style={{ flex: 1, height: 2, background: done ? C.green : C.border, margin: "0 8px", borderRadius: 2 }} />}
      </div>
    )
  }

  if (done) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg }}>
      <div style={{ ...css.card, maxWidth: 340, width: "100%", textAlign: "center", padding: "2.5rem" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenBg, border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Ico name="check" size={24} color={C.green} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>Agendado com sucesso!</div>
        <div style={{ fontSize: 13, color: C.textMid, marginBottom: 4 }}>{cli?.nome} · {srv?.emoji} {srv?.nome}</div>
        <div style={{ fontSize: 12, color: C.textLight, marginBottom: 20 }}>{sel.data.split("-").reverse().join("/")} às {sel.hora}</div>
        <div style={{ background: C.greenBg, border: `1px solid #C0DD97`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#27500A", display: "flex", alignItems: "center", gap: 8, marginBottom: 20, textAlign: "left", fontWeight: 500 }}>
          📱 Lembrete WhatsApp será enviado para {cli?.wpp}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setStep(1); setDone(false); setSel({ cli: null, srv: null, data: TODAY, hora: "14:00" }) }} style={css.btn("ghost")}>+ Novo</button>
          <button onClick={() => navigate("/agenda")} style={{ ...css.btn(), flex: 1 }}>Ver agenda →</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button onClick={() => navigate("/agenda")} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
          <Ico name="arrow" size={14} /> Agenda
        </button>
        <span style={{ color: C.textLight }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Novo agendamento</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.textLight }}>Passo {step} de 4</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          {["Cliente","Serviço","Horário","Confirmar"].map((l, i) => <StepDot key={i} n={i+1} label={l} />)}
        </div>

        {step === 1 && (
          <div style={css.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Selecionar cliente</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {clientes.map(c => (
                <div key={c.id} onClick={() => set("cli", c.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `${sel.cli === c.id ? 2 : 1}px solid ${sel.cli === c.id ? C.primary : C.border}`, background: sel.cli === c.id ? C.bg : "#fff", cursor: "pointer", transition: "all .15s" }}>
                  <Avatar name={c.nome} size={34} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.nome}</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>{c.servicos?.join(", ")} · {c.pontos} pts</div>
                  </div>
                  {sel.cli === c.id && <Ico name="check" size={16} color={C.primary} />}
                </div>
              ))}
              <div onClick={() => navigate("/nova-cliente")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, border: `1px dashed ${C.border}`, cursor: "pointer", color: C.primary, fontSize: 13, fontWeight: 600 }}>
                <Ico name="plus" size={14} color={C.primary} /> Cadastrar nova cliente
              </div>
            </div>
            {!sel.cli && (
              <div style={{ marginTop: 14, color: C.red, fontSize: 12, fontWeight: 600 }}>
                Selecione uma cliente antes de continuar.
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={css.card}>
            {cli && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.bg, borderRadius: 8, marginBottom: 16 }}>
                <Avatar name={cli.nome} size={30} fontSize={10} />
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Serviço para {cli.nome}</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {servicos.map(s => (
                <div key={s.id} onClick={() => set("srv", s.id)} style={{ border: `${sel.srv === s.id ? 2 : 1}px solid ${sel.srv === s.id ? C.primary : C.border}`, borderRadius: 10, padding: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: sel.srv === s.id ? C.bg : "#fff", transition: "all .15s" }}>
                  <div style={{ fontSize: 22 }}>{s.emoji}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{s.nome}</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>R${s.preco} · {fmtDur(s.dur)}</div>
                  </div>
                </div>
              ))}
            </div>
            {!sel.srv && (
              <div style={{ marginTop: 14, color: C.red, fontSize: 12, fontWeight: 600 }}>
                Selecione um serviço antes de continuar.
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div style={css.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Data</div>
            <input type="date" value={sel.data} onChange={e => set("data", e.target.value)} style={{ ...css.input, marginBottom: 18, maxWidth: 220 }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Horários disponíveis</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {HORAS_AGENDA.map(h => {
                const busy = HORARIOS_BUSY.includes(h)
                const selH = sel.hora === h
                return (
                  <div key={h} onClick={() => !busy && set("hora", h)} style={{ padding: "10px 4px", textAlign: "center", borderRadius: 8, border: `${selH ? 2 : 1}px solid ${selH ? C.primary : busy ? C.border : C.border}`, fontSize: 13, fontWeight: 600, cursor: busy ? "not-allowed" : "pointer", background: busy ? "#f8f8f8" : selH ? C.primary : "#fff", color: busy ? "#ccc" : selH ? "#fff" : C.text, textDecoration: busy ? "line-through" : "none", transition: "all .15s" }}>
                    {h}
                  </div>
                )
              })}
            </div>
            {(!sel.data || !sel.hora || HORARIOS_BUSY.includes(sel.hora)) && (
              <div style={{ marginTop: 14, color: C.red, fontSize: 12, fontWeight: 600 }}>
                Escolha uma data e um horário disponível para continuar.
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={css.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Resumo do agendamento</div>
              {[["Cliente", cli?.nome], ["Serviço", `${srv?.emoji} ${srv?.nome}`], ["Data", sel.data.split("-").reverse().join("/")], ["Horário", sel.hora], ["Duração", srv ? fmtDur(srv.dur) : "—"], ["Valor", srv ? `R$${srv.preco}` : "—"]].map(([l, v]) => v && (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                  <span style={{ color: C.textMid, fontSize: 12, fontWeight: 600 }}>{l}</span>
                  <span style={{ fontWeight: 700, color: l === "Valor" ? C.primary : C.text }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, background: C.greenBg, border: `1px solid #C0DD97`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#27500A", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
              📱 Lembrete automático via WhatsApp será enviado 24h antes
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: "#fff" }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)} style={css.btn("ghost")}>← Voltar</button>}
        <button onClick={() => {
          if (step < 4) {
            if (!stepValid) return
            setStep(s => s + 1)
            return
          }
          if (canConfirm) { addAgendamento({ clienteId: sel.cli, servicoId: sel.srv, data: sel.data, hora: sel.hora, valor: srv.preco }); setDone(true) }
        }} style={{ ...css.btn(), flex: 2, opacity: step < 4 && !stepValid ? 0.6 : 1, cursor: step < 4 && !stepValid ? "not-allowed" : "pointer" }} disabled={step < 4 && !stepValid}>
          {step < 4 ? "Próximo →" : "✓ Confirmar agendamento"}
        </button>
      </div>
    </div>
  )
}


export default Agendamento
