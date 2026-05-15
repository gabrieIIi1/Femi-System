# 🌸 FEMI System

Sistema de gestão para profissionais da beleza — agenda, clientes, financeiro, fidelidade e WhatsApp automático.

## Tecnologias

- **React 18** + **Vite**
- Estado persistido no **localStorage** (sem backend)
- Ícones SVG inline (sem dependência externa)
- WhatsApp via **Evolution API** (opcional)

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
├── contexts/
│   └── AppContext.jsx  # Estado global (clientes, agendamentos, etc.)
│
├── hooks/
│   └── useLocalStorage.js  # Hook de persistência
│
├── pages/             # Uma página por arquivo
│   ├── Dashboard.jsx
│   ├── Agenda.jsx
│   ├── Agendamento.jsx
│   ├── Clientes.jsx
│   ├── NovaCliente.jsx
│   ├── Servicos.jsx
│   ├── Financeiro.jsx
│   ├── Fidelidade.jsx
│   ├── WhatsApp.jsx
│   └── Perfil.jsx
│
├── services/
│   └── whatsapp.js    # Integração Evolution API
│
├── utils/
│   └── helpers.js     # Funções puras (formatação, calendário, etc.)
│
├── App.jsx            # Roteador principal
├── main.jsx           # Entry point
└── index.css          # Estilos globais
```

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente (opcional — só necessário para WhatsApp)
cp .env.example .env

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

O app abre em `http://localhost:5173`

## WhatsApp (opcional)

Siga o guia em `docs/guia-whatsapp.md` para configurar a Evolution API no Railway e habilitar envio real de mensagens.

Após configurar, edite o `.env`:
```
VITE_EVOLUTION_URL      = https://seu-projeto.up.railway.app
VITE_EVOLUTION_KEY      = sua-chave-secreta
VITE_EVOLUTION_INSTANCE = femi-system
```

## Deploy

O projeto pode ser hospedado em qualquer serviço de hosting estático:
- **Vercel** (recomendado) — `vercel deploy`
- **Netlify** — arrasta a pasta `dist/`
- **Railway** — via Dockerfile ou buildpack Node

---

Desenvolvido com 🌸
