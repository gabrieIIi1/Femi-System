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

function Clientes() {
  const navigate = useNavigate()
  const { clientes } = useApp()
  const [busca, setBusca] = useState("")
  const [selected, setSelected] = useState(null)

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.wpp.includes(busca)
  )
  const cli = selected ? clientes.find(c => c.id === selected) : null

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: selected ? 320 : "100%", borderRight: selected ? `1px solid ${C.border}` : "none", display: "flex", flexDirection: "column" }}>
        <Topbar title={`Clientes (${clientes.length})`} action={
          <button onClick={() => navigate("/nova-cliente")} style={css.btn()}>
            <Ico name="plus" size={13} /> Nova cliente
          </button>
        } />
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px" }}>
            <Ico name="search" size={15} color={C.textLight} />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou WhatsApp..." style={{ border: "none", background: "transparent", fontSize: 13, color: C.text, outline: "none", flex: 1, fontFamily: "inherit" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelected(c.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: selected === c.id ? C.bg : "#fff", transition: "background .1s" }}>
              <Avatar name={c.nome} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.nome}</div>
                <div style={{ fontSize: 11, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.servicos?.join(", ")} · {c.wpp}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                {c.alergias?.length > 0 && <Ico name="alert" size={13} color={C.amber} />}
                <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: C.primary, fontWeight: 700 }}>
                  <Ico name="star" size={11} color={C.primary} />{c.pontos}
                </div>
              </div>
              <Ico name="chevRight" size={14} color={C.textLight} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: C.textLight }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div>Nenhuma cliente encontrada</div>
            </div>
          )}
        </div>
      </div>

      {cli && (
        <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
          <div style={{ padding: "14px 16px", background: "#fff", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Perfil da cliente</span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}><Ico name="x" size={18} /></button>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ ...css.card, textAlign: "center", marginBottom: 12 }}>
              <Avatar name={cli.nome} size={64} fontSize={20} />
              <div style={{ marginTop: 10, fontSize: 16, fontWeight: 700, color: C.text }}>{cli.nome}</div>
              <div style={{ fontSize: 12, color: C.textLight, marginBottom: 14 }}>Via {cli.origem}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                {[["pontos", "pontos"], ["atendimentos", "atend."]].map(([k, label]) => (
                  <div key={k} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{cli[k]}</div>
                    <div style={{ fontSize: 10, color: C.textLight, fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {[["📱 WhatsApp", cli.wpp], ["🎂 Nascimento", cli.nasc], ["📧 E-mail", cli.email], ["🕐 Horário", cli.horario], ["💼 Interesses", cli.servicos?.join(", ")]].map(([l, v]) => v && (
              <div key={l} style={{ ...css.card, marginBottom: 6, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.textMid, fontSize: 12, fontWeight: 600 }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{v}</span>
              </div>
            ))}

            {cli.alergias?.length > 0 && (
              <div style={{ background: C.amberBg, border: `1px solid #FAC775`, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Ico name="alert" size={14} color={C.amber} />
                <span style={{ fontSize: 12, color: "#7a4a08", fontWeight: 700 }}>Alergia: {cli.alergias.join(", ")}</span>
              </div>
            )}

            <button onClick={() => navigate("/agendamento")} style={{ ...css.btn(), width: "100%", justifyContent: "center", marginTop: 8 }}>
              <Ico name="plus" size={14} /> Agendar atendimento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


export default Clientes
