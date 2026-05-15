import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { C, css } from "../constants/theme"

export default function Login() {
  const { cadastrar, entrar } = useAuth()
  const [modo, setModo]       = useState("entrar") // "entrar" | "cadastrar"
  const [erro, setErro]       = useState("")
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nome: "", negocio: "", profissao: "", email: "", senha: "",
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro("")
    setLoading(true)

    await new Promise(r => setTimeout(r, 300)) // UX: pequeno delay

    const res = modo === "cadastrar"
      ? cadastrar(form)
      : entrar(form)

    if (!res.ok) setErro(res.erro)
    setLoading(false)
  }

  const inp = {
    ...css.input,
    padding: "12px 16px",
    fontSize: 14,
    borderRadius: 12,
    border: `1.5px solid ${C.border}`,
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, #ffeaf0 0%, #fff8f5 50%, #f9d7e2 100%)`,
      display: "grid", placeItems: "center", padding: 24,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 980,
        background: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        boxShadow: "0 32px 80px rgba(98,31,57,.16)",
      }}>

        {/* ── Lado esquerdo — hero ─────────────────────────── */}
        <div style={{
          background: `linear-gradient(160deg, #180b12 0%, #2e1019 55%, #5a2038 100%)`,
          padding: "52px 48px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* blobs decorativos */}
          <div style={{ position:"absolute", width:260, height:260, borderRadius:"50%",
            background:"rgba(181,65,106,.2)", bottom:-80, right:-80, pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:140, height:140, borderRadius:"50%",
            background:"rgba(255,255,255,.04)", top:40, right:20, pointerEvents:"none" }} />

          <div style={{ position: "relative" }}>
            {/* Logo */}
            <svg viewBox="0 0 180 60" width="180" style={{ marginBottom: 32 }} xmlns="http://www.w3.org/2000/svg">
              <text x="88" y="42" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="44" fontWeight="700" fontStyle="italic" fill="#fff">femi</text>
              <text x="88" y="56" textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="9" fontWeight="700" fill="#ff8db4" letterSpacing="6">system</text>
              <polygon points="162,8 164,14 170,16 164,18 162,24 160,18 154,16 160,14"
                fill="#ff8db4" opacity="0.9"/>
              <polygon points="20,20 21.5,25 27,27 21.5,29 20,34 18.5,29 13,27 18.5,25"
                fill="#ff8db4" opacity="0.6"/>
              <circle cx="11" cy="14" r="2" fill="#ff8db4" opacity="0.4"/>
            </svg>

            <p style={{ fontSize: 17, color: "#f0d6dc", lineHeight: 1.6, marginBottom: 36 }}>
              Sistema completo para profissionais da beleza — agenda, clientes, financeiro e muito mais.
            </p>

            {["Agenda inteligente", "Clientes por perfil", "Financeiro real", "Fidelidade e WhatsApp"].map(item => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 14, color: "#fff2f6",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  border: "1px solid #ff6f9d",
                  display: "grid", placeItems: "center",
                  color: "#ff8db4", fontSize: 12, flexShrink: 0,
                }}>✓</div>
                <span style={{ fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Lado direito — formulário ────────────────────── */}
        <div style={{
          padding: "52px 52px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          background: "linear-gradient(180deg, #fff 0%, #fff8fa 100%)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{
              fontSize: 32, color: C.primary,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic", fontWeight: 700, margin: 0,
            }}>
              {modo === "cadastrar" ? "Criar conta" : "Bem-vinda de volta!"}
            </h2>
            <p style={{ color: C.textLight, marginTop: 6, fontSize: 14 }}>
              {modo === "cadastrar"
                ? "Preencha os dados para começar"
                : "Entre para acessar seu painel"}
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            borderBottom: `2px solid ${C.border}`, marginBottom: 28,
          }}>
            {[["entrar","Entrar"], ["cadastrar","Criar conta"]].map(([m, l]) => (
              <button key={m} onClick={() => { setModo(m); setErro("") }} style={{
                padding: "12px 0", border: 0,
                borderBottom: modo === m ? `3px solid ${C.primary}` : "3px solid transparent",
                background: "transparent",
                color: modo === m ? C.primary : C.textLight,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                fontSize: 14, marginBottom: -2,
              }}>{l}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {modo === "cadastrar" && (
              <>
                <div>
                  <label style={css.label}>Seu nome *</label>
                  <input style={inp} placeholder="Ex: Gabriela Santos" required
                    value={form.nome} onChange={e => set("nome", e.target.value)} />
                </div>
                <div>
                  <label style={css.label}>Nome do studio / negócio</label>
                  <input style={inp} placeholder="Ex: Studio Gabi Beauty"
                    value={form.negocio} onChange={e => set("negocio", e.target.value)} />
                </div>
                <div>
                  <label style={css.label}>Profissão</label>
                  <input style={inp} placeholder="Ex: Lash Designer, Manicure..."
                    value={form.profissao} onChange={e => set("profissao", e.target.value)} />
                </div>
              </>
            )}

            <div>
              <label style={css.label}>E-mail *</label>
              <input style={inp} type="email" placeholder="seu@email.com" required
                value={form.email} onChange={e => set("email", e.target.value)} />
            </div>

            <div>
              <label style={css.label}>Senha * {modo === "cadastrar" && <span style={{ color: C.textLight, fontWeight: 400 }}>(mín. 6 caracteres)</span>}</label>
              <input style={inp} type="password" placeholder="••••••••" required
                value={form.senha} onChange={e => set("senha", e.target.value)} />
            </div>

            {erro && (
              <div style={{
                background: "#fff0f4", color: "#a51f4d",
                border: `1px solid #ffd1df`, borderRadius: 12,
                padding: "10px 14px", fontSize: 13, fontWeight: 500,
              }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...css.btn(),
                justifyContent: "center",
                padding: "14px 20px",
                fontSize: 15,
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Aguarde..." : modo === "cadastrar" ? "Criar minha conta" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
