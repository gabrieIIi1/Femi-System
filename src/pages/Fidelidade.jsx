import { useState, useEffect, useMemo } from "react"
import { useApp } from "../contexts/AppContext"
import { C, css, STATUS, STATUS_WPP, CAT_COLOR, CAT_COLORS_FIN } from "../constants/theme"
import { Ico, Avatar, Badge, MetricCard, Topbar, MiniDonut } from "../components/UI"
import { initials, fmtDur, fmtData, getWeekDates, getMonthDays, processarMensagem } from "../utils/helpers"
import { MESES, DIAS_SEMANA, HORAS_AGENDA, HORARIOS_BUSY, ORIGEM_OPTS, HORARIO_OPTS,
         PREFS_OPTS, SAUDE_OPTS, CATS_SERVICO, EMOJIS_SERVICO, GASTO_CATS, RECOMPENSAS,
         META_PONTOS, TODAY, AUTOMACOES_INIT } from "../constants/data"
import { useLocalStorage } from "../hooks/useLocalStorage"

function Fidelidade() {
  const { clientes, agendamentos } = useApp()

  // pontos editáveis por cliente (separado do state global para não conflitar)
  const [pontosExtra, setPontosExtra] = useLocalStorage("bf-pontos-fid", {})
  const [resgates, setResgates] = useLocalStorage("bf-resgates-fid", [])
  const [modalCliente, setModalCliente] = useState(null) // id do cliente aberto
  const [addPts, setAddPts] = useState("")
  const [motivoResgate, setMotivoResgate] = useState("15% de desconto")
  const [confirmDelete, setConfirmDelete] = useState(null) // id do resgate p/ remover

  // pontos reais = pontos base do cliente + extras manuais
  const getPontos = (c) => (c.pontos || 0) + (pontosExtra[c.id] || 0)

  // atendimentos reais do cliente
  const getAtendimentos = (cId) => agendamentos.filter(a => a.clienteId === cId && a.status === "done").length

  const sorted = [...clientes].sort((a, b) => getPontos(b) - getPontos(a))
  const totalPontos = clientes.reduce((s, c) => s + getPontos(c), 0)
  const resgatesMes = resgates.filter(r => r.data.startsWith("2025-05"))

  const RECOMPENSAS = ["15% de desconto", "Serviço grátis", "Brinde especial", "Frete grátis", "Voucher R$50"]
  const META = 500 // pontos para recompensa

  const handleAddPontos = (cId) => {
    const n = parseInt(addPts)
    if (!n || n <= 0) return
    setPontosExtra(p => ({ ...p, [cId]: (p[cId] || 0) + n }))
    setAddPts("")
  }

  const handleResgatar = (c) => {
    const pts = getPontos(c)
    if (pts < META) return
    const novo = { id: Date.now(), clienteId: c.id, clienteNome: c.nome, recompensa: motivoResgate, pontos: META, data: "2025-05-14" }
    setResgates(r => [novo, ...r])
    // debita os pontos
    setPontosExtra(p => ({ ...p, [c.id]: (p[c.id] || 0) - META }))
    setModalCliente(null)
  }

  const StatusPts = ({ c }) => {
    const pts = getPontos(c)
    const pct = Math.min(100, (pts % META) / (META / 100))
    const faltam = META - (pts % META)
    const prontos = pts >= META
    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.nome}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: prontos ? C.green : C.primary }}>{pts} pts</div>
        </div>
        <div style={{ background: C.border, borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 4 }}>
          <div style={{ height: "100%", background: prontos ? `linear-gradient(90deg,${C.green},#6ee7b7)` : `linear-gradient(90deg,${C.primary},#ff8db4)`, width: `${pct}%`, borderRadius: 4, transition: "width .5s" }} />
        </div>
        <div style={{ fontSize: 10, color: prontos ? C.green : C.textLight, fontWeight: prontos ? 700 : 400 }}>
          {prontos ? `✓ Pronta para resgatar! (${Math.floor(pts / META)}x recompensa disponível)` : `Faltam ${faltam} pts para recompensa`}
        </div>
      </div>
    )
  }

  const clienteModal = modalCliente ? clientes.find(c => c.id === modalCliente) : null
  const ptsModal = clienteModal ? getPontos(clienteModal) : 0

  return (
    <div>
      <Topbar title="Programa de Fidelidade" />
      <div style={{ padding: "20px 24px" }}>

        {/* Banner */}
        <div style={{ background: `linear-gradient(135deg, ${C.sidebar}, ${C.primaryDark})`, borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Total de pontos em circulação</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#f8bbd0", lineHeight: 1 }}>{totalPontos.toLocaleString("pt-BR")}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 6 }}>Regra: 100 pts/atendimento · {META} pts = recompensa</div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[["Clientes prontas", sorted.filter(c => getPontos(c) >= META).length, C.green],
                ["Resgates (mês)", resgatesMes.length, C.amber]].map(([l, v, cor]) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: cor, lineHeight: 1 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de cliente */}
        {clienteModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ ...css.card, width: 380, padding: "24px", position: "relative" }}>
              <button onClick={() => setModalCliente(null)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: C.textLight }}>
                <Ico name="x" size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <Avatar name={clienteModal.nome} size={44} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{clienteModal.nome}</div>
                  <div style={{ fontSize: 12, color: C.primary, fontWeight: 700 }}>{ptsModal} pontos acumulados</div>
                </div>
              </div>

              {/* Barra de progresso */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textLight, marginBottom: 6 }}>
                  <span>Progresso para recompensa</span>
                  <span>{ptsModal % META}/{META}</span>
                </div>
                <div style={{ background: C.border, borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: `linear-gradient(90deg,${C.primary},#ff8db4)`, width: `${Math.min(100,(ptsModal % META)/(META/100))}%`, borderRadius: 6, transition: "width .5s" }} />
                </div>
              </div>

              {/* Adicionar pontos manualmente */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 8 }}>Adicionar pontos manualmente</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" placeholder="Ex: 100" value={addPts} onChange={e => setAddPts(e.target.value)}
                    style={{ ...css.input, flex: 1 }} />
                  <button onClick={() => handleAddPontos(clienteModal.id)} style={css.btn()}>
                    <Ico name="plus" size={13} /> Adicionar
                  </button>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {[50, 100, 150, 200].map(n => (
                    <button key={n} onClick={() => { setAddPts(String(n)); }} style={css.pill(addPts === String(n))}>+{n}</button>
                  ))}
                </div>
              </div>

              {/* Resgatar */}
              {ptsModal >= META && (
                <div style={{ background: C.greenBg, border: `1px solid #C0DD97`, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#27500A", marginBottom: 10 }}>🎉 Pronta para resgatar!</div>
                  <select value={motivoResgate} onChange={e => setMotivoResgate(e.target.value)}
                    style={{ ...css.input, marginBottom: 10, fontSize: 13 }}>
                    {RECOMPENSAS.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <button onClick={() => handleResgatar(clienteModal)} style={{ ...css.btn(), width: "100%", justifyContent: "center", background: `linear-gradient(135deg,${C.green},#16a058)` }}>
                    <Ico name="gift" size={14} /> Resgatar {META} pts → {motivoResgate}
                  </button>
                </div>
              )}

              {/* Histórico de atendimentos */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.textLight, fontWeight: 700, marginBottom: 6 }}>Atendimentos confirmados: {getAtendimentos(clienteModal.id)}</div>
                {resgates.filter(r => r.clienteId === clienteModal.id).slice(0, 3).map(r => (
                  <div key={r.id} style={{ fontSize: 11, color: C.green, fontWeight: 600, marginBottom: 3 }}>
                    ✓ {r.recompensa} — {r.data.split("-").reverse().join("/")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ranking */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
          <div style={css.card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Ranking de clientes</div>
            {sorted.map((c, i) => {
              const pts = getPontos(c)
              const prontos = pts >= META
              return (
                <div key={c.id} onClick={() => setModalCliente(c.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 10px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: "transparent", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontSize: 14, width: 26, textAlign: "center" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span style={{ fontSize: 12, fontWeight: 700, color: C.textLight }}>#{i+1}</span>}
                  </div>
                  <Avatar name={c.nome} size={36} />
                  <StatusPts c={c} />
                  {prontos && (
                    <span style={{ fontSize: 10, background: C.greenBg, color: C.green, border: `1px solid #C0DD97`, borderRadius: 10, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      Resgatar
                    </span>
                  )}
                  <Ico name="chevRight" size={13} color={C.textLight} />
                </div>
              )
            })}
          </div>

          {/* Histórico de resgates */}
          <div style={css.card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Histórico de resgates</div>
            {resgates.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem 0", color: C.textLight, fontSize: 12 }}>
                Nenhum resgate ainda.<br />Clique em uma cliente para resgatar.
              </div>
            )}
            {resgates.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>🎁</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{r.clienteNome}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{r.recompensa}</div>
                  <div style={{ fontSize: 10, color: C.textLight }}>{r.data.split("-").reverse().join("/")} · −{r.pontos} pts</div>
                </div>
                <button onClick={() => setConfirmDelete(r.id)}
                  style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Ico name="x" size={11} color={C.red} />
                </button>
              </div>
            ))}

            {/* Confirmar remoção de resgate */}
            {confirmDelete && (
              <div style={{ marginTop: 12, background: C.redBg, border: `1px solid #f7c1c1`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 10 }}>Remover este resgate?</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmDelete(null)} style={css.btn("ghost")}>Cancelar</button>
                  <button onClick={() => { setResgates(r => r.filter(x => x.id !== confirmDelete)); setConfirmDelete(null) }}
                    style={{ ...css.btn(), background: C.red, boxShadow: "none" }}>
                    <Ico name="trash" size={13} /> Remover
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export default Fidelidade
