import { formatarNumeroWpp, processarMensagem } from "../utils/helpers"

// ─── CONFIGURAÇÃO ─────────────────────────────────────────────
// Troque pelos seus valores após subir a Evolution API no Railway
const EVOLUTION_URL = import.meta.env.VITE_EVOLUTION_URL || ""
const EVOLUTION_KEY = import.meta.env.VITE_EVOLUTION_KEY || ""
const INSTANCE      = import.meta.env.VITE_EVOLUTION_INSTANCE || "femi-system"

// ─── BASE ─────────────────────────────────────────────────────
async function evolutionPost(endpoint, body) {
  if (!EVOLUTION_URL) throw new Error("VITE_EVOLUTION_URL não configurado")

  const res = await fetch(`${EVOLUTION_URL}${endpoint}`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey":       EVOLUTION_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Evolution API ${res.status}: ${err}`)
  }

  return res.json()
}

// ─── VERIFICAR CONEXÃO ────────────────────────────────────────
export async function verificarConexao() {
  try {
    const res  = await fetch(
      `${EVOLUTION_URL}/instance/connectionState/${INSTANCE}`,
      { headers: { apikey: EVOLUTION_KEY } }
    )
    const data = await res.json()
    return data.instance?.state === "open"
  } catch {
    return false
  }
}

/** URL do QR Code para exibir no browser */
export const getQrCodeUrl = () =>
  `${EVOLUTION_URL}/instance/qrcode/${INSTANCE}?image=true`

// ─── ENVIAR MENSAGEM RAW ──────────────────────────────────────
export async function enviarMensagem(wpp, texto) {
  const numero = formatarNumeroWpp(wpp)
  return evolutionPost(`/message/sendText/${INSTANCE}`, {
    number:      numero,
    textMessage: { text: texto },
  })
}

// ─── AUTOMAÇÕES PRONTAS ───────────────────────────────────────

/** Chamada logo após criar um agendamento */
export async function enviarConfirmacao(cliente, agendamento, servico) {
  const texto = processarMensagem(
    "Oi {nome}! ✅ Seu agendamento está confirmado:\n\n" +
    "📅 {data}\n⏰ {hora}\n💅 {servico}\n\n" +
    "Qualquer dúvida é só chamar! 🌸",
    {
      nome:    cliente.nome.split(" ")[0],
      data:    agendamento.data.split("-").reverse().join("/"),
      hora:    agendamento.hora,
      servico: servico.nome,
    }
  )
  return enviarMensagem(cliente.wpp, texto)
}

/** Lembrete 24h antes */
export async function enviarLembrete(cliente, agendamento, servico) {
  const texto = processarMensagem(
    "Olá {nome}! 🌸 Lembrando do seu agendamento *amanhã* às {hora}.\n" +
    "💅 {servico}\n\nResponda *SIM* para confirmar! 💕",
    {
      nome:    cliente.nome.split(" ")[0],
      hora:    agendamento.hora,
      servico: servico.nome,
    }
  )
  return enviarMensagem(cliente.wpp, texto)
}

/** Pós-atendimento — 2 dias depois */
export async function enviarPosAtendimento(cliente, servico) {
  const texto = processarMensagem(
    "Oi {nome}! 😍 Como estão seus {servico}?\n" +
    "Adoraria saber que ficou tudo perfeito! 💜",
    {
      nome:    cliente.nome.split(" ")[0],
      servico: servico.nome,
    }
  )
  return enviarMensagem(cliente.wpp, texto)
}

/** Reativação — 45+ dias sem visita */
export async function enviarReativacao(cliente) {
  const texto = processarMensagem(
    "Sentimos sua falta, {nome}! 💕\n" +
    "Que tal agendar um horário? Temos novidades te esperando! 🌸",
    { nome: cliente.nome.split(" ")[0] }
  )
  return enviarMensagem(cliente.wpp, texto)
}

/** Parabéns de aniversário */
export async function enviarAniversario(cliente) {
  const texto = processarMensagem(
    "Feliz aniversário, {nome}! 🎂🎉\n" +
    "Você ganhou *15% de desconto* no próximo serviço. Use até o fim do mês! 💜",
    { nome: cliente.nome.split(" ")[0] }
  )
  return enviarMensagem(cliente.wpp, texto)
}

/** Aviso de pontos acumulados */
export async function enviarAvisoPontos(cliente, pontos) {
  const texto = processarMensagem(
    "Oi {nome}! ⭐ Você acumulou {pontos} pontos!\n" +
    "Faltam {faltam} pts para sua recompensa. Continue assim! 💕",
    {
      nome:   cliente.nome.split(" ")[0],
      pontos: String(pontos),
      faltam: String(Math.max(0, 500 - pontos)),
    }
  )
  return enviarMensagem(cliente.wpp, texto)
}
