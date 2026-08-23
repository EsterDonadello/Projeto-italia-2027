// ============================================================
// PROJETO ITÁLIA 2027
// App principal — versão corrigida
// ============================================================

const sections = [
  {
    id: "ester",
    title: "Ester",
    icon: "🎓",
    desc: "Documentos pessoais, estudos, visto e preparação acadêmica.",
    tasks: [
      "Passaporte brasileiro válido",
      "RG/CIN e CPF",
      "Certidão de nascimento atualizada",
      "Certidão de casamento atualizada",
      "Comprovante de residência no Brasil",
      "Fotos para o visto",
      "Formulário de visto nacional",
      "Carta de admissão no curso",
      "Comprovante de matrícula/pagamento",
      "Diploma/certificado de ensino médio",
      "Histórico escolar completo",
      "Traduções italianas necessárias",
      "Apostilas necessárias",
      "Declaração de valor/equivalência, se exigida",
      "Comprovação financeira",
      "Extratos e origem dos recursos",
      "Contracheques/comprovantes de renda",
      "Declaração de IR, se solicitada",
      "Seguro-saúde",
      "Comprovação de acomodação",
      "Passagem/itinerário",
      "Pedido do visto",
      "Permesso di soggiorno após chegada"
    ]
  },

  {
    id: "carlos",
    title: "Carlos",
    icon: "👨‍❤️‍👩",
    desc: "Documentos do esposo e preparação familiar.",
    tasks: [
      "Passaporte brasileiro válido",
      "RG/CIN e CPF",
      "Certidão de nascimento atualizada",
      "Certidão de casamento atualizada",
      "Apostila da certidão, se exigida",
      "Tradução italiana da certidão, se exigida",
      "Cópia do passaporte da Ester",
      "Cópia do visto/permesso da Ester",
      "Comprovante de residência do casal",
      "Comprovação de renda para o procedimento familiar",
      "Idoneidade habitacional, quando exigida",
      "Pedido de reagrupamento/nulla osta, quando aplicável",
      "Visto familiar correspondente",
      "Permesso di soggiorno familiar",
      "Codice fiscale",
      "Currículo em italiano",
      "Comprovantes de experiência profissional"
    ]
  },

  {
    id: "docs",
    title: "Documentos",
    icon: "📜",
    desc: "Traduções, apostilas e organização.",
    tasks: [
      "Confirmar documentos exigidos pela escola",
      "Confirmar tradução do diploma",
      "Confirmar apostila do histórico",
      "Confirmar declaração de valor/equivalência/CIMEA, se aplicável",
      "Solicitar certidões recentes",
      "Confirmar apostila da certidão de casamento",
      "Confirmar tradução da certidão",
      "Digitalizar tudo em PDF",
      "Fazer cópias físicas",
      "Guardar backup na nuvem"
    ]
  },

  {
    id: "finance",
    title: "Financeiro",
    icon: "💶",
    desc: "Reserva e provas financeiras.",
    tasks: [
      "Definir meta financeira",
      "Criar reserva da Itália",
      "Organizar extratos",
      "Guardar comprovantes de salário",
      "Guardar origem das economias",
      "Separar investimentos, se houver",
      "Separar declaração de IR",
      "Planejar passagens",
      "Planejar caução + aluguel",
      "Planejar seguro",
      "Planejar taxas e traduções",
      "Planejar custo de vida inicial"
    ]
  },

  {
    id: "arrival",
    title: "Chegada",
    icon: "🇮🇹",
    desc: "Primeiros passos na Itália.",
    tasks: [
      "Confirmar endereço inicial",
      "Encaminhar permesso dentro do prazo",
      "Guardar ricevuta",
      "Comparecer à Questura",
      "Providenciar codice fiscale",
      "Organizar saúde",
      "Registrar residência quando aplicável",
      "Iniciar procedimento do Carlos quando permitido",
      "Acompanhar procedimento familiar",
      "Preparar permesso do Carlos",
      "Organizar solução bancária",
      "Currículo italiano do casal",
      "Pesquisar emprego para o Carlos"
    ]
  },

  {
    id: "citizenship",
    title: "Cidadania",
    icon: "🇮🇹",
    desc: "Pasta paralela da cidadania Donadello.",
    tasks: [
      "Certidão italiana de Giovani Donadello",
      "Certidão de Ernesto Donadello",
      "Certidão de Ivanildo João Donadello",
      "Certidão de Odair José Donadello",
      "Sua certidão de nascimento",
      "Certidões de casamento da linha",
      "Certidões de naturalização/não naturalização conforme estratégia",
      "Traduções",
      "Apostilamentos",
      "Documentação judicial/advogado, se aplicável",
      "Acompanhar andamento"
    ]
  },

  {
    id: "timeline",
    title: "2027",
    icon: "📅",
    desc: "Linha do tempo sugerida.",
    tasks: [
      "JAN–MAR: escolher cursos e acompanhar editais",
      "JAN–MAR: fortalecer italiano",
      "MAR–MAI: candidaturas",
      "ABR–JUN: carta de admissão/matrícula",
      "MAI–JUL: traduções e apostilas",
      "MAI–JUL: comprovação financeira",
      "JUN–AGO: moradia e seguro",
      "JUN–SET: pedido do visto",
      "JUL–OUT: procedimento do Carlos",
      "AGO–DEZ: viagem",
      "Após chegada: permesso e registros"
    ]
  }
];

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const STORAGE_KEY = "italia-sync-v2";
const ACTIVE_KEY = "italia-active";

