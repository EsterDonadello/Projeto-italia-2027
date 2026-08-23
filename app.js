// ============================================================
// PROJETO ITÁLIA 2027
// APP.JS — LOGIN POR E-MAIL + SENHA
// ============================================================

const sections = [
  {
    id:"ester",
    title:"Ester",
    icon:"🎓",
    desc:"Documentos pessoais, estudos, visto e preparação acadêmica.",
    tasks:[
      "Passaporte brasileiro válido","RG/CIN e CPF","Certidão de nascimento atualizada",
      "Certidão de casamento atualizada","Comprovante de residência no Brasil",
      "Fotos para o visto","Formulário de visto nacional","Carta de admissão no curso",
      "Comprovante de matrícula/pagamento","Diploma/certificado de ensino médio",
      "Histórico escolar completo","Traduções italianas necessárias","Apostilas necessárias",
      "Declaração de valor/equivalência, se exigida","Comprovação financeira",
      "Extratos e origem dos recursos","Contracheques/comprovantes de renda",
      "Declaração de IR, se solicitada","Seguro-saúde","Comprovação de acomodação",
      "Passagem/itinerário","Pedido do visto","Permesso di soggiorno após chegada"
    ]
  },
  {
    id:"carlos",
    title:"Carlos",
    icon:"👨‍❤️‍👩",
    desc:"Documentos do esposo e preparação familiar.",
    tasks:[
      "Passaporte brasileiro válido","RG/CIN e CPF","Certidão de nascimento atualizada",
      "Certidão de casamento atualizada","Apostila da certidão, se exigida",
      "Tradução italiana da certidão, se exigida","Cópia do passaporte da Ester",
      "Cópia do visto/permesso da Ester","Comprovante de residência do casal",
      "Comprovação de renda para o procedimento familiar",
      "Idoneidade habitacional, quando exigida",
      "Pedido de reagrupamento/nulla osta, quando aplicável",
      "Visto familiar correspondente","Permesso di soggiorno familiar",
      "Codice fiscale","Currículo em italiano","Comprovantes de experiência profissional"
    ]
  },
  {
    id:"docs",
    title:"Documentos",
    icon:"📜",
    desc:"Traduções, apostilas e organização.",
    tasks:[
      "Confirmar documentos exigidos pela escola","Confirmar tradução do diploma",
      "Confirmar apostila do histórico",
      "Confirmar declaração de valor/equivalência/CIMEA, se aplicável",
      "Solicitar certidões recentes","Confirmar apostila da certidão de casamento",
      "Confirmar tradução da certidão","Digitalizar tudo em PDF",
      "Fazer cópias físicas","Guardar backup na nuvem"
    ]
  },
  {
    id:"finance",
    title:"Financeiro",
    icon:"💶",
    desc:"Reserva e provas financeiras.",
    tasks:[
      "Definir meta financeira","Criar reserva da Itália","Organizar extratos",
      "Guardar comprovantes de salário","Guardar origem das economias",
      "Separar investimentos, se houver","Separar declaração de IR",
      "Planejar passagens","Planejar caução + aluguel","Planejar seguro",
      "Planejar taxas e traduções","Planejar custo de vida inicial"
    ]
  },
  {
    id:"arrival",
    title:"Chegada",
    icon:"🇮🇹",
    desc:"Primeiros passos na Itália.",
    tasks:[
      "Confirmar endereço inicial","Encaminhar permesso dentro do prazo",
      "Guardar ricevuta","Comparecer à Questura","Providenciar codice fiscale",
      "Organizar saúde","Registrar residência quando aplicável",
      "Iniciar procedimento do Carlos quando permitido",
      "Acompanhar procedimento familiar","Preparar permesso do Carlos",
      "Organizar solução bancária","Currículo italiano do casal",
      "Pesquisar emprego para o Carlos"
    ]
  },
  {
    id:"citizenship",
    title:"Cidadania",
    icon:"🇮🇹",
    desc:"Pasta paralela da cidadania Donadello.",
    tasks:[
      "Certidão italiana de Giovani Donadello","Certidão de Ernesto Donadello",
      "Certidão de Ivanildo João Donadello","Certidão de Odair José Donadello",
      "Sua certidão de nascimento","Certidões de casamento da linha",
      "Certidões de naturalização/não naturalização conforme estratégia",
      "Traduções","Apostilamentos",
      "Documentação judicial/advogado, se aplicável","Acompanhar andamento"
    ]
  },
  {
    id:"timeline",
    title:"2027",
    icon:"📅",
    desc:"Linha do tempo sugerida.",
    tasks:[
      "JAN–MAR: escolher cursos e acompanhar editais",
      "JAN–MAR: fortalecer italiano","MAR–MAI: candidaturas",
      "ABR–JUN: carta de admissão/matrícula","MAI–JUL: traduções e apostilas",
      "MAI–JUL: comprovação financeira","JUN–AGO: moradia e seguro",
      "JUN–SET: pedido do visto","JUL–OUT: procedimento do Carlos",
      "AGO–DEZ: viagem","Após chegada: permesso e registros"
    ]
  }
];

