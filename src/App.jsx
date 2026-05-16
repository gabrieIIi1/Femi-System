import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { AppProvider } from "./contexts/AppContext"
import Sidebar from "./components/Sidebar"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Agenda from "./pages/Agenda"
import Agendamento from "./pages/Agendamento"
import Clientes from "./pages/Clientes"
import NovaCliente from "./pages/NovaCliente"
import Servicos from "./pages/Servicos"
import Financeiro from "./pages/Financeiro"
import Fidelidade from "./pages/Fidelidade"
import WhatsApp from "./pages/WhatsApp"
import Perfil from "./pages/Perfil"

function AppRoutes() {
  const location = useLocation()
  return (
    <div className="route-page" style={{ minHeight: "100vh" }}>
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/nova-cliente" element={<NovaCliente />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/fidelidade" element={<Fidelidade />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

function ProtectedApp() {
  const { usuario, logado, ready } = useAuth()

  if (!ready) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Carregando...</div>
  }

  if (!logado) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppProvider>
      <div style={{ minHeight: "100vh", background: "#fff8fa", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <Sidebar perfil={usuario} />
        <main style={{ marginLeft: 200, minHeight: "100vh" }}>
          <AppRoutes />
        </main>
      </div>
    </AppProvider>
  )
}

function LoginRoute() {
  const { logado, ready } = useAuth()
  if (!ready) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>Carregando...</div>
  return logado ? <Navigate to="/dashboard" replace /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
