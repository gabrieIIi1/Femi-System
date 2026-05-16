import { useState, useEffect, useMemo } from "react"
import { useApp } from "../contexts/AppContext"
import { C, css, STATUS, STATUS_WPP, CAT_COLOR, CAT_COLORS_FIN } from "../constants/theme"
import { Ico, Avatar, Badge, MetricCard, Topbar, MiniDonut } from "../components/UI"
import { initials, fmtDur, fmtData, getWeekDates, getMonthDays, processarMensagem } from "../utils/helpers"
import { MESES, DIAS_SEMANA, HORAS_AGENDA, HORARIOS_BUSY, ORIGEM_OPTS, HORARIO_OPTS,
         PREFS_OPTS, SAUDE_OPTS, CATS_SERVICO, EMOJIS_SERVICO, GASTO_CATS, RECOMPENSAS,
         META_PONTOS, TODAY, AUTOMACOES_INIT } from "../constants/data"
import { useLocalStorage } from "../hooks/useLocalStorage"


function Agenda({ setPage }) {
  const { agendamentos, clientes, servicos, updateAgendamento, removeAgendamento } = useApp()
  const [view, setView] = useState("semana")
  const [mes, setMes] = useState(new Date().getMonth())
  const [semana, setSemana] = useState(0)
  const [diaSelected, setDiaSelected] = useState(TODAY)
  const [selectedAppt, setSelectedAppt] = useState(null)

  const weekDates = useMemo(() => getWeekDates(TODAY, semana), [semana])
  const currentYear = new Date(TODAY).getFullYear()

  const getSlots = (date) => agendamentos.filter(a => a.data === date).map(a => ({
    ...a, cliente: clientes.find(c => c.id === a.clienteId), servico: servicos.find(s => s.id === a.servicoId)
  }))

  const monthDays = useMemo(() => {
    const days = []
    const first = new Date(currentYear, mes, 1).getDay()
    const prev = new Date(currentYear, mes, 0).getDate()
    for (let i = first - 1; i >= 0; i--) days.push({ d: prev - i, other: true })
    const last = new Date(currentYear, mes + 1, 0).getDate()
    for (let d = 1; d <= last; d++) days.push({ d, other: false })
    while (days.length % 7 !== 0) days.push({ d: days.length - last - first + 1, other: true })
    return days
  }, [mes, currentYear])

  const mesIso = `${currentYear}-${String(mes + 1).padStart(2, "0")}`
  const stats = [
    ["Hoje", agendamentos.filter(a => a.data === TODAY && a.status !== "cancel").length],
    ["Este mês", agendamentos.filter(a => a.data.startsWith(mesIso) && a.status !== "cancel").length],
    ["Receita do mês", `R$${agendamentos.filter(a => a.data.startsWith(mesIso) && a.status !== "cancel").reduce((s, a) => s + Number(a.valor || 0), 0).toLocaleString("pt-BR")}`],
    ["Taxa retorno", "87%"],
  ]

  const ViewBtn = ({ v, label }) => (
    <button onClick={() => setView(v)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, border: `1px solid ${view === v ? C.primary : C.border}`, background: view === v ? C.primary : "#fff", color: view === v ? "#fff" : C.textMid, cursor: "pointer", fontFamily: "inherit", fontWeight: view === v ? 600 : 400 }}>{label}</button>
  )

  const daySlots = getSlots(diaSelected)
  const selectedAppointment = selectedAppt ? daySlots.find(a => a.id === selectedAppt) : null

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Topbar */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={() => { setMes(m => (m - 1 + 12) % 12); setSemana(w => w - 1) }} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ico name="chevLeft" size={14} /></button>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text, minWidth: 110, textAlign: "center" }}>{MESES[mes]} {currentYear}</span>
        <button onClick={() => { setMes(m => (m + 1) % 12); setSemana(w => w + 1) }} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ico name="chevRight" size={14} /></button>
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {[["dia","Dia"],["semana","Semana"],["mes","Mês"]].map(([v,l]) => <ViewBtn key={v} v={v} label={l} />)}
        </div>
        <button onClick={() => setPage("agendamento")} style={{ ...css.btn(), marginLeft: "auto" }}>
          <Ico name="plus" size={13} /> Novo agendamento
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", background: "#fff", borderBottom: `1px solid ${C.border}` }}>
        {stats.map(([l, v]) => (
          <div key={l} style={{ flex: 1, padding: "10px 16px", textAlign: "center", borderRight: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: l.includes("Receita") ? C.primary : l.includes("retorno") ? C.green : C.text }}>{v}</div>
            <div style={{ fontSize: 10, color: C.textLight, marginTop: 2, fontWeight: 500 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* SEMANA VIEW */}
      {view === "semana" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "50px repeat(7,1fr)", background: "#fff", borderBottom: `1px solid ${C.border}` }}>
            <div />
            {weekDates.map((date, i) => {
              const isToday = date === TODAY
              return (
                <div key={date} style={{ padding: "8px 4px", textAlign: "center", borderLeft: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 10, color: C.textLight, fontWeight: 600 }}>{DIAS_SEMANA[i]}</div>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", margin: "3px auto 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: isToday ? C.primary : "transparent", color: isToday ? "#fff" : C.text }}>
                    {new Date(date).getDate()}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {HORAS_AGENDA.map(h => (
              <div key={h} style={{ display: "grid", gridTemplateColumns: "50px repeat(7,1fr)", minHeight: 54 }}>
                <div style={{ fontSize: 10, color: C.textLight, padding: "4px 6px 0", textAlign: "right", borderRight: `1px solid ${C.border}`, fontWeight: 500 }}>{h}</div>
                {weekDates.map(date => {
                  const hour = parseInt(h)
                  const evs = agendamentos.filter(a => a.data === date && parseInt(a.hora) === hour)
                  return (
                    <div key={date} onClick={() => { setDiaSelected(date); setView("dia") }}
                      style={{ borderLeft: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: 2, cursor: "pointer", position: "relative", minHeight: 54, background: evs.length ? undefined : "transparent" }}>
                      {evs.map(a => {
                        const cli = clientes.find(c => c.id === a.clienteId)
                        const srv = servicos.find(s => s.id === a.servicoId)
                        const st = STATUS[a.status]
                        return (
                          <div key={a.id} style={{ borderRadius: 6, padding: "4px 6px", fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, borderLeft: `3px solid ${st.color}`, lineHeight: 1.4, overflow: "hidden", minHeight: 44 }}>
                            {cli?.nome?.split(" ")[0]}<br /><span style={{ fontWeight: 400, opacity: 0.8 }}>{srv?.nome?.slice(0, 12)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MÊS VIEW */}
      {view === "mes" && (
        <div style={{ flex: 1, padding: 14, overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 6 }}>
            {DIAS_SEMANA.map(d => <div key={d} style={{ fontSize: 10, color: C.textLight, textAlign: "center", fontWeight: 600 }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
            {monthDays.map(({ d, other }, i) => {
              const ds = `${currentYear}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
              const evs = !other ? agendamentos.filter(a => a.data === ds) : []
              const isToday = ds === TODAY && !other
              return (
                <div key={i} onClick={() => { if (!other) { setDiaSelected(ds); setView("dia") } }}
                  style={{ border: `${isToday ? 2 : 1}px solid ${isToday ? C.primary : C.border}`, borderRadius: 8, padding: 6, background: other ? "#fafafa" : "#fff", opacity: other ? 0.35 : 1, cursor: other ? "default" : "pointer", minHeight: 72 }}>
                  <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? C.primary : C.textMid, marginBottom: 3 }}>{d}</div>
                  {evs.slice(0, 2).map(a => {
                    const cli = clientes.find(c => c.id === a.clienteId)
                    return <div key={a.id} style={{ fontSize: 9, fontWeight: 600, background: C.primaryLight, color: C.primaryDark, borderRadius: 3, padding: "1px 4px", marginBottom: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{cli?.nome?.split(" ")[0]}</div>
                  })}
                  {evs.length > 2 && <div style={{ fontSize: 9, color: C.textLight }}>+{evs.length - 2}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* DIA VIEW */}
      {view === "dia" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                {new Date(diaSelected + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div style={{ fontSize: 11, color: C.textLight }}>
                {daySlots.filter(a => a.status !== "cancel").length} atendimentos · R${daySlots.filter(a => a.status !== "cancel").reduce((s, a) => s + a.valor, 0).toLocaleString("pt-BR")} previstos
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[[-1, "chevLeft"], [1, "chevRight"]].map(([d, ic]) => (
                <button key={d} onClick={() => { const dt = new Date(diaSelected); dt.setDate(dt.getDate() + d); setDiaSelected(dt.toISOString().split("T")[0]) }}
                  style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Ico name={ic} size={14} />
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "grid", gridTemplateColumns: selectedAppointment ? "1.5fr 0.9fr" : "1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {daySlots.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: C.textLight }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nenhum atendimento</div>
                  <div style={{ fontSize: 12 }}>Clique em "Novo agendamento" para adicionar</div>
                </div>
              )}
              {daySlots.map(a => {
                const st = STATUS[a.status]
                const isSelected = selectedAppt === a.id
                return (
                  <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", background: isSelected ? C.bg : "transparent", borderRadius: 16, padding: isSelected ? "14px" : 0 }}
                    onClick={() => setSelectedAppt(a.id)}>
                    <div style={{ fontSize: 11, color: C.textLight, width: 40, flexShrink: 0, paddingTop: 12, textAlign: "right", fontWeight: 600 }}>{a.hora}</div>
                    <div style={{ width: 3, alignSelf: "stretch", background: st.color, borderRadius: 3, flexShrink: 0 }} />
                    <div style={{ flex: 1, borderRadius: 12, padding: "12px 14px", border: `1px solid ${st.border}`, background: st.bg }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{a.cliente?.nome}</div>
                          <div style={{ fontSize: 11, color: C.textMid, marginTop: 2 }}>{a.servico?.nome} · {fmtDur(a.servico?.dur)} · <span style={{ fontWeight: 700, color: C.primary }}>R${a.valor}</span></div>
                        </div>
                        <Badge status={a.status} />
                      </div>
                      {a.cliente?.alergias?.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontSize: 11, background: C.amberBg, borderRadius: 6, padding: "4px 8px", width: "fit-content" }}>
                          <Ico name="alert" size={11} color={C.amber} />
                          <span style={{ color: "#7a4a08", fontWeight: 600 }}>Alergia: {a.cliente.alergias.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {selectedAppointment && (
              <div style={{ ...css.card, position: "sticky", top: 16, alignSelf: "flex-start" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Detalhes do atendimento</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>Toque em ações para atualizar.</div>
                  </div>
                  <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}><Ico name="x" size={16} /></button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ fontSize: 12, color: C.textLight }}>Cliente</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{selectedAppointment.cliente?.nome}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>Serviço</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{selectedAppointment.servico?.emoji} {selectedAppointment.servico?.nome}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Data</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedAppointment.data.split("-").reverse().join("/")}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Horário</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedAppointment.hora}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Status</div>
                      <Badge status={selectedAppointment.status} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: C.textLight }}>Valor</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>R${selectedAppointment.valor}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                  {selectedAppointment.status !== "done" && (
                    <button onClick={() => { updateAgendamento(selectedAppointment.id, { status: "done" }); setSelectedAppt(selectedAppointment.id) }} style={css.btn()}>Marcar como concluído</button>
                  )}
                  {selectedAppointment.status !== "cancel" && (
                    <button onClick={() => { updateAgendamento(selectedAppointment.id, { status: "cancel" }); setSelectedAppt(selectedAppointment.id) }} style={css.btn("ghost")}>Cancelar atendimento</button>
                  )}
                  <button onClick={() => { removeAgendamento(selectedAppointment.id); setSelectedAppt(null) }} style={{ ...css.btn("ghost"), color: C.red, borderColor: C.red }}>Excluir agendamento</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


export default Agenda