const STORAGE_KEY = "italia-sync-v3";
const ACTIVE_KEY = "italia-active";

let active = localStorage.getItem(ACTIVE_KEY) || "ester";

let state = {
  tasks:{},
  notes:{},
  goal:18000,
  saved:0
};

let user = null;
let cloudTimer = null;
let sb = null;

// ============================================================
// UTILITÁRIOS
// ============================================================

function $(selector){
  return document.querySelector(selector);
}

function esc(value){
  return String(value ?? "").replace(/[&<>"']/g,function(char){
    return {
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[char];
  });
}

// ============================================================
// ESTADO LOCAL
// ============================================================

function initState(){
  sections.forEach(function(section){
    section.tasks.forEach(function(_,index){
      const key = section.id + "-" + index;

      if(typeof state.tasks[key] !== "boolean"){
        state.tasks[key] = false;
      }
    });
  });
}

function loadLocal(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);

    if(saved){
      const parsed = JSON.parse(saved);

      state = {
        tasks:parsed.tasks || {},
        notes:parsed.notes || {},
        goal:Number(parsed.goal) || 18000,
        saved:Number(parsed.saved) || 0
      };
    }
  }catch(error){
    console.warn("Erro ao carregar dados locais:",error);
  }

  initState();
}

function localSave(){
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(error){
    console.warn("Erro ao salvar localmente:",error);
  }
}

function allKeys(){
  return sections.flatMap(function(section){
    return section.tasks.map(function(_,index){
      return section.id + "-" + index;
    });
  });
}

// ============================================================
// RENDER
// ============================================================