let active = localStorage.getItem(ACTIVE_KEY) || "ester";

let state = {
  tasks: {},
  notes: {},
  goal: 18000,
  saved: 0
};

let user = null;
let cloudTimer = null;
let sb = null;

// ============================================================
// UTILITÁRIOS
// ============================================================

function $(selector) {
  return document.querySelector(selector);
}

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    }
  );
}

// ============================================================
// ESTADO
// ============================================================

function initState() {
  sections.forEach(function (section) {
    section.tasks.forEach(function (_, index) {
      const key = section.id + "-" + index;

      if (typeof state.tasks[key] !== "boolean") {
        state.tasks[key] = false;
      }
    });
  });
}

function loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      state = {
        tasks: parsed.tasks || {},
        notes: parsed.notes || {},
        goal: Number(parsed.goal) || 18000,
        saved: Number(parsed.saved) || 0
      };
    }
  } catch (error) {
    console.warn("Não foi possível carregar os dados locais:", error);
  }

  initState();
}

function localSave() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Não foi possível salvar localmente:", error);
  }
}

function allKeys() {
  return sections.flatMap(function (section) {
    return section.tasks.map(function (_, index) {
      return section.id + "-" + index;
    });
  });
}

// ============================================================
// RENDERIZAÇÃO
// ============================================================

