import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { getUserData, saveUserData } from "../services/backend"
import {
  CLIENTES_INIT, SERVICOS_INIT, AGENDAMENTOS_INIT,
  GASTOS_INIT, AUTOMACOES_INIT,
} from "../constants/data"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { usuario } = useAuth()
  const uid = usuario?.id

  const [clientes, setClientes] = useState(CLIENTES_INIT)
  const [servicos, setServicos] = useState(SERVICOS_INIT)
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INIT)
  const [gastos, setGastos] = useState(GASTOS_INIT)
  const [automacoes, setAutomacoes] = useState(AUTOMACOES_INIT)
  const [pontosExtra, setPontosExtra] = useState({})
  const [resgates, setResgates] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!uid) return
    let active = true
    setLoaded(false)
    async function load() {
      const [clientesData, servicosData, agendamentosData, gastosData, automacoesData, pontosData, resgatesData] = await Promise.all([
        getUserData(uid, "clientes", CLIENTES_INIT),
        getUserData(uid, "servicos", SERVICOS_INIT),
        getUserData(uid, "agendamentos", AGENDAMENTOS_INIT),
        getUserData(uid, "gastos", GASTOS_INIT),
        getUserData(uid, "automacoes", AUTOMACOES_INIT),
        getUserData(uid, "pontos", {}),
        getUserData(uid, "resgates", []),
      ])
      if (!active) return
      setClientes(clientesData)
      setServicos(servicosData)
      setAgendamentos(agendamentosData)
      setGastos(gastosData)
      setAutomacoes(automacoesData)
      setPontosExtra(pontosData)
      setResgates(resgatesData)
      setLoaded(true)
    }
    load()
    return () => { active = false }
  }, [uid])

  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "clientes", clientes)
  }, [uid, clientes, loaded])
  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "servicos", servicos)
  }, [uid, servicos, loaded])
  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "agendamentos", agendamentos)
  }, [uid, agendamentos, loaded])
  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "gastos", gastos)
  }, [uid, gastos, loaded])
  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "automacoes", automacoes)
  }, [uid, automacoes, loaded])
  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "pontos", pontosExtra)
  }, [uid, pontosExtra, loaded])
  useEffect(() => {
    if (!uid || !loaded) return
    saveUserData(uid, "resgates", resgates)
  }, [uid, resgates, loaded])

  const addCliente = (c) => setClientes(p => [...p, { ...c, id: Date.now(), pontos: 0, atendimentos: 0 }])
  const updateCliente = (id, ch) => setClientes(p => p.map(c => c.id === id ? { ...c, ...ch } : c))
  const removeCliente = (id) => setClientes(p => p.filter(c => c.id !== id))
  const addServico = (s) => setServicos(p => [...p, { ...s, id: Date.now() }])
  const removeServico = (id) => setServicos(p => p.filter(s => s.id !== id))
  const addAgendamento = (a) => setAgendamentos(p => [...p, { ...a, id: Date.now(), status: "next" }])
  const updateAgendamento = (id, ch) => setAgendamentos(p => p.map(a => a.id === id ? { ...a, ...ch } : a))
  const removeAgendamento = (id) => setAgendamentos(p => p.filter(a => a.id !== id))
  const addGasto = (g) => setGastos(p => [{ ...g, id: Date.now() }, ...p])
  const removeGasto = (id) => setGastos(p => p.filter(g => g.id !== id))
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
    addAgendamento, updateAgendamento, removeAgendamento, addGasto, removeGasto,
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