function render(){

  initState();

  const count = $("#count");
  const pct = $("#pct");
  const bar = $("#bar");
  const goal = $("#goal");
  const saved = $("#saved");
  const moneyPct = $("#moneyPct");
  const tabs = $("#tabs");
  const content = $("#content");

  if(!count || !pct || !bar || !goal || !saved || !moneyPct || !tabs || !content){
    console.warn("HTML ainda não está pronto.");
    return;
  }

  const keys = allKeys();

  const done = keys.filter(function(key){
    return state.tasks[key] === true;
  }).length;

  const total = keys.length;

  const percentage = total
    ? Math.round(done / total * 100)
    : 0;

  pct.textContent = percentage + "%";
  bar.style.width = percentage + "%";
  count.textContent = done + " de " + total + " tarefas";

  goal.value = state.goal || 0;
  saved.value = state.saved || 0;

  const moneyPercentage = state.goal
    ? Math.min(100,Math.round(state.saved / state.goal * 100))
    : 0;

  moneyPct.textContent = moneyPercentage + "%";

  tabs.innerHTML = sections.map(function(section){
    return `
      <button
        type="button"
        class="tab ${section.id === active ? "active" : ""}"
        data-id="${section.id}">
        ${section.icon} ${esc(section.title)}
      </button>
    `;
  }).join("");

  document.querySelectorAll(".tab").forEach(function(button){

    button.addEventListener("click",function(){

      active = button.dataset.id;

      localStorage.setItem(ACTIVE_KEY,active);

      render();
    });

  });

  const section =
    sections.find(function(item){
      return item.id === active;
    }) || sections[0];

  content.innerHTML = `
    <div class="sectionHead">
      <h2>${section.icon} ${esc(section.title)}</h2>
      <p>${esc(section.desc)}</p>
    </div>

    <div class="taskCard">
      ${section.tasks.map(function(label,index){

        const key = section.id + "-" + index;
        const checked = state.tasks[key] === true;

        return `
          <label class="task">

            <input
              type="checkbox"
              data-key="${key}"
              ${checked ? "checked" : ""}>

            <span>

              <b class="${checked ? "done" : ""}">
                ${esc(label)}
              </b>

              <textarea
                data-note="${key}"
                placeholder="Observações, prazo, valor, link..."
              >${esc(state.notes[key] || "")}</textarea>

            </span>

          </label>
        `;

      }).join("")}
    </div>
  `;

  document.querySelectorAll("[data-key]").forEach(function(checkbox){

    checkbox.addEventListener("change",function(){

      state.tasks[checkbox.dataset.key] = checkbox.checked;

      localSave();
      render();
      queueCloudSave();

    });

  });

  document.querySelectorAll("[data-note]").forEach(function(textarea){

    textarea.addEventListener("input",function(){

      state.notes[textarea.dataset.note] = textarea.value;

      localSave();
      queueCloudSave();

    });

  });
}

// ============================================================
// SUPABASE
// ============================================================

function initializeSupabase(){

  try{

    if(
      typeof window.supabase === "undefined" ||
      !window.SUPABASE_URL ||
      !window.SUPABASE_ANON_KEY ||
      window.SUPABASE_URL.includes("COLE_AQUI")
    ){
      console.warn("Supabase não configurado.");
      return null;
    }

    return window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY,
      {
        auth:{
          persistSession:true,
          autoRefreshToken:true,
          detectSessionInUrl:true
        }
      }
    );

  }catch(error){

    console.error("Erro Supabase:",error);

    return null;
  }
}

// ============================================================
// AUTENTICAÇÃO
// ============================================================

async function refreshAuth(){

  const status = $("#syncStatus");
  const loginButton = $("#loginBtn");

  if(!sb){

    if(status){
      status.textContent = "● Local";
    }

    return;
  }

  try{

    const result = await sb.auth.getUser();

    user = result.data?.user || null;

    if(user){

      if(status){
        status.textContent = "● Sincronizado";
      }

      if(loginButton){
        loginButton.textContent = "Minha conta";
      }

      await pullCloud();

    }else{

      if(status){
        status.textContent = "● Não conectado";
      }

      if(loginButton){
        loginButton.textContent = "Entrar / Criar conta";
      }
    }

  }catch(error){

    console.error("Erro ao verificar sessão:",error);

    if(status){
      status.textContent = "● Não conectado";
    }
  }
}

// ============================================================
// CARREGAR DADOS DA NUVEM
// ============================================================

async function pullCloud(){

  if(!sb || !user) return;

  try{

    const result = await sb
      .from("projects")
      .select("data")
      .eq("user_id",user.id)
      .maybeSingle();

    if(result.error){

      console.error("Erro ao carregar:",result.error);

      return;
    }

    if(result.data?.data){

      state = {
        tasks:result.data.data.tasks || {},
        notes:result.data.data.notes || {},
        goal:Number(result.data.data.goal) || 18000,
        saved:Number(result.data.data.saved) || 0
      };

      initState();
      localSave();
      render();
    }

  }catch(error){

    console.error("Erro cloud:",error);
  }
}

// ============================================================
// SALVAR NA NUVEM
// ============================================================