function render() {
  initState();

  const countElement = $("#count");
  const pctElement = $("#pct");
  const barElement = $("#bar");
  const goalElement = $("#goal");
  const savedElement = $("#saved");
  const moneyPctElement = $("#moneyPct");
  const tabsElement = $("#tabs");
  const contentElement = $("#content");

  // Se o HTML ainda não estiver carregado, não tenta executar.
  if (
    !countElement ||
    !pctElement ||
    !barElement ||
    !goalElement ||
    !savedElement ||
    !moneyPctElement ||
    !tabsElement ||
    !contentElement
  ) {
    console.warn("Elementos do aplicativo ainda não estão disponíveis.");
    return;
  }

  const keys = allKeys();

  const done = keys.filter(function (key) {
    return state.tasks[key] === true;
  }).length;

  const total = keys.length;

  const percentage = total
    ? Math.round((done / total) * 100)
    : 0;

  pctElement.textContent = percentage + "%";
  barElement.style.width = percentage + "%";
  countElement.textContent = done + " de " + total + " tarefas";

  goalElement.value = state.goal || 0;
  savedElement.value = state.saved || 0;

  const moneyPercentage = state.goal
    ? Math.min(100, Math.round((state.saved / state.goal) * 100))
    : 0;

  moneyPctElement.textContent = moneyPercentage + "%";

  // ==========================================================
  // ABAS
  // ==========================================================

  tabsElement.innerHTML = sections
    .map(function (section) {
      return `
        <button
          class="tab ${section.id === active ? "active" : ""}"
          data-id="${section.id}"
          type="button"
        >
          ${section.icon} ${esc(section.title)}
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".tab").forEach(function (button) {
    button.addEventListener("click", function () {
      active = button.dataset.id;

      localStorage.setItem(ACTIVE_KEY, active);

      render();
    });
  });

  // ==========================================================
  // SEÇÃO ATUAL
  // ==========================================================

  const section =
    sections.find(function (item) {
      return item.id === active;
    }) || sections[0];

  contentElement.innerHTML = `
    <div class="sectionHead">
      <h2>${section.icon} ${esc(section.title)}</h2>
      <p>${esc(section.desc)}</p>
    </div>

    <div class="taskCard">
      ${section.tasks
        .map(function (label, index) {
          const key = section.id + "-" + index;
          const checked = state.tasks[key] === true;

          return `
            <label class="task">
              <input
                type="checkbox"
                data-key="${key}"
                ${checked ? "checked" : ""}
              >

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
        })
        .join("")}
    </div>
  `;

  // ==========================================================
  // CHECKBOXES
  // ==========================================================

  document.querySelectorAll("[data-key]").forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      state.tasks[checkbox.dataset.key] = checkbox.checked;

      localSave();

      render();

      queueCloudSave();
    });
  });

  // ==========================================================
  // ANOTAÇÕES
  // ==========================================================

  document.querySelectorAll("[data-note]").forEach(function (textarea) {
    textarea.addEventListener("input", function () {
      state.notes[textarea.dataset.note] = textarea.value;

      localSave();

      queueCloudSave();
    });
  });
}

// ============================================================
// SUPABASE
// ============================================================

function initializeSupabase() {
  try {
    if (
      typeof window.supabase === "undefined" ||
      !window.SUPABASE_URL ||
      !window.SUPABASE_ANON_KEY ||
      window.SUPABASE_URL.includes("COLE_AQUI")
    ) {
      console.warn("Supabase não configurado. Funcionando em modo local.");
      return null;
    }

    return window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  } catch (error) {
    console.error("Erro ao inicializar Supabase:", error);
    return null;
  }
}

async function refreshAuth() {
  const syncStatus = $("#syncStatus");
  const loginButton = $("#loginBtn");

  if (!sb) {
    if (syncStatus) {
      syncStatus.textContent = "● Local";
    }

    return;
  }

  try {
    const result = await sb.auth.getUser();

    user = result.data?.user || null;

    if (syncStatus) {
      syncStatus.textContent = user
        ? "● Sincronizado"
        : "● Não conectado";
    }

    if (loginButton) {
      loginButton.textContent = user
        ? user.email
        : "Entrar / Criar conta";
    }

    if (user) {
      await pullCloud();
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);

    if (syncStatus) {
      syncStatus.textContent = "● Erro";
    }
  }
}

async function pullCloud() {
  if (!sb || !user) return;

  try {
    const result = await sb
      .from("projects")
      .select("data")
      .eq("user_id", user.id)
      .maybeSingle();

    if (result.error) {
      console.error("Erro ao carregar dados:", result.error);
      return;
    }

    if (result.data && result.data.data) {
      state = {
        tasks: result.data.data.tasks || {},
        notes: result.data.data.notes || {},
        goal: Number(result.data.data.goal) || 18000,
        saved: Number(result.data.data.saved) || 0
      };

      initState();
      localSave();
      render();
    }
  } catch (error) {
    console.error("Erro ao sincronizar dados:", error);
  }
}

function queueCloudSave() {
  if (!sb || !user) return;

  clearTimeout(cloudTimer);

  cloudTimer = setTimeout(async function () {
    const syncStatus = $("#syncStatus");

    if (syncStatus) {
      syncStatus.textContent = "● Salvando…";
    }

    try {
      const payload = {
        tasks: state.tasks,
        notes: state.notes,
        goal: Number(state.goal) || 0,
        saved: Number(state.saved) || 0
      };

      const result = await sb
        .from("projects")
        .upsert(
          {
            user_id: user.id,
            data: payload,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: "user_id"
          }
        );

      if (result.error) {
        console.error("Erro ao salvar:", result.error);

        if (syncStatus) {
          syncStatus.textContent = "● Erro ao salvar";
        }
      } else {
        if (syncStatus) {
          syncStatus.textContent = "● Sincronizado";
        }
      }
    } catch (error) {
      console.error("Erro ao salvar no Supabase:", error);

      if (syncStatus) {
        syncStatus.textContent = "● Erro ao salvar";
      }
    }
  }, 700);
}

// ============================================================
// LOGIN
// ============================================================

function setupLogin() {
  const loginButton = $("#loginBtn");
  const sendMagicLink = $("#sendMagicLink");
  const authPanel = $("#authPanel");
  const emailInput = $("#email");
  const authMessage = $("#authMessage");

  if (loginButton) {
    loginButton.addEventListener("click", function () {
      if (authPanel) {
        authPanel.classList.toggle("hidden");
      }
    });
  }

  if (sendMagicLink) {
    sendMagicLink.addEventListener("click", async function () {
      if (!sb) {
        if (authMessage) {
          authMessage.textContent =
            "Supabase não está configurado. O checklist continuará funcionando localmente.";
        }

        return;
      }

      const email = emailInput
        ? emailInput.value.trim()
        : "";

      if (!email) {
        if (authMessage) {
          authMessage.textContent =
            "Digite seu e-mail primeiro.";
        }

        return;
      }

      try {
        const result = await sb.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: window.location.origin +
              window.location.pathname
          }
        });

        if (result.error) {
          console.error(result.error);

          if (authMessage) {
            authMessage.textContent =
              result.error.message;
          }

          return;
        }

        if (authMessage) {
          authMessage.textContent =
            "Link enviado! Confira seu e-mail.";
        }
      } catch (error) {
        console.error(error);

        if (authMessage) {
          authMessage.textContent =
            "Não foi possível enviar o link. Tente novamente.";
        }
      }
    });
  }
}

// ============================================================
// META FINANCEIRA
// ============================================================

function setupFinance() {
  const goal = $("#goal");
  const saved = $("#saved");

  if (goal) {
    goal.addEventListener("change", function () {
      state.goal = Number(goal.value) || 0;

      localSave();
      render();
      queueCloudSave();
    });
  }

  if (saved) {
    saved.addEventListener("change", function () {
      state.saved = Number(saved.value) || 0;

      localSave();
      render();
      queueCloudSave();
    });
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function startApp() {
  console.log("🇮🇹 Projeto Itália 2027 iniciado.");

  loadLocal();

  sb = initializeSupabase();

  setupLogin();
  setupFinance();

  render();

  refreshAuth();

  if (sb) {
    sb.auth.onAuthStateChange(function () {
      refreshAuth();
    });
  }
}

// Garante que o HTML já esteja carregado.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}
