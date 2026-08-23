const sections=[
{id:"ester",title:"Ester",icon:"🎓",desc:"Documentos pessoais, estudos, visto e preparação acadêmica.",tasks:[
"Passaporte brasileiro válido","RG/CIN e CPF","Certidão de nascimento atualizada","Certidão de casamento atualizada","Comprovante de residência no Brasil","Fotos para o visto","Formulário de visto nacional","Carta de admissão no curso","Comprovante de matrícula/pagamento","Diploma/certificado de ensino médio","Histórico escolar completo","Traduções italianas necessárias","Apostilas necessárias","Declaração de valor/equivalência, se exigida","Comprovação financeira","Extratos e origem dos recursos","Contracheques/comprovantes de renda","Declaração de IR, se solicitada","Seguro-saúde","Comprovação de acomodação","Passagem/itinerário","Pedido do visto","Permesso di soggiorno após chegada"]},
{id:"carlos",title:"Carlos",icon:"👨‍❤️‍👩",desc:"Documentos do esposo e preparação familiar.",tasks:[
"Passaporte brasileiro válido","RG/CIN e CPF","Certidão de nascimento atualizada","Certidão de casamento atualizada","Apostila da certidão, se exigida","Tradução italiana da certidão, se exigida","Cópia do passaporte da Ester","Cópia do visto/permesso da Ester","Comprovante de residência do casal","Comprovação de renda para o procedimento familiar","Idoneidade habitacional, quando exigida","Pedido de reagrupamento/nulla osta, quando aplicável","Visto familiar correspondente","Permesso di soggiorno familiar","Codice fiscale","Currículo em italiano","Comprovantes de experiência profissional"]},
{id:"docs",title:"Documentos",icon:"📜",desc:"Traduções, apostilas e organização.",tasks:[
"Confirmar documentos exigidos pela escola","Confirmar tradução do diploma","Confirmar apostila do histórico","Confirmar declaração de valor/equivalência/CIMEA, se aplicável","Solicitar certidões recentes","Confirmar apostila da certidão de casamento","Confirmar tradução da certidão","Digitalizar tudo em PDF","Fazer cópias físicas","Guardar backup na nuvem"]},
{id:"finance",title:"Financeiro",icon:"💶",desc:"Reserva e provas financeiras.",tasks:[
"Definir meta financeira","Criar reserva da Itália","Organizar extratos","Guardar comprovantes de salário","Guardar origem das economias","Separar investimentos, se houver","Separar declaração de IR","Planejar passagens","Planejar caução + aluguel","Planejar seguro","Planejar taxas e traduções","Planejar custo de vida inicial"]},
{id:"arrival",title:"Chegada",icon:"🇮🇹",desc:"Primeiros passos na Itália.",tasks:[
"Confirmar endereço inicial","Encaminhar permesso dentro do prazo","Guardar ricevuta","Comparecer à Questura","Providenciar codice fiscale","Organizar saúde","Registrar residência quando aplicável","Iniciar procedimento do Carlos quando permitido","Acompanhar procedimento familiar","Preparar permesso do Carlos","Organizar solução bancária","Currículo italiano do casal","Pesquisar emprego para o Carlos"]},
{id:"citizenship",title:"Cidadania",icon:"🇮🇹",desc:"Pasta paralela da cidadania Donadello.",tasks:[
"Certidão italiana de Giovani Donadello","Certidão de Ernesto Donadello","Certidão de Ivanildo João Donadello","Certidão de Odair José Donadello","Sua certidão de nascimento","Certidões de casamento da linha","Certidões de naturalização/não naturalização conforme estratégia","Traduções","Apostilamentos","Documentação judicial/advogado, se aplicável","Acompanhar andamento"]},
{id:"timeline",title:"2027",icon:"📅",desc:"Linha do tempo sugerida.",tasks:[
"JAN–MAR: escolher cursos e acompanhar editais","JAN–MAR: fortalecer italiano","MAR–MAI: candidaturas","ABR–JUN: carta de admissão/matrícula","MAI–JUL: traduções e apostilas","MAI–JUL: comprovação financeira","JUN–AGO: moradia e seguro","JUN–SET: pedido do visto","JUL–OUT: procedimento do Carlos","AGO–DEZ: viagem","Após chegada: permesso e registros"]]}
];

const KEY="italia-sync-v1";
let active=localStorage.getItem("italia-active")||"ester";
let state={tasks:{},notes:{},goal:18000,saved:0};
let user=null, cloudTimer=null;

