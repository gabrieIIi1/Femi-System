import { NavLink } from "react-router-dom"
import { C } from "../constants/theme"
import { Ico } from "./UI"
import { initials } from "../utils/helpers"
import { useAuth } from "../contexts/AuthContext"

const LINKS = [
  { to: "/dashboard", icon: "home", label: "Dashboard" },
  { to: "/agenda", icon: "calendar", label: "Agenda" },
  { to: "/clientes", icon: "users", label: "Clientes" },
  { to: "/servicos", icon: "scissors", label: "Serviços" },
  { to: "/financeiro", icon: "chart", label: "Financeiro" },
  { to: "/fidelidade", icon: "star", label: "Fidelidade" },
  { to: "/whatsapp", icon: "message", label: "WhatsApp" },
  { to: "/perfil", icon: "user", label: "Meu perfil" },
]

function FemiLogo() {
  return (
    <svg viewBox="0 0 168 56" width="168" height="56" xmlns="http://www.w3.org/2000/svg">
      <text x="82" y="36" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="38" fontWeight="700" fontStyle="italic" fill="#fff">femi</text>
      <text x="82" y="50" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="8" fontWeight="700" fill="#ff8db4" letterSpacing="5">system</text>
      <polygon points="152,8 153.8,13.2 159,15 153.8,16.8 152,22 150.2,16.8 145,15 150.2,13.2" fill="#ff8db4" opacity="0.9" />
      <polygon points="16,18 17,21 20,22 17,23 16,26 15,23 12,22 15,21" fill="#ff8db4" opacity="0.6" />
      <circle cx="10" cy="12" r="1.8" fill="#ff8db4" opacity="0.4" />
      <circle cx="158" cy="28" r="1.4" fill="#ff8db4" opacity="0.4" />
    </svg>
  )
}

export default function Sidebar({ perfil }) {
  const { sair } = useAuth()
  return (
    <aside style={{
      width: 200, background: C.sidebar,
      display: "flex", flexDirection: "column",
      height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 50,
    }}>
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <FemiLogo />
      </div>

      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {LINKS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 10, margin: "2px 0",
              fontSize: 13, textAlign: "left", border: "none",
              background: isActive ? C.primary : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,.55)",
              cursor: "pointer", fontFamily: "inherit",
              fontWeight: isActive ? 600 : 400, transition: "all .15s",
              textDecoration: "none",
            })}
          >
            <Ico name={icon} size={15} color={({ isActive }) => (isActive ? "#fff" : "rgba(255,255,255,.55)")} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "6px" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: perfil?.foto ? "transparent" : C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>
            {perfil?.foto ? <img src={perfil.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(perfil?.negocio || perfil?.nome || "F")}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {perfil?.negocio || "FEMI Studio"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>Plano Free</div>
          </div>
        </div>

        <button
          onClick={sair}
          style={{
            width: "100%", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.5)", borderRadius: 10, padding: "8px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit",
          }}
        >
          <Ico name="logout" size={13} /> Sair
        </button>
      </div>
    </aside>
  )
}
