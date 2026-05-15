import { useState, useEffect, useMemo } from "react"
import { useApp } from "../contexts/AppContext"
import { C, css, STATUS, STATUS_WPP, CAT_COLOR, CAT_COLORS_FIN } from "../constants/theme"
import { Ico, Avatar, Badge, MetricCard, Topbar, MiniDonut } from "../components/UI"
import { initials, fmtDur, fmtData, getWeekDates, getMonthDays, processarMensagem } from "../utils/helpers"
import { MESES, DIAS_SEMANA, HORAS_AGENDA, HORARIOS_BUSY, ORIGEM_OPTS, HORARIO_OPTS,
         PREFS_OPTS, SAUDE_OPTS, CATS_SERVICO, EMOJIS_SERVICO, GASTO_CATS, RECOMPENSAS,
         META_PONTOS, TODAY, AUTOMACOES_INIT, GASTOS_INIT } from "../constants/data"
import { useLocalStorage } from "../hooks/useLocalStorage"


// Gastos iniciais de exemplo

function FinBarChart({ entradas, gastos, labels }) {
  const max = Math.max(...entradas, ...gastos, 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130, paddingBottom: 18, paddingTop: 8 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 100 }}>
            <div title={`Receita R$${entradas[i]}`} style={{ width: 14, borderRadius: "4px 4px 0 0", background: C.primary, height: `${(entradas[i] / max) * 100}%`, minHeight: entradas[i] > 0 ? 4 : 0, transition: "height .4s" }} />
            <div title={`Gastos R$${gastos[i]}`} style={{ width: 14, borderRadius: "4px 4px 0 0", background: C.primaryLight, height: `${(gastos[i] / max) * 100}%`, minHeight: gastos[i] > 0 ? 4 : 0, transition: "height .4s" }} />
          </div>
          <div style={{ fontSize: 10, color: C.textLight, fontWeight: 600 }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

function Financeiro() {
  const { agendamentos, clientes, servicos } = useApp()

  // ── Estado de gastos (persiste em localStorage) ──
  const [gastos, setGastos] = useLocalStorage("bf-gastos-fin", GASTOS_INIT)
  const [showGastoForm, setShowGastoForm] = useState(false)
  const [gastoForm, setGastoForm] = useState({ desc: "", valor: "", data: "2025-05-14", cat: "Material" })
  const [filtroMes, setFiltroMes] = useState("2025-05")
  const [abaAtiva, setAbaAtiva] = useState("visao")
  const [confirmGasto, setConfirmGasto] = useState(null)

  const setG = (k, v) => setGastoForm(f => ({ ...f, [k]: v }))

  const addGasto = () => {
    if (!gastoForm.desc.trim() || !gastoForm.valor) return
    const novo = { id: Date.now(), desc: gastoForm.desc, valor: parseFloat(gastoForm.valor), data: gastoForm.data, cat: gastoForm.cat }
    setGastos(g => [novo, ...g])
    setGastoForm({ desc: "", valor: "", data: "2025-05-14", cat: "Material" })
    setShowGastoForm(false)
  }

  const removeGasto = (id) => { setGastos(g => g.filter(x => x.id !== id)); setConfirmGasto(null) }

  // ── Cálculos reais a partir dos agendamentos ──
  const agsMes = agendamentos.filter(a => a.status !== "cancel" && a.data.startsWith(filtroMes))
  const receitaMes = agsMes.reduce((s, a) => s + Number(a.valor || 0), 0)

  const gastosMes = gastos.filter(g => g.data.startsWith(filtroMes))
  const totalGastos = gastosMes.reduce((s, g) => s + Number(g.valor || 0), 0)
  const lucro = receitaMes - totalGastos
  const margem = receitaMes > 0 ? Math.round((lucro / receitaMes) * 100) : 0

  // Receita por categoria de serviço (real)
  const recCat = {}
  agsMes.forEach(a => {
    const srv = servicos.find(s => s.id === a.servicoId)
    const cat = srv?.cat || "Outra"
    recCat[cat] = (recCat[cat] || 0) + Number(a.valor || 0)
  })
  const pieData = Object.entries(recCat).map(([name, v]) => ({ name, v, color: CAT_COLORS_FIN[name] || C.textLight }))
  const totalPie = pieData.reduce((s, d) => s + d.v, 0) || 1

  // Transações do mês = agendamentos concluídos como entradas + gastos como saídas
  const transacoes = [
    ...agsMes.map(a => {
      const cli = clientes.find(c => c.id === a.clienteId)
      const srv = servicos.find(s => s.id === a.servicoId)
      return { id: `age-${a.id}`, desc: `${cli?.nome || "Cliente"} — ${srv?.nome || "Serviço"}`, tipo: "entrada", valor: Number(a.valor || 0), data: a.data }
    }),
    ...gastosMes.map(g => ({ id: `gasto-${g.id}`, desc: g.desc, tipo: "saida", valor: g.valor, data: g.data })),
  ].sort((a, b) => b.data.localeCompare(a.data))

  // Dados de gráfico por semana do mês atual
  const semanas = ["S1", "S2", "S3", "S4"]
  const entradasSem = semanas.map((_, i) => {
    const ini = i * 7 + 1, fim = ini + 6
    return agsMes.filter(a => { const d = parseInt(a.data.split("-")[2]); return d >= ini && d <= fim }).reduce((s, a) => s + Number(a.valor), 0)
  })
  const gastosSem = semanas.map((_, i) => {
    const ini = i * 7 + 1, fim = ini + 6
    return gastosMes.filter(g => { const d = parseInt(g.data.split("-")[2]); return d >= ini && d <= fim }).reduce((s, g) => s + g.valor, 0)
  })

  const MESES_OPTS = [
    ["2025-01","Janeiro"], ["2025-02","Fevereiro"], ["2025-03","Março"],
    ["2025-04","Abril"], ["2025-05","Maio"], ["2025-06","Junho"],
  ]

  const GASTO_CATS = ["Material", "Aluguel", "Sistema", "Transporte", "Marketing", "Outros"]

  const AbaBtn = ({ id, label }) => (
    <button onClick={() => setAbaAtiva(id)} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, border: `1px solid ${abaAtiva === id ? C.primary : C.border}`, background: abaAtiva === id ? C.primary : "#fff", color: abaAtiva === id ? "#fff" : C.textMid, cursor: "pointer", fontFamily: "inherit", fontWeight: abaAtiva === id ? 700 : 400 }}>{label}</button>
  )

  return (
    <div>
      <Topbar
        title="Financeiro"
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}
              style={{ ...css.input, width: "auto", fontSize: 13, padding: "6px 12px", height: "auto" }}>
              {MESES_OPTS.map(([v, l]) => <option key={v} value={v}>{l} 2025</option>)}
            </select>
          </div>
        }
      />

      <div style={{ padding: "20px 24px" }}>

        {/* ── MÉTRICAS REAIS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          {[
            { icon: "trending", label: "Receita do mês", value: `R$${receitaMes.toLocaleString("pt-BR")}`, sub: `${agsMes.length} atendimentos`, sc: C.green },
            { icon: "chart",    label: "Gastos do mês",  value: `R$${totalGastos.toLocaleString("pt-BR")}`, sub: `${gastosMes.length} lançamentos`, sc: C.red },
            { icon: "dollar",   label: "Lucro líquido",  value: `R$${lucro.toLocaleString("pt-BR")}`,      sub: `${margem}% de margem`, sc: lucro >= 0 ? C.green : C.red },
            { icon: "calendar", label: "Ticket médio",   value: agsMes.length > 0 ? `R$${Math.round(receitaMes / agsMes.length)}` : "—", sub: "por atendimento", sc: C.primary },
          ].map(({ icon, label, value, sub, sc }) => (
            <div key={label} style={{ ...css.card, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.textLight, marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>
                <Ico name={icon} size={12} color={C.primary} />{label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: sc, marginTop: 5, fontWeight: 600 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── ABAS ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <AbaBtn id="visao"       label="📊 Visão geral" />
          <AbaBtn id="transacoes"  label="↕ Transações" />
          <AbaBtn id="gastos"      label="📋 Gastos" />
        </div>

        {/* ── ABA: VISÃO GERAL ── */}
        {abaAtiva === "visao" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Gráfico de barras por semana */}
            <div style={css.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>
                Receita x Gastos — semanas de {MESES_OPTS.find(([v]) => v === filtroMes)?.[1]}
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 10, color: C.textLight, marginBottom: 2 }}>
                <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:C.primary, marginRight:4, verticalAlign:"middle" }}/>Receita</span>
                <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:C.primaryLight, border:`1px solid ${C.border}`, marginRight:4, verticalAlign:"middle" }}/>Gastos</span>
              </div>
              <FinBarChart entradas={entradasSem} gastos={gastosSem} labels={semanas} />
              {receitaMes === 0 && <div style={{ textAlign:"center", fontSize:12, color:C.textLight, paddingBottom:12 }}>Nenhum agendamento concluído neste mês ainda</div>}
            </div>

            {/* Donut por categoria */}
            <div style={css.card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Receita por categoria</div>
              {pieData.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2rem", color:C.textLight, fontSize:12 }}>Sem dados para este mês</div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                    <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 90, height: 90 }}>
                      {(() => {
                        let offset = 0
                        return pieData.map(d => {
                          const pct = (d.v / totalPie) * 100
                          const el = (
                            <circle key={d.name} cx="18" cy="18" r="13" fill="none" stroke={d.color} strokeWidth="6"
                              strokeDasharray={`${pct * 0.816} ${100 - pct * 0.816}`}
                              strokeDashoffset={-offset * 0.816} />
                          )
                          offset += pct
                          return el
                        })
                      })()}
                    </svg>
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:C.text }}>
                      {Math.round((pieData[0]?.v || 0) / totalPie * 100)}%
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {pieData.map(d => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 12, color: C.text, fontWeight: 600 }}>{d.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: d.color }}>R${d.v}</div>
                        <div style={{ fontSize: 10, color: C.textLight }}>{Math.round(d.v / totalPie * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resumo financeiro */}
            <div style={{ ...css.card, gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Resumo do mês</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Maior receita única", value: agsMes.length > 0 ? `R$${Math.max(...agsMes.map(a => a.valor))}` : "—", icon: "trending", color: C.green },
                  { label: "Maior gasto único", value: gastosMes.length > 0 ? `R$${Math.max(...gastosMes.map(g => g.valor))}` : "—", icon: "chart", color: C.red },
                  { label: "Dias com atendimento", value: [...new Set(agsMes.map(a => a.data))].length, icon: "calendar", color: C.primary },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} style={{ background: C.bg, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ico name={icon} size={16} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: C.textLight, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ABA: TRANSAÇÕES ── */}
        {abaAtiva === "transacoes" && (
          <div style={css.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                Todas as transações — {MESES_OPTS.find(([v]) => v === filtroMes)?.[1]}
              </div>
              <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <span style={{ color: C.green, fontWeight: 700 }}>+R${receitaMes.toLocaleString("pt-BR")} entradas</span>
                <span style={{ color: C.textLight }}>·</span>
                <span style={{ color: C.red, fontWeight: 700 }}>-R${totalGastos.toLocaleString("pt-BR")} saídas</span>
              </div>
            </div>

            {transacoes.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: C.textLight, fontSize: 13 }}>
                Nenhuma transação neste mês
              </div>
            )}

            {transacoes.map(t => {
              const dataFmt = t.data.split("-").reverse().join("/")
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: t.tipo === "entrada" ? C.greenBg : C.redBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Ico name={t.tipo === "entrada" ? "trending" : "chart"} size={15} color={t.tipo === "entrada" ? C.green : C.red} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>{dataFmt} · {t.tipo === "entrada" ? "Atendimento" : "Gasto"}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: t.tipo === "entrada" ? C.green : C.red, flexShrink: 0 }}>
                    {t.tipo === "entrada" ? "+" : "−"}R${t.valor.toLocaleString("pt-BR")}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── ABA: GASTOS ── */}
        {abaAtiva === "gastos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.textLight }}>
                {gastosMes.length} lançamentos · <span style={{ color: C.red, fontWeight: 700 }}>R${totalGastos.toLocaleString("pt-BR")} em gastos</span>
              </div>
              <button onClick={() => setShowGastoForm(s => !s)} style={css.btn()}>
                <Ico name={showGastoForm ? "x" : "plus"} size={13} /> {showGastoForm ? "Fechar" : "Lançar gasto"}
              </button>
            </div>

            {showGastoForm && (
              <div style={{ ...css.card, marginBottom: 16, border: `1px solid ${C.primary}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 14 }}>Novo gasto</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={css.label}>Descrição *</label>
                    <input style={css.input} placeholder="Ex: Material — cílios fio a fio" value={gastoForm.desc} onChange={e => setG("desc", e.target.value)} />
                  </div>
                  <div>
                    <label style={css.label}>Valor (R$) *</label>
                    <input type="number" style={css.input} placeholder="0,00" value={gastoForm.valor} onChange={e => setG("valor", e.target.value)} />
                  </div>
                  <div>
                    <label style={css.label}>Data</label>
                    <input type="date" style={css.input} value={gastoForm.data} onChange={e => setG("data", e.target.value)} />
                  </div>
                  <div>
                    <label style={css.label}>Categoria</label>
                    <select style={css.input} value={gastoForm.cat} onChange={e => setG("cat", e.target.value)}>
                      {GASTO_CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button onClick={() => setShowGastoForm(false)} style={css.btn("ghost")}>Cancelar</button>
                  <button onClick={addGasto} style={css.btn()}>
                    <Ico name="check" size={13} /> Salvar gasto
                  </button>
                </div>
              </div>
            )}

            <div style={css.card}>
              {gastosMes.length === 0 && (
                <div style={{ textAlign: "center", padding: "2rem", color: C.textLight, fontSize: 13 }}>
                  Nenhum gasto lançado neste mês ainda.<br />
                  <button onClick={() => setShowGastoForm(true)} style={{ ...css.btn(), margin: "12px auto 0", justifyContent: "center" }}>
                    <Ico name="plus" size={13} /> Lançar primeiro gasto
                  </button>
                </div>
              )}
              {gastosMes.map(g => {
                const dataFmt = g.data.split("-").reverse().join("/")
                return (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: C.redBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Ico name="chart" size={15} color={C.red} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{g.desc}</div>
                      <div style={{ fontSize: 11, color: C.textLight }}>{dataFmt} · <span style={{ background: C.bg, borderRadius: 6, padding: "1px 6px", fontWeight: 600 }}>{g.cat}</span></div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.red, flexShrink: 0 }}>
                      −R${g.valor.toLocaleString("pt-BR")}
                    </div>
                    {confirmGasto === g.id ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: C.red, fontWeight: 700 }}>Remover?</span>
                        <button onClick={() => removeGasto(g.id)} style={{ fontSize: 10, fontWeight: 700, background: C.red, color: "#fff", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Sim</button>
                        <button onClick={() => setConfirmGasto(null)} style={{ fontSize: 10, fontWeight: 700, background: C.bg, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Não</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmGasto(g.id)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Ico name="trash" size={12} color={C.red} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}


export default Financeiro
