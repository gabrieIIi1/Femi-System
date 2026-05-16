# 🌸 FEMI System

Sistema de gestão para profissionais da beleza — agenda, clientes, financeiro, fidelidade e WhatsApp automático.

## Tecnologias

- **React 18** + **Vite**
- **React Router DOM v6** para navegação por rotas
- Autenticação simulada com `AuthContext`
- Estado do app persistido em **localStorage** via backend mock em `src/services/backend.js`
- Área administrativa com páginas de agenda, clientes, serviços, financeiro, fidelidade, WhatsApp e perfil

## Estrutura do projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── UI.jsx         # Avatar, Badge, MetricCard, Topbar, MiniDonut, Ico
│   └── Sidebar.jsx    # Navegação lateral
│
├── constants/         # Dados e tema centralizados
│   ├── theme.js       # Cores, estilos CSS-in-JS, STATUS
│   └── data.js        # Dados iniciais, opções de formulários
│
├── contexts/          # Providers de autenticação e app
│   ├── AuthContext.jsx # Login, registro, sessão e usuário
│   └── AppContext.jsx  # Estado global do app e persistência por usuário
│
├── hooks/
│   └── useLocalStorage.js  # Hook auxiliar de persistência local
│
├── pages/             # Páginas da aplicação
│   ├── Dashboard.jsx
│   ├── Agenda.jsx
│   ├── Agendamento.jsx
│   ├── Clientes.jsx
│   ├── NovaCliente.jsx
│   ├── Servicos.jsx
│   ├── Financeiro.jsx
│   ├── Fidelidade.jsx
│   ├── WhatsApp.jsx
│   ├── Perfil.jsx
│   └── Login.jsx
│
├── services/          # Simulação de backend local
│   ├── backend.js     # Armazenamento e sessão via localStorage
│   └── whatsapp.js    # Integração com Evolution API (opcional)
│
├── utils/             # Utilitários e formatos
│   └── helpers.js     # Funções de formatação e cálculo
│
├── App.jsx            # Roteamento e proteção de rotas
├── main.jsx           # Entry point
└── index.css          # Estilos globais
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador.

## Fluxo principal

- `Login`/`Registro` para iniciar sessão
- `Sidebar` para navegar entre páginas
- `AppContext` cuida do estado de:
  - clientes
  - agendamentos
  - serviços
  - gastos
  - automações
  - pontos de fidelidade
  - resgates
- Estado persistido por usuário em `localStorage`

## APIs e integrações

- `src/services/backend.js` responde como um backend mock usando `localStorage`
- `src/services/whatsapp.js` tem lógica para conectar à Evolution API (requere `.env`)

## Variáveis de ambiente (opcional)

Se usar o WhatsApp, adicione as variáveis no `.env`:

```env
VITE_EVOLUTION_URL=https://seu-projeto.up.railway.app
VITE_EVOLUTION_KEY=sua-chave-secreta
VITE_EVOLUTION_INSTANCE=femi-system
```

## Observações

- A aplicação é uma SPA com navegação por rotas, não usa navegação por estado interno de página
- Os dados persistem no navegador e são isolados por usuário autenticado
- O login e backend são simulados para ambiente de desenvolvimento

---

Desenvolvido com 🌸
