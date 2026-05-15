import { createContext, useContext, useState, useMemo } from "react"

// ─── Estrutura de uma conta ────────────────────────────────────
// { id, email, senha, nome, negocio, profissao, telefone, cidade, instagram, foto }

const AuthContext = createContext(null)

const CONTAS_KEY = "femi-contas"
const SESSAO_KEY = "femi-sessao"

function carregarContas() {
  try { return JSON.parse(localStorage.getItem(CONTAS_KEY) || "[]") } catch { return [] }
}

function salvarContas(contas) {
  try { localStorage.setItem(CONTAS_KEY, JSON.stringify(contas)) } catch {}
}

function carregarSessao() {
  try { return localStorage.getItem(SESSAO_KEY) || null } catch { return null }
}

function salvarSessao(id) {
  try {
    if (id) localStorage.setItem(SESSAO_KEY, id)
    else localStorage.removeItem(SESSAO_KEY)
  } catch {}
}

export function AuthProvider({ children }) {
  const [contas,   setContasState] = useState(carregarContas)
  const [sessaoId, setSessaoId]    = useState(carregarSessao)

  const usuario = contas.find(c => c.id === sessaoId) || null

  // ── Helpers internos ──────────────────────────────────────
  const setContas = (novas) => {
    setContasState(novas)
    salvarContas(novas)
  }

  // ── Cadastro ──────────────────────────────────────────────
  const cadastrar = ({ nome, negocio, profissao, email, senha }) => {
    const atual = carregarContas()

    if (atual.find(c => c.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, erro: "Este e-mail já está cadastrado." }
    }
    if (senha.length < 6) {
      return { ok: false, erro: "A senha precisa ter pelo menos 6 caracteres." }
    }

    const nova = {
      id:        `u_${Date.now()}`,
      email:     email.toLowerCase().trim(),
      senha,
      nome:      nome.trim(),
      negocio:   negocio.trim() || nome.trim(),
      profissao: profissao.trim() || "Profissional da beleza",
      telefone:  "",
      cidade:    "",
      instagram: "",
      foto:      null,
      criadoEm:  new Date().toISOString(),
    }

    const novas = [...atual, nova]
    setContas(novas)
    setSessaoId(nova.id)
    salvarSessao(nova.id)
    return { ok: true }
  }

  // ── Login ─────────────────────────────────────────────────
  const entrar = ({ email, senha }) => {
    const atual = carregarContas()
    const conta = atual.find(
      c => c.email.toLowerCase() === email.toLowerCase().trim() && c.senha === senha
    )
    if (!conta) return { ok: false, erro: "E-mail ou senha incorretos." }

    setSessaoId(conta.id)
    salvarSessao(conta.id)
    return { ok: true }
  }

  // ── Logout ────────────────────────────────────────────────
  const sair = () => {
    setSessaoId(null)
    salvarSessao(null)
  }

  // ── Atualizar perfil (incluindo foto) ─────────────────────
  const atualizarPerfil = (dados) => {
    const atual = carregarContas()
    const novas = atual.map(c =>
      c.id === sessaoId ? { ...c, ...dados } : c
    )
    setContas(novas)
    // Atualiza o estado local imediatamente
    setContasState(novas)
  }

  // ── Alterar senha ─────────────────────────────────────────
  const alterarSenha = ({ senhaAtual, novaSenha }) => {
    if (usuario?.senha !== senhaAtual)
      return { ok: false, erro: "Senha atual incorreta." }
    if (novaSenha.length < 6)
      return { ok: false, erro: "A nova senha precisa ter pelo menos 6 caracteres." }

    atualizarPerfil({ senha: novaSenha })
    return { ok: true }
  }

  const value = useMemo(() => ({
    usuario,
    logado: !!usuario,
    cadastrar,
    entrar,
    sair,
    atualizarPerfil,
    alterarSenha,
  }), [usuario, sessaoId, contas])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve estar dentro de AuthProvider")
  return ctx
}
