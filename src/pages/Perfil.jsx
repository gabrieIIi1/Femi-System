import { useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useApp } from "../contexts/AppContext"
import { C, css } from "../constants/theme"
import { Ico, Topbar } from "../components/UI"

export default function Perfil() {
  const { usuario, atualizarPerfil, alterarSenha, sair } = useAuth()
  const { clientes, agendamentos, receitaMes } = useApp()

  const [form, setForm]           = useState({ ...usuario })
  const [salvo, setSalvo]         = useState(false)
  const [erroSenha, setErroSenha] = useState("")
  const [okSenha, setOkSenha]     = useState(false)
  const [senhas, setSenhas]       = useState({ atual: "", nova: "", confirmar: "" })
  const [abaAtiva, setAbaAtiva]   = useState("dados")
  const fileRef = useRef()

  const set      = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setSenha = (k, v) => setSenhas(s => ({ ...s, [k]: v }))

  const handleFoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert("Imagem máximo 2MB."); return }
    const reader = new FileReader()
    reader.onload = (ev) => setForm(f => ({ ...f, foto: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleSalvar = (e) => {
    e.preventDefault()
    atualizarPerfil({ nome:form.nome, negocio:form.negocio, profissao:form.profissao,
      telefone:form.telefone, cidade:form.cidade, instagram:form.instagram, foto:form.foto })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  const handleSenha = (e) => {
    e.preventDefault()
    setErroSenha(""); setOkSenha(false)
    if (senhas.nova !== senhas.confirmar) { setErroSenha("As senhas novas não coincidem."); return }
    const res = alterarSenha({ senhaAtual: senhas.atual, novaSenha: senhas.nova })
    if (!res.ok) { setErroSenha(res.erro); return }
    setOkSenha(true)
    setSenhas({ atual: "", nova: "", confirmar: "" })
    setTimeout(() => setOkSenha(false), 2500)
  }

  const mesAtual = new Date().toISOString().slice(0, 7)
  const stats = [
    { label:"Clientes",         value:clientes.length, icon:"users",    color:C.primary },
    { label:"Atendimentos/mês", value:agendamentos.filter(a=>a.data.startsWith(mesAtual)&&a.status!=="cancel").length, icon:"calendar", color:C.green },
    { label:"Receita do mês",   value:`R$${receitaMes.toLocaleString("pt-BR")}`, icon:"trending", color:C.amber },
    { label:"Taxa de retorno",  value:"87%", icon:"star", color:"#9c5cc5" },
  ]

  const AbaBtn = ({ id, label }) => (
    <button onClick={() => setAbaAtiva(id)} style={{
      padding:"8px 20px", borderRadius:10, fontSize:13, fontFamily:"inherit",
      border:`1px solid ${abaAtiva===id?C.primary:C.border}`,
      background:abaAtiva===id?C.primary:"#fff",
      color:abaAtiva===id?"#fff":C.textMid,
      fontWeight:abaAtiva===id?700:400, cursor:"pointer",
    }}>{label}</button>
  )

  const fotoEl = (size, fontSize) => (
    <div style={{ width:size, height:size, borderRadius:"50%",
      background:form.foto?"transparent":`linear-gradient(135deg,${C.primary},#ff6fa3)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize, fontWeight:800, color:"#fff",
      border:"4px solid rgba(255,255,255,.2)", overflow:"hidden" }}>
      {form.foto
        ? <img src={form.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        : (form.nome||"F").charAt(0).toUpperCase()}
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <div style={{
        background:`linear-gradient(135deg,${C.sidebar} 0%,#3d1428 60%,${C.primaryDark} 100%)`,
        padding:"32px 28px 90px", position:"relative", overflow:"hidden",
      }}>
        <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",
          background:"rgba(181,65,106,.15)",top:-100,right:-60,pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"flex-end",gap:22,position:"relative"}}>
          <div style={{position:"relative",flexShrink:0,cursor:"pointer"}} onClick={()=>fileRef.current?.click()}>
            {fotoEl(90, 30)}
            <div style={{position:"absolute",bottom:2,right:2,width:26,height:26,borderRadius:"50%",
              background:C.primary,border:"2px solid #1e0c14",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFoto}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>
              {form.profissao||"Profissional da beleza"}
            </div>
            <div style={{fontSize:24,fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:3}}>
              {form.negocio||form.nome||"FEMI Studio"}
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
              {form.cidade||"Brasil"} · {form.instagram||"@meuperfil"}
            </div>
          </div>
          <div style={{paddingBottom:4}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>E-mail</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>{usuario?.email}</div>
          </div>
        </div>
      </div>

      <div style={{padding:"0 28px",marginTop:-50,position:"relative",zIndex:10,marginBottom:20}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {stats.map(({label,value,icon,color})=>(
            <div key={label} style={{background:"#fff",borderRadius:16,padding:"16px 18px",
              boxShadow:"0 8px 32px rgba(46,16,25,.12)",border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.textLight,
                marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>
                <Ico name={icon} size={12} color={color}/>{label}
              </div>
              <div style={{fontSize:22,fontWeight:800,color}}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 28px 32px"}}>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          <AbaBtn id="dados" label="Dados do studio"/>
          <AbaBtn id="senha" label="Alterar senha"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 0.6fr",gap:20}}>
          <div>
            {abaAtiva==="dados"&&(
              <form onSubmit={handleSalvar} style={css.card}>
                <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
                  <Ico name="edit" size={14} color={C.primary}/> Editar dados
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {[["nome","Seu nome","Ex: Gabriela Santos"],["negocio","Nome do negócio","Studio Gabi"],
                    ["profissao","Profissão","Lash Designer"],["telefone","Telefone","(41) 99999-0000"],
                    ["cidade","Cidade","Curitiba/PR"],["instagram","Instagram","@seuinstagram"]
                  ].map(([k,label,ph])=>(
                    <div key={k}>
                      <label style={css.label}>{label}</label>
                      <input style={css.input} placeholder={ph} value={form[k]||""} onChange={e=>set(k,e.target.value)}/>
                    </div>
                  ))}
                </div>
                {salvo&&(
                  <div style={{marginTop:16,background:C.greenBg,border:`1px solid #C0DD97`,color:"#27500A",
                    borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                    <Ico name="check" size={14} color={C.green}/> Perfil salvo!
                  </div>
                )}
                <button type="submit" style={{...css.btn(),marginTop:20}}>
                  <Ico name="check" size={14}/> Salvar alterações
                </button>
              </form>
            )}
            {abaAtiva==="senha"&&(
              <form onSubmit={handleSenha} style={css.card}>
                <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:18}}>Alterar senha</div>
                {[["atual","Senha atual","••••••••"],["nova","Nova senha","Mínimo 6 caracteres"],
                  ["confirmar","Confirmar nova senha","Repita a nova senha"]].map(([k,label,ph])=>(
                  <div key={k} style={{marginBottom:14}}>
                    <label style={{...css.label,marginTop:0}}>{label}</label>
                    <input style={css.input} type="password" placeholder={ph}
                      value={senhas[k]} onChange={e=>setSenha(k,e.target.value)} required/>
                  </div>
                ))}
                {erroSenha&&<div style={{background:"#fff0f4",color:"#a51f4d",border:`1px solid #ffd1df`,
                  borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:500,marginBottom:14}}>{erroSenha}</div>}
                {okSenha&&<div style={{background:C.greenBg,border:`1px solid #C0DD97`,color:"#27500A",
                  borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,
                  display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
                  <Ico name="check" size={14} color={C.green}/> Senha alterada!
                </div>}
                <button type="submit" style={css.btn()}>
                  <Ico name="check" size={14}/> Alterar senha
                </button>
              </form>
            )}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:`linear-gradient(145deg,#2a0f1c 0%,#4a1e30 50%,${C.primaryDark} 100%)`,
              borderRadius:16,padding:"22px 20px",color:"#fff",position:"relative",overflow:"hidden",flex:1}}>
              <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",
                background:"rgba(255,255,255,.05)",bottom:-30,right:-30}}/>
              <div style={{position:"relative"}}>
                <div style={{width:52,height:52,borderRadius:"50%",
                  background:form.foto?"transparent":`linear-gradient(135deg,${C.primary},#ff8db4)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:18,fontWeight:800,marginBottom:12,
                  border:"2px solid rgba(255,255,255,.2)",overflow:"hidden"}}>
                  {form.foto
                    ? <img src={form.foto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : (form.negocio||form.nome||"F").charAt(0).toUpperCase()}
                </div>
                <div style={{fontSize:16,fontWeight:800,marginBottom:2}}>{form.negocio||"FEMI Studio"}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:18}}>{form.profissao||"Profissional da beleza"}</div>
                <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:14,display:"flex",flexDirection:"column",gap:8}}>
                  {[["📱",form.telefone,"(41) 99876-5432"],["📍",form.cidade,"Curitiba/PR"],["📸",form.instagram,"@femisystem"]].map(([ic,v,ph])=>(
                    <div key={ic} style={{display:"flex",gap:8,fontSize:11,color:"rgba(255,255,255,.65)"}}>
                      <span>{ic}</span><span>{v||ph}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{...css.card,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:C.textLight,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>
                Sessão ativa
              </div>
              <div style={{fontSize:12,color:C.textMid,marginBottom:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {usuario?.email}
              </div>
              <button onClick={sair} style={{width:"100%",display:"flex",alignItems:"center",
                justifyContent:"center",gap:8,border:`1px solid ${C.red}`,background:C.redBg,
                color:C.red,borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:700,
                cursor:"pointer",fontFamily:"inherit"}}>
                <Ico name="logout" size={14} color={C.red}/> Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