function initState(){
  sections.forEach(s=>s.tasks.forEach((_,i)=>{if(state.tasks[s.id+"-"+i]===undefined)state.tasks[s.id+"-"+i]=false}));
}
function localSave(){localStorage.setItem(KEY,JSON.stringify(state))}
function loadLocal(){try{state={...state,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{}initState()}
function allKeys(){return sections.flatMap(s=>s.tasks.map((_,i)=>s.id+"-"+i))}
function render(){
  initState();
  const keys=allKeys(), done=keys.filter(k=>state.tasks[k]).length, pct=keys.length?Math.round(done/keys.length*100):0;
  document.querySelector("#pct").textContent=pct+"%";
  document.querySelector("#bar").style.width=pct+"%";
  document.querySelector("#count").textContent=`${done} de ${keys.length} tarefas`;
  document.querySelector("#goal").value=state.goal||0;
  document.querySelector("#saved").value=state.saved||0;
  const mp=state.goal?Math.min(100,Math.round(state.saved/state.goal*100)):0;
  document.querySelector("#moneyPct").textContent=mp+"%";
  document.querySelector("#tabs").innerHTML=sections.map(s=>`<button class="tab ${s.id===active?"active":""}" data-id="${s.id}">${s.icon} ${s.title}</button>`).join("");
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{active=b.dataset.id;localStorage.setItem("italia-active",active);render()});
  const sec=sections.find(s=>s.id===active);
  document.querySelector("#content").innerHTML=`<div class="sectionHead"><h2>${sec.icon} ${sec.title}</h2><p>${sec.desc}</p></div><div class="taskCard">${sec.tasks.map((label,i)=>{
    const key=sec.id+"-"+i, checked=!!state.tasks[key];
    return `<label class="task"><input type="checkbox" data-key="${key}" ${checked?"checked":""}><span><b class="${checked?"done":""}">${esc(label)}</b><textarea data-note="${key}" placeholder="Observações, prazo, valor, link...">${esc(state.notes[key]||"")}</textarea></span></label>`;
  }).join("")}</div>`;
  document.querySelectorAll("[data-key]").forEach(c=>c.onchange=async()=>{state.tasks[c.dataset.key]=c.checked;localSave();render();queueCloudSave()});
  document.querySelectorAll("[data-note]").forEach(n=>n.oninput=()=>{state.notes[n.dataset.note]=n.value;localSave();queueCloudSave()});
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

const sb=(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY&&
!window.SUPABASE_URL.includes("COLE_AQUI"))?supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY):null;

async function refreshAuth(){
 if(!sb){document.querySelector("#syncStatus").textContent="● Local";return}
 const {data}=await sb.auth.getUser(); user=data.user||null;
 document.querySelector("#syncStatus").textContent=user?"● Sincronizado":"● Não conectado";
 document.querySelector("#loginBtn").textContent=user?user.email:"Entrar / Criar conta";
 if(user) await pullCloud();
}
async function pullCloud(){
 const {data,error}=await sb.from("projects").select("data").eq("user_id",user.id).maybeSingle();
 if(error)return;
 if(data?.data){state={...state,...data.data};localSave();render()}
}
function queueCloudSave(){
 if(!sb||!user)return;
 clearTimeout(cloudTimer);
 cloudTimer=setTimeout(async()=>{
   document.querySelector("#syncStatus").textContent="● Salvando…";
   const payload={...state};
   const {error}=await sb.from("projects").upsert({user_id:user.id,data:payload,updated_at:new Date().toISOString()});
   document.querySelector("#syncStatus").textContent=error?"● Erro ao salvar":"● Sincronizado";
 },700);
}
document.querySelector("#loginBtn").onclick=()=>{
 document.querySelector("#authPanel").classList.toggle("hidden");
};
document.querySelector("#sendMagicLink").onclick=async()=>{
 if(!sb){document.querySelector("#authMessage").textContent="Primeiro configure config.js com as credenciais do Supabase.";return}
 const email=document.querySelector("#email").value.trim();
 if(!email)return;
 const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:location.href}});
 document.querySelector("#authMessage").textContent=error?error.message:"Link enviado! Confira seu e-mail.";
};
document.querySelector("#goal").oninput=e=>{state.goal=Number(e.target.value)||0;localSave();render();queueCloudSave()};
document.querySelector("#saved").oninput=e=>{state.saved=Number(e.target.value)||0;localSave();render();queueCloudSave()};
if(sb) sb.auth.onAuthStateChange(()=>refreshAuth());
loadLocal();render();refreshAuth();
