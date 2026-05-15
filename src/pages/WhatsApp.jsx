import { useState, useEffect, useMemo } from "react"
import { useApp } from "../contexts/AppContext"
import { C, css, STATUS, STATUS_WPP, CAT_COLOR, CAT_COLORS_FIN } from "../constants/theme"
import { Ico, Avatar, Badge, MetricCard, Topbar, MiniDonut } from "../components/UI"
import { initials, fmtDur, fmtData, getWeekDates, getMonthDays, processarMensagem } from "../utils/helpers"
import { MESES, DIAS_SEMANA, HORAS_AGENDA, HORARIOS_BUSY, ORIGEM_OPTS, HORARIO_OPTS,
         PREFS_OPTS, SAUDE_OPTS, CATS_SERVICO, EMOJIS_SERVICO, GASTO_CATS, RECOMPENSAS,
         META_PONTOS, TODAY, AUTOMACOES_INIT } from "../constants/data"
import { useLocalStorage } from "../hooks/useLocalStorage"


function WhatsApp({ setPage }) {
  const { clientes, agendamentos } = useApp()
  const [automacoes, setAutomacoes] = useLocalStorage("bf-automacoes-wpp", AUTOMACOES_INIT)
  const [editando, setEditando] = useState(null)      // id da automação em edição
  const [msgEdit, setMsgEdit] = useState("")
  const [simCliente, setSimCliente] = useState(null)  // id p/ simulação
  const [abaWpp, setAbaWpp] = useState("automacoes")  // "automacoes" | "historico" | "simular"

  const toggleStatus = (id) => {
    setAutomacoes(prev => prev.map(a => {
      if (a.id !== id) return a
      const next = a.status === "ativo" ? "pausado" : a.status === "pausado" ? "ativo" : a.status
      return { ...a, status: next }
    }))
  }

  const saveEdit = (id) => {
    setAutomacoes(prev => prev.map(a => a.id === id ? { ...a, mensagem: msgEdit } : a))
    setEditando(null)
  }

  const ativos   = automacoes.filter(a => a.status === "ativo").length
  const pausados = automacoes.filter(a => a.status === "pausado").length

  // Simulador: substitui variáveis pela cliente selecionada
  const previewMsg = (msg) => {
    const cli = simCliente ? clientes.find(c => c.id === simCliente) : clientes[0]
    if (!cli) return msg
    const ags = agendamentos.filter(a => a.clienteId === cli.id).slice(-1)[0]
    return msg
      .replace(/{nome}/g, cli.nome.split(" ")[0])
      .replace(/{hora}/g, ags?.hora || "14:00")
      .replace(/{data}/g, ags?.data?.split("-").reverse().join("/") || "15/05")
      .replace(/{servico}/g, cli.servicos?.[0] || "serviço")
  }

  // Histórico simulado baseado nos agendamentos reais
  const historico = agendamentos
    .filter(a => a.status !== "cancel")
    .slice(-8)
    .reverse()
    .map(a => {
      const cli = clientes.find(c => c.id === a.clienteId)
      return {
        id: a.id,
        nome: cli?.nome || "Cliente",
        wpp: cli?.wpp || "",
        msg: `Lembrete de agendamento para ${a.data.split("-").reverse().join("/")} às ${a.hora}`,
        hora: "09:00",
        status: "enviado",
      }
    })

  const AbaWppBtn = ({ id, label }) => (
    <button onClick={() => setAbaWpp(id)} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, border: `1px solid ${abaWpp === id ? C.primary : C.border}`, background: abaWpp === id ? C.primary : "#fff", color: abaWpp === id ? "#fff" : C.textMid, cursor: "pointer", fontFamily: "inherit", fontWeight: abaWpp === id ? 700 : 400 }}>{label}</button>
  )

  return (
    <div>
      <Topbar title="WhatsApp Automático" />
      <div style={{ padding: "20px 24px" }}>

        {/* Banner status */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { icon: "check", label: "Automações ativas", value: ativos, bg: C.greenBg, border: "#C0DD97", color: C.green },
            { icon: "message", label: "Mensagens enviadas hoje", value: historico.length, bg: C.primaryLight, border: C.primaryMid, color: C.primary },
            { icon: "alert", label: "Pausadas", value: pausados, bg: C.amberBg, border: "#FAC775", color: C.amber },
          ].map(({ icon, label, value, bg, border, color }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico name={icon} size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 11, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <AbaWppBtn id="automacoes" label="⚙️ Automações" />
          <AbaWppBtn id="historico"  label="📋 Histórico de envios" />
          <AbaWppBtn id="simular"    label="👁 Simular mensagem" />
        </div>

        {/* ABA: AUTOMAÇÕES */}
        {abaWpp === "automacoes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {automacoes.map(a => {
              const st = STATUS_WPP[a.status]
              const isEdit = editando === a.id
              return (
                <div key={a.id} style={{ ...css.card, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    {/* dot */}
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: st.dot, flexShrink: 0, marginTop: 5 }} />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{a.title}</div>
                        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontWeight: 700 }}>{st.label}</span>
                      </div>

                      {/* Mensagem — editável ou preview */}
                      {isEdit ? (
                        <div>
                          <textarea value={msgEdit} onChange={e => setMsgEdit(e.target.value)}
                            style={{ ...css.input, height: 80, resize: "none", fontSize: 12, marginBottom: 8 }} />
                          <div style={{ fontSize: 10, color: C.textLight, marginBottom: 8 }}>
                            Variáveis: <code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4 }}>{"{nome}"}</code>{" "}
                            <code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4 }}>{"{hora}"}</code>{" "}
                            <code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4 }}>{"{data}"}</code>{" "}
                            <code style={{ background: C.bg, padding: "1px 5px", borderRadius: 4 }}>{"{servico}"}</code>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setEditando(null)} style={css.btn("ghost")}>Cancelar</button>
                            <button onClick={() => saveEdit(a.id)} style={css.btn()}>
                              <Ico name="check" size={13} /> Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: C.textMid, background: C.bg, borderRadius: 8, padding: "8px 10px", lineHeight: 1.5, fontStyle: "italic" }}>
                          "{a.mensagem}"
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    {!isEdit && (
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => { setEditando(a.id); setMsgEdit(a.mensagem) }}
                          style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Ico name="edit" size={13} color={C.textMid} />
                        </button>
                        {a.status !== "agendado" && (
                          <button onClick={() => toggleStatus(a.id)}
                            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${a.status === "ativo" ? C.red : "#C0DD97"}`, background: a.status === "ativo" ? C.redBg : C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Ico name={a.status === "ativo" ? "x" : "check"} size={13} color={a.status === "ativo" ? C.red : C.green} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ABA: HISTÓRICO */}
        {abaWpp === "historico" && (
          <div style={css.card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Mensagens enviadas recentemente</div>
            {historico.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: C.textLight, fontSize: 12 }}>Nenhuma mensagem enviada ainda</div>
            )}
            {historico.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
                <Avatar name={h.nome} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{h.nome}</div>
                    <div style={{ fontSize: 10, color: C.textLight }}>{h.hora}</div>
                  </div>
                  <div style={{ fontSize: 11, color: C.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.msg}</div>
                  <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>{h.wpp}</div>
                </div>
                <span style={{ fontSize: 10, background: C.greenBg, color: C.green, border: `1px solid #C0DD97`, borderRadius: 8, padding: "2px 8px", fontWeight: 700, flexShrink: 0 }}>✓ Enviado</span>
              </div>
            ))}
          </div>
        )}

        {/* ABA: SIMULAR */}
        {abaWpp === "simular" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={css.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Configurar simulação</div>
              <label style={css.label}>Selecionar cliente</label>
              <select value={simCliente || ""} onChange={e => setSimCliente(Number(e.target.value))}
                style={{ ...css.input, marginBottom: 0 }}>
                <option value="">Selecione uma cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 10 }}>Preview de cada automação:</div>
                {automacoes.filter(a => a.status === "ativo").map(a => (
                  <div key={a.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 12, background: C.bg, borderRadius: 8, padding: "8px 10px", color: C.text, lineHeight: 1.5 }}>
                      {previewMsg(a.mensagem)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview visual de WhatsApp */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 10 }}>Preview de conversa</div>
              <div style={{ background: "#e5ddd5", borderRadius: 16, padding: 16, minHeight: 300 }}>
                <div style={{ background: "#128c7e", borderRadius: "12px 12px 0 0", padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#128c7e" }}>
                    {simCliente ? initials(clientes.find(c => c.id === simCliente)?.nome || "BS") : "BS"}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>FEMI Studio</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>online</div>
                  </div>
                </div>
                {automacoes.filter(a => a.status === "ativo").slice(0, 3).map((a, i) => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                    <div style={{ maxWidth: "80%", background: "#dcf8c6", borderRadius: "12px 0 12px 12px", padding: "8px 10px", fontSize: 12, color: "#2e1019", lineHeight: 1.5, boxShadow: "0 1px 2px rgba(0,0,0,.1)" }}>
                      {previewMsg(a.mensagem)}
                      <div style={{ fontSize: 10, color: "#7a9e7a", textAlign: "right", marginTop: 4 }}>09:0{i} ✓✓</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


export default WhatsApp
