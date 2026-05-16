import { createContext, useContext, useState, useMemo, useEffect } from "react"
import { getAccounts, getSessionId, login, register, logout, updateAccount } from "../services/backend"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [contas, setContasState] = useState([])
  const [sessaoId, setSessaoId] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const [accounts, sessionId] = await Promise.all([getAccounts(), getSessionId()])
      if (!active) return
      setContasState(accounts)
      setSessaoId(sessionId)
      setReady(true)
    }
    load()
    return () => { active = false }
  }, [])

  const usuario = contas.find(c => c.id === sessaoId) || null

  const cadastrar = async ({ nome, negocio, profissao, email, senha }) => {
    const res = await register({ nome, negocio, profissao, email, senha })
    if (!res.ok) return res
    const [accounts, sessionId] = await Promise.all([getAccounts(), getSessionId()])
    setContasState(accounts)
    setSessaoId(sessionId)
    return { ok: true }
  }

  const entrar = async ({ email, senha }) => {
    const res = await login({ email, senha })
    if (!res.ok) return res
    const [accounts, sessionId] = await Promise.all([getAccounts(), getSessionId()])
    setContasState(accounts)
    setSessaoId(sessionId)
    return { ok: true }
  }

  const sair = async () => {
    await logout()
    setSessaoId(null)
  }

  const atualizarPerfil = async (dados) => {
    if (!sessaoId) return null
    const updated = await updateAccount(sessaoId, dados)
    setContasState(prev => prev.map(c => c.id === sessaoId ? updated : c))
    return updated
  }

  const alterarSenha = async ({ senhaAtual, novaSenha }) => {
    if (usuario?.senha !== senhaAtual)
      return { ok: false, erro: "Senha atual incorreta." }
    if (novaSenha.length < 6)
      return { ok: false, erro: "A nova senha precisa ter pelo menos 6 caracteres." };

    await updateAccount(sessaoId, { senha: novaSenha })
    setContasState(prev => prev.map(c => c.id === sessaoId ? { ...c, senha: novaSenha } : c))
    return { ok: true }
  }

  const value = useMemo(() => ({
    usuario,
    logado: !!usuario,
    ready,
    cadastrar,
    entrar,
    sair,
    atualizarPerfil,
    alterarSenha,
  }), [usuario, ready])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve estar dentro de AuthProvider")
  return ctx
}
