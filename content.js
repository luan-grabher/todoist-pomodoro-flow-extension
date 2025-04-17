const POMODORO_FLOW_ID = 'pomodoro-flow'; // ID do elemento que contém o app Pomodoro Flow
const PAGES_WITH_POMODORO_FLOW = ['/app/today']; // Páginas onde o app Pomodoro Flow deve ser exibido

// Script que é executado quando a página do Todoist (app/today) é carregada
function startPomodoroApp() {
  if (!!document.getElementById(POMODORO_FLOW_ID)) return; // Se o app já existe não faz nada
  if (!PAGES_WITH_POMODORO_FLOW.includes(window.location.pathname)) return; // Se não estamos na página correta, não faz nada

  // Cria um elemento para mostrar a aplicação Pomodoro Flow
  const pomodoroFlowApp = document.createElement('div');
  pomodoroFlowApp.id = POMODORO_FLOW_ID;
  pomodoroFlowApp.style.padding = '10px';
  pomodoroFlowApp.style.backgroundColor = '#f0f0f0';
  pomodoroFlowApp.style.color = '#333';
  pomodoroFlowApp.style.fontWeight = 'bold';
  pomodoroFlowApp.style.borderRadius = '5px';
  pomodoroFlowApp.style.margin = '10px 0';
  
  // Título da aplicação
  const title = document.createElement('h3');
  title.textContent = 'Pomodoro Flow';
  title.style.margin = '0 0 10px 0';
  pomodoroFlowApp.appendChild(title);
  
  //get element div with data-testid="large-header"
  const header = document.querySelector('div[data-testid="large-header"] > div');
  if (!header) return; // Se o header não existe, não faz nada

  // Adiciona a aplicação ao header
  header.appendChild(pomodoroFlowApp);

  // Renderiza o cronômetro usando o módulo PomodoroTimer
  if (typeof PomodoroTimer !== 'undefined') {
    PomodoroTimer.render(pomodoroFlowApp);
  } else {
    pomodoroFlowApp.textContent = 'Erro: Módulo do cronômetro não carregado!';
  }
}

// Tenta adicionar a mensagem assim que o script é carregado
startPomodoroApp();

// Também adiciona um observador de mutações para detectar quando o DOM é alterado
// Isso é útil para aplicativos de página única como o Todoist que carregam conteúdo dinamicamente
const observer = new MutationObserver(function(mutations) {
  // Se o DOM foi modificado, tenta adicionar a mensagem novamente
  startPomodoroApp();
});

// Configura o observador para monitorar as mudanças no body inteiro
observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

// Garante que a mensagem seja adicionada mesmo se a página carregar lentamente
window.addEventListener('load', startPomodoroApp);
document.addEventListener('DOMContentLoaded', startPomodoroApp);