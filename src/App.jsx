import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { AppProvider } from "./contexts/AppContext"
import Sidebar      from "./components/Sidebar"
import Login        from "./pages/Login"
import Dashboard    from "./pages/Dashboard"
import Agenda       from "./pages/Agenda"
import Agendamento  from "./pages/Agendamento"
import Clientes     from "./pages/Clientes"
import NovaCliente  from "./pages/NovaCliente"
import Servicos     from "./pages/Servicos"
import Financeiro   from "./pages/Financeiro"
import Fidelidade   from "./pages/Fidelidade"
import WhatsApp     from "./pages/WhatsApp"
import Perfil       from "./pages/Perfil"

const PAGE_MAP = {
  dashboard:      Dashboard,
  agenda:         Agenda,
  agendamento:    Agendamento,
  clientes:       Clientes,
  "nova-cliente": NovaCliente,
  servicos:       Servicos,
  financeiro:     Financeiro,
  fidelidade:     Fidelidade,
  whatsapp:       WhatsApp,
  perfil:         Perfil,
}

function AppLayout() {
  const { usuario, logado } = useAuth()
  const [page, setPage] = useState("dashboard")

  if (!logado) return <Login />

  const PageComponent = PAGE_MAP[page] || Dashboard

  return (
    <AppProvider>
      <div style={{
        minHeight: "100vh",
        background: "#fff8fa",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}>
        <Sidebar page={page} setPage={setPage} perfil={usuario} />
        <main style={{ marginLeft: 200, minHeight: "100vh" }}>
          <PageComponent setPage={setPage} />
        </main>
      </div>
    </AppProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}
