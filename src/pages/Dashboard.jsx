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

function Dashboard() {
  const navigate = useNavigate()
  const { clientes, agendamentos, servicos, receitaMes, perfil } = useApp()
  const hoje = agendamentos.filter(a => a.data === TODAY)
  const hora = new Date().getHours()
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"
  const topClientes = [...clientes].sort((a, b) => b.pontos - a.pontos)

  // mini sparkline data simulado
  const sparkline = [38, 52, 45, 67, 58, 74, 82, 71, 88, 92, 85, receitaMes / 50]

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.sidebar} 0%, #3d1428 55%, ${C.primaryDark} 100%)`,
        padding: "28px 28px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative blobs */}
        <div style={{ position:"absolute", width:260, height:260, borderRadius:"50%", background:"rgba(181,65,106,.18)", top:-80, right:60, pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.04)", bottom:-40, left:180, pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"center", gap:18, position:"relative" }}>
          {/* Avatar grande */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{
              width: 72, height: 72, borderRadius:"50%",
              background: `linear-gradient(135deg, ${C.primary}, #ff6fa3)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize: 24, fontWeight: 800, color:"#fff",
              border:"3px solid rgba(255,255,255,.25)",
            }}>
              {initials(perfil?.negocio || perfil?.nome || "BS")}
            </div>
            <div style={{ position:"absolute", bottom:2, right:2, width:14, height:14, borderRadius:"50%", background:C.green, border:"2px solid #1e0c14" }} />
          </div>

          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", fontWeight:600, marginBottom:2 }}>
              {saudacao} ✨
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.1 }}>
              {perfil?.nome || "Gabriela Santos"}
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginTop:3 }}>
              {new Date(TODAY + "T12:00:00").toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })} · {hoje.filter(a=>a.status!=="cancel").length} atendimentos hoje
            </div>
          </div>

          {/* Receita destaque */}
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", fontWeight:600, marginBottom:2 }}>RECEITA DO MÊS</div>
            <div style={{ fontSize:30, fontWeight:800, color:"#fff", lineHeight:1 }}>
              R${receitaMes.toLocaleString("pt-BR")}
            </div>
            <div style={{ fontSize:11, color:C.green, fontWeight:600, marginTop:3 }}>▲ +18% vs abril</div>
            {/* sparkline */}
            <svg width={90} height={28} style={{ marginTop:6, opacity:0.6 }}>
              {sparkline.map((v, i) => {
                const max = Math.max(...sparkline)
                const x = (i / (sparkline.length - 1)) * 90
                const y = 28 - (v / max) * 24
                return i === 0 ? null : (
                  <line key={i}
                    x1={(( i-1)/(sparkline.length-1))*90} y1={28-(sparkline[i-1]/Math.max(...sparkline))*24}
                    x2={x} y2={y}
                    stroke="#ff8db4" strokeWidth={1.5} strokeLinecap="round" />
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* ── CARDS FLUTUANTES (sobrepostos ao banner) ── */}
      <div style={{ padding:"0 28px", marginTop:-52, position:"relative", zIndex:10 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { icon:"calendar", label:"Hoje", value: hoje.filter(a=>a.status!=="cancel").length, sub:"▲ +2 vs ontem", sc:C.green },
            { icon:"users", label:"Clientes ativas", value: clientes.length, sub:"▲ +3 novas", sc:C.green },
            { icon:"star", label:"Taxa de retorno", value:"87%", sub:"▼ -2% vs mês ant.", sc:C.red },
            { icon:"trending", label:"Serviços ativos", value: servicos.length, sub:"2 categorias +", sc:C.primary },
          ].map(({ icon, label, value, sub, sc }) => (
            <div key={label} style={{
              background:"#fff",
              borderRadius:16,
              padding:"16px 18px",
              boxShadow:"0 8px 32px rgba(46,16,25,.12)",
              border:`1px solid ${C.border}`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:C.textLight, marginBottom:8, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>
                <Ico name={icon} size={12} color={C.primary} />{label}
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:C.text, lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:11, color:sc, marginTop:5, fontWeight:600 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── LINHA PRINCIPAL ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1.05fr 0.95fr", gap:16, marginBottom:16 }}>

          {/* Card Agenda + Donut */}
          <div style={{ ...css.card, padding:0, overflow:"hidden" }}>
            {/* header colorido */}
            <div style={{ background:`linear-gradient(135deg, ${C.primaryLight}, #fff5f8)`, padding:"14px 18px 12px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Agenda de hoje</div>
              <button onClick={() => navigate("/agenda")} style={{ fontSize:11, color:C.primary, background:"none", border:`1px solid ${C.primaryMid}`, borderRadius:12, padding:"3px 10px", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Ver agenda →</button>
            </div>

            <div style={{ display:"flex", gap:0 }}>
              {/* lista */}
              <div style={{ flex:1, padding:"8px 0" }}>
                {hoje.length === 0 && (
                  <div style={{ padding:"2rem", textAlign:"center", color:C.textLight, fontSize:13 }}>Nenhum atendimento hoje</div>
                )}
                {hoje.map(a => {
                  const cli = clientes.find(c => c.id === a.clienteId)
                  const srv = servicos.find(s => s.id === a.servicoId)
                  const st = STATUS[a.status]
                  return (
                    <div key={a.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 18px", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ width:3, height:36, borderRadius:3, background:st?.color, flexShrink:0 }} />
                      <Avatar name={cli?.nome||""} size={32} fontSize={11} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{cli?.nome}</div>
                        <div style={{ fontSize:10, color:C.textLight }}>{a.hora} · {srv?.nome}</div>
                      </div>
                      <Badge status={a.status} />
                    </div>
                  )
                })}
              </div>

              {/* painel lateral com donut */}
              <div style={{ width:130, borderLeft:`1px solid ${C.border}`, padding:"20px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:14, background:"#fefafa" }}>
                <MiniDonut pct={87} size={82} stroke={9} color={C.primary} bg={C.primaryLight} label="Retorno" sublabel="taxa mensal" />
                <div style={{ width:"100%", borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                  {[["Concluídos", hoje.filter(a=>a.status==="done").length, C.green],
                    ["Próximos", hoje.filter(a=>a.status==="next").length, C.amber],
                    ["Cancelados", hoje.filter(a=>a.status==="cancel").length, C.red]
                  ].map(([l, v, cor]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ fontSize:10, color:C.textLight }}>{l}</div>
                      <div style={{ fontSize:12, fontWeight:800, color:cor }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insights da IA */}
          <div style={{ ...css.card, padding:0, overflow:"hidden" }}>
            <div style={{ background:`linear-gradient(135deg, #1e0c14, #3d1428)`, padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:"rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ico name="sparkles" size={14} color="#ff8db4" />
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Insights da IA</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.4)" }}>Atualizado agora</div>
              </div>
            </div>
            <div style={{ padding:"10px 16px" }}>
              {[
                { icon:"alert", color:C.amber, bg:C.amberBg, border:"#FAC775", title:"Atenção", text:"Beatriz Costa cancelou 3x em 2 meses. Confirme com 48h." },
                { icon:"sparkles", color:C.primary, bg:C.primaryLight, border:C.primaryMid, title:"Sugestão", text:"Quinta às 15h tem alta demanda. Abra mais 1 horário." },
                { icon:"trending", color:C.green, bg:C.greenBg, border:"#C0DD97", title:"Previsão", text:"Maio deve fechar em torno de R$4.100 no total." },
              ].map(({ icon, color, bg, border, title, text }, i) => (
                <div key={i} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:800, color, marginBottom:3, textTransform:"uppercase", letterSpacing:.4 }}>
                    <Ico name={icon} size={11} color={color} /> {title}
                  </div>
                  <div style={{ fontSize:12, color:C.text, lineHeight:1.5 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: Top Clientes + Mini Categorias ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>

          {/* Ranking clientes */}
          <div style={css.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, display:"flex", alignItems:"center", gap:6 }}>
                <Ico name="star" size={14} color={C.primary} /> Top clientes
              </div>
              <button onClick={() => navigate("/fidelidade")} style={{ fontSize:11, color:C.primary, background:"none", border:"none", cursor:"pointer", fontWeight:700 }}>Ver fidelidade →</button>
            </div>
            {topClientes.slice(0,4).map((c, i) => {
              const pct = Math.min(100, Math.round((c.pontos / 500) * 100))
              return (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:800, color: i===0?"#f5a623":i===1?"#9a9a9a":i===2?"#c9652a":C.textLight, width:20, textAlign:"center" }}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                  </div>
                  <Avatar name={c.nome} size={34} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{c.nome.split(" ")[0]}</div>
                      <div style={{ fontSize:11, fontWeight:800, color:C.primary }}>{c.pontos} pts</div>
                    </div>
                    <div style={{ height:5, background:C.primaryLight, borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${C.primary},#ff8db4)`, borderRadius:4 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Distribuição de serviços */}
          <div style={css.card}>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
              <Ico name="scissors" size={14} color={C.primary} /> Serviços mais realizados
            </div>
            <div style={{ display:"flex", justifyContent:"space-around", alignItems:"flex-end", marginBottom:16 }}>
              {[["Cílios",40,C.primary],["Sobrancelhas",21,C.primaryMid],["Unhas",29,"#f9a8c9"],["Outros",10,C.border]].map(([name, pct, color]) => (
                <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:C.text }}>{pct}%</div>
                  <div style={{ width:28, borderRadius:"4px 4px 0 0", background:color, height: pct * 1.8, minHeight:8 }} />
                  <div style={{ fontSize:10, color:C.textLight, fontWeight:600 }}>{name}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                ["Próximo atendimento", "14:00 · Juliana M.", C.amber],
                ["Melhor dia da semana", "Quinta-feira", C.green],
                ["Ticket médio", `R$${Math.round(receitaMes / Math.max(hoje.length,1) || 120)}`, C.primary],
                ["Clientes novas (mês)", "3", C.green],
              ].map(([l, v, cor]) => (
                <div key={l} style={{ background:C.bg, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:C.textLight, fontWeight:600 }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:cor, marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Dashboard