function queueCloudSave(){

  if(!sb || !user) return;

  clearTimeout(cloudTimer);

  cloudTimer = setTimeout(async function(){

    const status = $("#syncStatus");

    if(status){
      status.textContent = "● Salvando…";
    }

    try{

      const payload = {
        tasks:state.tasks,
        notes:state.notes,
        goal:Number(state.goal) || 0,
        saved:Number(state.saved) || 0
      };

      const result = await sb
        .from("projects")
        .upsert(
          {
            user_id:user.id,
            data:payload,
            updated_at:new Date().toISOString()
          },
          {
            onConflict:"user_id"
          }
        );

      if(result.error){

        console.error("Erro ao salvar:",result.error);

        if(status){
          status.textContent = "● Erro ao salvar";
        }

      }else{

        if(status){
          status.textContent = "● Sincronizado";
        }
      }

    }catch(error){

      console.error("Erro cloud save:",error);

      if(status){
        status.textContent = "● Erro ao salvar";
      }
    }

  },700);
}

// ============================================================
// MODAL DE LOGIN
// ============================================================

function createAuthPanel(){

  if($("#passwordAuthPanel")){
    return;
  }

  const panel = document.createElement("div");

  panel.id = "passwordAuthPanel";

  panel.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.45);
      z-index:9999;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
    ">

      <div style="
        background:white;
        width:100%;
        max-width:420px;
        border-radius:20px;
        padding:24px;
        box-shadow:0 20px 60px rgba(0,0,0,.25);
      ">

        <h2 id="authTitle">
          🇮🇹 Entrar no Projeto Itália
        </h2>

        <p id="authDescription">
          Entre com seu e-mail e senha.
        </p>

        <input
          id="authEmail"
          type="email"
          placeholder="Seu e-mail"
          autocomplete="email"
          style="
            width:100%;
            padding:12px;
            margin:8px 0;
            box-sizing:border-box;
          "
        >

        <input
          id="authPassword"
          type="password"
          placeholder="Senha"
          autocomplete="current-password"
          style="
            width:100%;
            padding:12px;
            margin:8px 0;
            box-sizing:border-box;
          "
        >

        <button
          id="authSubmit"
          type="button"
          style="
            width:100%;
            padding:13px;
            margin-top:8px;
            cursor:pointer;
          "
        >
          Entrar
        </button>

        <button
          id="authCreate"
          type="button"
          style="
            width:100%;
            padding:13px;
            margin-top:8px;
            cursor:pointer;
          "
        >
          Criar conta
        </button>

        <button
          id="authForgot"
          type="button"
          style="
            width:100%;
            padding:10px;
            margin-top:5px;
            background:none;
            border:0;
            cursor:pointer;
          "
        >
          Esqueci minha senha
        </button>

        <button
          id="authClose"
          type="button"
          style="
            width:100%;
            padding:10px;
            margin-top:5px;
            cursor:pointer;
          "
        >
          Fechar
        </button>

        <p id="authMessage"></p>

      </div>
    </div>
  `;

  document.body.appendChild(panel);

  $("#authClose").onclick = function(){
    panel.remove();
  };

  $("#authSubmit").onclick = loginWithPassword;

  $("#authCreate").onclick = createAccount;

  $("#authForgot").onclick = resetPassword;
}

// ============================================================
// LOGIN COM SENHA
// ============================================================

async function loginWithPassword(){

  const email = $("#authEmail")?.value.trim();
  const password = $("#authPassword")?.value;
  const message = $("#authMessage");

  if(!email || !password){

    if(message){
      message.textContent =
        "Digite seu e-mail e sua senha.";
    }

    return;
  }

  if(!sb){

    message.textContent =
      "Supabase não está configurado.";

    return;
  }

  message.textContent = "Entrando…";

  try{

    const result = await sb.auth.signInWithPassword({
      email:email,
      password:password
    });

    if(result.error){

      message.textContent = result.error.message;

      return;
    }

    user = result.data.user;

    message.textContent = "Login realizado!";

    await pullCloud();

    setTimeout(function(){

      const panel = $("#passwordAuthPanel");

      if(panel){
        panel.remove();
      }

    },700);

  }catch(error){

    console.error(error);

    message.textContent =
      "Não foi possível entrar. Verifique o e-mail e a senha.";
  }
}

// ============================================================
// CRIAR CONTA
// ============================================================

async function createAccount(){

  const email = $("#authEmail")?.value.trim();
  const password = $("#authPassword")?.value;
  const message = $("#authMessage");

  if(!email || !password){

    message.textContent =
      "Digite seu e-mail e escolha uma senha.";

    return;
  }

  if(password.length < 6){

    message.textContent =
      "A senha precisa ter pelo menos 6 caracteres.";

    return;
  }

  if(!sb){

    message.textContent =
      "Supabase não está configurado.";

    return;
  }

  message.textContent = "Criando conta…";

  try{

    const result = await sb.auth.signUp({
      email:email,
      password:password,
      options:{
        emailRedirectTo:
          window.location.origin +
          window.location.pathname
      }
    });

    if(result.error){

      message.textContent =
        result.error.message;

      return;
    }

    if(result.data.session){

      user = result.data.user;

      message.textContent =
        "Conta criada e login realizado!";

      await pullCloud();

    }else{

      message.textContent =
        "Conta criada! Confira seu e-mail para confirmar a conta.";

    }

  }catch(error){

    console.error(error);

    message.textContent =
      "Não foi possível criar a conta.";
  }
}

// ============================================================
// ESQUECI MINHA SENHA
// ============================================================

async function resetPassword(){

  const email = $("#authEmail")?.value.trim();
  const message = $("#authMessage");

  if(!email){

    message.textContent =
      "Digite seu e-mail primeiro.";

    return;
  }

  if(!sb){

    message.textContent =
      "Supabase não está configurado.";

    return;
  }

  message.textContent =
    "Enviando recuperação de senha…";

  try{

    const result =
      await sb.auth.resetPasswordForEmail(email,{
        redirectTo:
          window.location.origin +
          window.location.pathname
      });

    if(result.error){

      message.textContent =
        result.error.message;

      return;
    }

    message.textContent =
      "Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha.";

  }catch(error){

    console.error(error);

    message.textContent =
      "Não foi possível solicitar a recuperação.";
  }
}

// ============================================================
// LOGOUT
// ============================================================

async function logout(){

  if(!sb) return;

  try{

    await sb.auth.signOut();

    user = null;

    const status = $("#syncStatus");
    const button = $("#loginBtn");

    if(status){
      status.textContent = "● Não conectado";
    }

    if(button){
      button.textContent = "Entrar / Criar conta";
    }

  }catch(error){

    console.error("Erro ao sair:",error);
  }
}

// ============================================================
// BOTÃO DE LOGIN
// ============================================================

function setupLoginButton(){

  const button = $("#loginBtn");

  if(!button) return;

  button.onclick = function(){

    if(user){

      const choice = confirm(
        "Você está conectado como " +
        user.email +
        ".\n\nDeseja sair da conta?"
      );

      if(choice){
        logout();
      }

      return;
    }

    createAuthPanel();
  };
}

// ============================================================
// FINANCEIRO
// ============================================================

function setupFinance(){

  const goal = $("#goal");
  const saved = $("#saved");

  if(goal){

    goal.addEventListener("change",function(){

      state.goal =
        Number(goal.value) || 0;

      localSave();
      render();
      queueCloudSave();

    });
  }

  if(saved){

    saved.addEventListener("change",function(){

      state.saved =
        Number(saved.value) || 0;

      localSave();
      render();
      queueCloudSave();

    });
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function startApp(){

  console.log(
    "🇮🇹 Projeto Itália 2027 iniciado."
  );

  loadLocal();

  sb = initializeSupabase();

  setupFinance();

  setupLoginButton();

  render();

  refreshAuth();

  if(sb){

    sb.auth.onAuthStateChange(
      function(event,session){

        console.log(
          "Supabase Auth:",
          event
        );

        user = session?.user || null;

        refreshAuth();
      }
    );
  }
}

// ============================================================
// GARANTE QUE O HTML JÁ CARREGOU
// ============================================================

if(document.readyState === "loading"){

  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );

}else{

  startApp();
}
