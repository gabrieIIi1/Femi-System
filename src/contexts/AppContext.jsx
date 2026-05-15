import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import {
  CLIENTES_INIT, SERVICOS_INIT, AGENDAMENTOS_INIT,
  GASTOS_INIT, AUTOMACOES_INIT,
} from "../constants/data"

const AppContext = createContext(null)

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r !== null ? JSON.parse(r) : fallback }
  catch { return fallback }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function AppProvider({ children }) {
  const { usuario } = useAuth()
  const uid = usuario?.id || "demo"
  const k = (n) => `femi:${uid}:${n}`

  const [clientes,     setClientes]     = useState(() => load(k("clientes"),     CLIENTES_INIT))
  const [servicos,     setServicos]     = useState(() => load(k("servicos"),     SERVICOS_INIT))
  const [agendamentos, setAgendamentos] = useState(() => load(k("agendamentos"), AGENDAMENTOS_INIT))
  const [gastos,       setGastos]       = useState(() => load(k("gastos"),       GASTOS_INIT))
  const [automacoes,   setAutomacoes]   = useState(() => load(k("automacoes"),   AUTOMACOES_INIT))
  const [pontosExtra,  setPontosExtra]  = useState(() => load(k("pontos"),       {}))
  const [resgates,     setResgates]     = useState(() => load(k("resgates"),     []))

  // Recarrega dados quando usuário muda (login/logout/troca de conta)
  useEffect(() => {
    setClientes    (load(k("clientes"),     CLIENTES_INIT))
    setServicos    (load(k("servicos"),     SERVICOS_INIT))
    setAgendamentos(load(k("agendamentos"), AGENDAMENTOS_INIT))
    setGastos      (load(k("gastos"),       GASTOS_INIT))
    setAutomacoes  (load(k("automacoes"),   AUTOMACOES_INIT))
    setPontosExtra (load(k("pontos"),       {}))
    setResgates    (load(k("resgates"),     []))
  }, [uid])

  // Persiste ao alterar
  useEffect(() => { save(k("clientes"),     clientes)     }, [clientes,     uid])
  useEffect(() => { save(k("servicos"),     servicos)     }, [servicos,     uid])
  useEffect(() => { save(k("agendamentos"), agendamentos) }, [agendamentos, uid])
  useEffect(() => { save(k("gastos"),       gastos)       }, [gastos,       uid])
  useEffect(() => { save(k("automacoes"),   automacoes)   }, [automacoes,   uid])
  useEffect(() => { save(k("pontos"),       pontosExtra)  }, [pontosExtra,  uid])
  useEffect(() => { save(k("resgates"),     resgates)     }, [resgates,     uid])

  const addCliente      = (c) => setClientes(p => [...p, { ...c, id: Date.now(), pontos: 0, atendimentos: 0 }])
  const updateCliente   = (id, ch) => setClientes(p => p.map(c => c.id === id ? { ...c, ...ch } : c))
  const removeCliente   = (id) => setClientes(p => p.filter(c => c.id !== id))
  const addServico      = (s) => setServicos(p => [...p, { ...s, id: Date.now() }])
  const removeServico   = (id) => setServicos(p => p.filter(s => s.id !== id))
  const addAgendamento  = (a) => setAgendamentos(p => [...p, { ...a, id: Date.now(), status: "next" }])
  const updateAgendamento = (id, ch) => setAgendamentos(p => p.map(a => a.id === id ? { ...a, ...ch } : a))
  const addGasto        = (g) => setGastos(p => [{ ...g, id: Date.now() }, ...p])
  const removeGasto     = (id) => setGastos(p => p.filter(g => g.id !== id))
  const updateAutomacao = (id, ch) => setAutomacoes(p => p.map(a => a.id === id ? { ...a, ...ch } : a))

  const getPontos = (cId) => (clientes.find(c => c.id === cId)?.pontos || 0) + (pontosExtra[cId] || 0)
  const addPontosCliente = (cId, qtd) => setPontosExtra(p => ({ ...p, [cId]: (p[cId] || 0) + qtd }))
  const resgatarPontos = (cliente, recompensa, meta = 500) => {
    setResgates(p => [{ id: Date.now(), clienteId: cliente.id, clienteNome: cliente.nome,
      recompensa, pontos: meta, data: new Date().toISOString().split("T")[0] }, ...p])
    addPontosCliente(cliente.id, -meta)
  }
  const removeResgate = (id) => setResgates(p => p.filter(r => r.id !== id))

  const mesAtual = new Date().toISOString().slice(0, 7)
  const receitaMes = useMemo(() =>
    agendamentos.filter(a => a.status !== "cancel" && a.data.startsWith(mesAtual))
      .reduce((s, a) => s + Number(a.valor || 0), 0),
    [agendamentos, mesAtual]
  )

  const value = useMemo(() => ({
    clientes, servicos, agendamentos, gastos, automacoes, pontosExtra, resgates, receitaMes,
    addCliente, updateCliente, removeCliente, addServico, removeServico,
    addAgendamento, updateAgendamento, addGasto, removeGasto,
    getPontos, addPontosCliente, resgatarPontos, removeResgate,
    updateAutomacao, setAutomacoes,
  }), [clientes, servicos, agendamentos, gastos, automacoes, pontosExtra, resgates, receitaMes])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp deve estar dentro de AppProvider")
  return ctx
}
