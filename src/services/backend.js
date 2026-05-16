const DELAY = 180

const ACCOUNTS_KEY = "femi-contas"
const SESSION_KEY = "femi-sessao"

function wait(ms = DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function buildKey(uid, namespace) {
  return `femi:${uid}:${namespace}`
}

export async function getAccounts() {
  await wait(80)
  return loadJSON(ACCOUNTS_KEY, [])
}

export async function getSessionId() {
  await wait(40)
  return localStorage.getItem(SESSION_KEY)
}

export async function setSessionId(id) {
  await wait(40)
  if (id) localStorage.setItem(SESSION_KEY, id)
  else localStorage.removeItem(SESSION_KEY)
}

export async function login({ email, senha }) {
  await wait()
  const contas = loadJSON(ACCOUNTS_KEY, [])
  const conta = contas.find(c => c.email.toLowerCase() === email.toLowerCase().trim() && c.senha === senha)
  if (!conta) {
    return { ok: false, erro: "E-mail ou senha incorretos." }
  }
  await setSessionId(conta.id)
  return { ok: true, usuario: conta }
}

export async function register({ nome, negocio, profissao, email, senha }) {
  await wait()
  const contas = loadJSON(ACCOUNTS_KEY, [])
  if (contas.find(c => c.email.toLowerCase() === email.toLowerCase().trim())) {
    return { ok: false, erro: "Este e-mail já está cadastrado." }
  }
  if (senha.length < 6) {
    return { ok: false, erro: "A senha precisa ter pelo menos 6 caracteres." }
  }
  const nova = {
    id: `u_${Date.now()}`,
    email: email.toLowerCase().trim(),
    senha,
    nome: nome.trim(),
    negocio: negocio.trim() || nome.trim(),
    profissao: profissao.trim() || "Profissional da beleza",
    telefone: "",
    cidade: "",
    instagram: "",
    foto: null,
    criadoEm: new Date().toISOString(),
  }
  const novas = [...contas, nova]
  saveJSON(ACCOUNTS_KEY, novas)
  await setSessionId(nova.id)
  return { ok: true, usuario: nova }
}

export async function logout() {
  await wait(40)
  await setSessionId(null)
  return { ok: true }
}

export async function updateAccount(id, changes) {
  await wait(60)
  const contas = loadJSON(ACCOUNTS_KEY, [])
  const novas = contas.map(c => c.id === id ? { ...c, ...changes } : c)
  saveJSON(ACCOUNTS_KEY, novas)
  return novas.find(c => c.id === id) || null
}

export async function getUserData(uid, namespace, fallback) {
  await wait(80)
  return loadJSON(buildKey(uid, namespace), fallback)
}

export async function saveUserData(uid, namespace, data) {
  await wait(80)
  saveJSON(buildKey(uid, namespace), data)
  return { ok: true }
}
