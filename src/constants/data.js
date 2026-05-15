// ─── DATA FIXA ────────────────────────────────────────────────
export const TODAY = "2025-05-14"

export const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
]

export const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

export const HORAS_AGENDA = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00","19:00",
]

export const HORARIOS_BUSY = ["08:00","11:30","16:00"]

// ─── OPÇÕES DE FORMULÁRIOS ─────────────────────────────────────
export const ORIGEM_OPTS   = ["Instagram","Indicação","Google","TikTok","Passou na rua","Outro"]
export const HORARIO_OPTS  = ["Manhã","Tarde","Noite","Fins de semana"]
export const PREFS_OPTS    = ["💅 Unhas","✂️ Sobrancelhas","🌸 Cílios","🧴 Estética","💇 Cabelo","🦋 Laminação"]
export const SAUDE_OPTS    = ["Diabetes","Gestante","Pressão alta","Pele sensível","Fungos nas unhas"]
export const CATS_SERVICO  = ["Unhas","Sobrancelhas","Cílios","Cabelo","Estética","Outra"]
export const EMOJIS_SERVICO = ["💅","✂️","🌸","💜","✨","🦋","💎","🌿","🧴","🔥","💇","🪮","👁️","🫧"]
export const GASTO_CATS    = ["Material","Aluguel","Sistema","Transporte","Marketing","Outros"]
export const RECOMPENSAS   = ["15% de desconto","Serviço grátis","Brinde especial","Voucher R$50"]
export const META_PONTOS   = 500

// ─── DADOS INICIAIS ────────────────────────────────────────────
export const CLIENTES_INIT = [
  { id:1, nome:"Ana Souza",       wpp:"(41) 98888-1111", nasc:"15/03/1992", email:"ana@email.com",   origem:"Instagram", alergias:["látex"], servicos:["Cílios"],       horario:"Manhã", pontos:480, atendimentos:12 },
  { id:2, nome:"Carla Lima",      wpp:"(41) 97777-2222", nasc:"22/07/1989", email:"carla@email.com", origem:"Indicação", alergias:[],         servicos:["Sobrancelhas"], horario:"Tarde", pontos:320, atendimentos:8  },
  { id:3, nome:"Juliana Martins", wpp:"(41) 96666-3333", nasc:"08/11/1995", email:"ju@email.com",    origem:"Google",    alergias:[],         servicos:["Cílios"],       horario:"Tarde", pontos:210, atendimentos:5  },
  { id:4, nome:"Fernanda Rocha",  wpp:"(41) 95555-4444", nasc:"01/04/1993", email:"fer@email.com",   origem:"TikTok",    alergias:["Nichel"], servicos:["Unhas"],        horario:"Noite", pontos:150, atendimentos:3  },
]

export const SERVICOS_INIT = [
  { id:1, emoji:"🌸", nome:"Volume brasileiro",      cat:"Cílios",       preco:150, dur:90,  desc:"Extensão com efeito natural"  },
  { id:2, emoji:"💜", nome:"Volume russo",            cat:"Cílios",       preco:180, dur:120, desc:"Mais volume e definição"       },
  { id:3, emoji:"✂️", nome:"Design de sobrancelha",  cat:"Sobrancelhas", preco:55,  dur:30,  desc:"Mapeamento + design"           },
  { id:4, emoji:"💅", nome:"Manicure completa",       cat:"Unhas",        preco:45,  dur:45,  desc:"Esmaltação tradicional"        },
  { id:5, emoji:"✨", nome:"Laminação de sobrancelha",cat:"Sobrancelhas", preco:85,  dur:50,  desc:"Alinhamento + hidratação"      },
]

export const AGENDAMENTOS_INIT = [
  { id:1, clienteId:1, servicoId:1, data:"2025-05-14", hora:"09:00", status:"done", valor:150 },
  { id:2, clienteId:2, servicoId:3, data:"2025-05-14", hora:"11:30", status:"done", valor:55  },
  { id:3, clienteId:3, servicoId:2, data:"2025-05-14", hora:"14:00", status:"next", valor:180 },
  { id:4, clienteId:4, servicoId:4, data:"2025-05-15", hora:"10:00", status:"next", valor:45  },
  { id:5, clienteId:1, servicoId:5, data:"2025-05-15", hora:"13:00", status:"next", valor:85  },
]

export const GASTOS_INIT = [
  { id:1, desc:"Material — Cílios",    valor:180, data:"2025-05-13", cat:"Material" },
  { id:2, desc:"Material — Unhas gel", valor:95,  data:"2025-05-12", cat:"Material" },
  { id:3, desc:"Taxa sistema",         valor:49,  data:"2025-05-01", cat:"Sistema"  },
  { id:4, desc:"Aluguel sala",         valor:300, data:"2025-05-01", cat:"Aluguel"  },
]

export const PERFIL_INIT = {
  nome:      "Gabriela Santos",
  negocio:   "FEMI Studio",
  profissao: "Lash Designer",
  telefone:  "(41) 99876-5432",
  cidade:    "Curitiba/PR",
  instagram: "@beautygs",
}

export const AUTOMACOES_INIT = [
  { id:1, title:"Lembrete 24h antes",           mensagem:"Olá {nome}! 🌸 Lembrando do seu agendamento amanhã às {hora} ({servico}). Confirme respondendo SIM! 💕",       status:"ativo",    tipo:"lembrete"     },
  { id:2, title:"Confirmação de agendamento",   mensagem:"Oi {nome}! ✅ Seu agendamento foi confirmado para {data} às {hora}. Qualquer dúvida é só chamar! 🌸",          status:"ativo",    tipo:"confirmacao"  },
  { id:3, title:"Reativação — 45 dias sem visita", mensagem:"Sentimos sua falta, {nome}! 💕 Que tal agendar um horário? Temos novidades te esperando! 🌸",              status:"agendado", tipo:"reativacao"   },
  { id:4, title:"Pós-atendimento (2 dias depois)", mensagem:"Oi {nome}! 😍 Como estão seus {servico}? Me conta! 💜",                                                     status:"ativo",    tipo:"pos"          },
  { id:5, title:"Promoção aniversariante",      mensagem:"Feliz aniversário, {nome}! 🎂 Você ganhou 15% de desconto no próximo serviço. Use até o fim do mês! 💜",       status:"pausado",  tipo:"aniversario"  },
]
