// Arquivo responsável pela lógica e renderização do cronômetro Pomodoro

// Namespace para as funções do cronômetro
const PomodoroTimer = {
  // Configurações globais do círculo de carregamento
  circuloCarregamentoTamanho: 250, // Tamanho do círculo em px
  circuloCarregamentoTamanhoBorda: 24, // Espessura da borda em px

  // Sons do timer
  sounds: {
    start: 'https://cdn.pixabay.com/audio/2023/05/29/audio_697c02e935.mp3', // Som de clique para início
    complete: 'https://cdn.pixabay.com/audio/2024/02/07/audio_c059f11d86.mp3' // Som de alarme para término
  },

  // Estado inicial do timer
  state: {
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutos em segundos
    totalTime: 25 * 60, // Tempo total do timer atual
    mode: 'pomodoro', // 'pomodoro', 'shortBreak', 'longBreak'
    interval: null,
    startTimestamp: null, // Novo: armazena o timestamp de quando o timer começou
    endTimestamp: null, // Novo: armazena o timestamp de quando o timer deve terminar
    checkTimeoutId: null // Novo: para verificar a conclusão do timer
  },

  // Função para criar e renderizar o cronômetro
  render: function(container) {
    const timerElement = document.createElement('div');
    timerElement.id = 'pomodoro-timer';
    timerElement.classList.add('pomodoro-timer');
    
    // Estilização para o container principal - modificado para layout horizontal
    timerElement.style.display = 'flex';
    timerElement.style.flexDirection = 'row';
    timerElement.style.alignItems = 'center';
    timerElement.style.justifyContent = 'center';
    timerElement.style.padding = '20px';
    timerElement.style.borderRadius = '10px';
    timerElement.style.fontFamily = 'Arial, sans-serif';
    timerElement.style.color = '#333333';
    
    // Cálculo do raio com base nas configurações globais
    const radius = (this.circuloCarregamentoTamanho / 2) - (this.circuloCarregamentoTamanhoBorda / 2);
    
    // Estrutura do timer com nova organização (timer à esquerda, controles à direita)
    timerElement.innerHTML = `
      <div class="timer-left-container">
        <div class="timer-circle-container" style="position: relative; width: ${this.circuloCarregamentoTamanho}px; height: ${this.circuloCarregamentoTamanho}px;">
          <!-- Círculo de progresso de fundo -->
          <div class="timer-progress-bg" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; box-sizing: border-box; border: ${this.circuloCarregamentoTamanhoBorda}px solid #444450;"></div>
          
          <!-- Círculo de progresso que se preenche -->
          <svg class="timer-progress" style="position: absolute; width: 100%; height: 100%; transform: rotate(-90deg);">
            <circle class="timer-progress-ring" cx="${this.circuloCarregamentoTamanho/2}" cy="${this.circuloCarregamentoTamanho/2}" r="${radius}" stroke="#6C63FF" stroke-width="${this.circuloCarregamentoTamanhoBorda}" fill="transparent" stroke-linecap="round"></circle>
          </svg>
          
          <!-- Conteúdo central do timer -->
          <div class="timer-content" style="position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; border-radius: 50%;">
            <div class="timer-display" style="font-size: 54px; font-weight: bold; color: #333333;">${this.formatTime(this.state.timeLeft)}</div>
          </div>
        </div>
      </div>
      
      <!-- Container para os controles e modos à direita -->
      <div class="timer-right-controls" style="margin-left: 60px; display: flex; flex-direction: column; align-items: flex-start;">
        
        <!-- Controles principais do timer (play/pause e reset) -->
        <div class="main-controls" style="display: flex; justify-content: flex-start; gap: 10px; margin-bottom: 30px;">
          <button id="start-timer" title="Iniciar/Pausar" style="width: 40px; height: 40px; border-radius: 8px; border: none; background-color: #333340; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">▶</button>
          <button id="reset-timer" title="Reiniciar" style="width: 40px; height: 40px; border-radius: 8px; border: none; background-color: #333340; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">↻</button>
        </div>
        
        <!-- Texto para modos -->
        <div class="modes-label" style="margin-bottom: 15px; font-size: 16px; color: #333333; font-weight: 600;">
          Modos:
        </div>
        
        <!-- Controles de modo do timer -->
        <div class="timer-modes" style="display: flex; align-items: center; justify-content: flex-start; gap: 10px;">
          <button id="pomodoro-mode" class="mode-btn active-mode" title="Pomodoro" style="width: 40px; height: 40px; border-radius: 8px; border: none; background-color: #472525; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🍅</button>
          <button id="short-break-mode" class="mode-btn" title="Pausa Curta" style="width: 40px; height: 40px; border-radius: 8px; border: none; background-color: #333340; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">☕</button>
          <button id="long-break-mode" class="mode-btn" title="Pausa Longa" style="width: 40px; height: 40px; border-radius: 8px; border: none; background-color: #333340; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">☕<span style="font-size: 10px; position: relative; top: -8px;">x3</span></button>
        </div>
      </div>
    `;
    
    // Adiciona o timer ao container
    container.appendChild(timerElement);
    
    // Configure a borda de progresso para indicar o estado inicial
    this.setupProgressRing();
    
    // Adiciona os event listeners para os botões
    this.setupEventListeners();

    // Novo: Adiciona listener para o evento de visibilidade da página
    this.setupVisibilityListener();
    
    return timerElement;
  },
  
  // Configura o anel de progresso inicial
  setupProgressRing: function() {
    const progressRing = document.querySelector('.timer-progress-ring');
    if (progressRing) {
      const radius = (this.circuloCarregamentoTamanho / 2) - (this.circuloCarregamentoTamanhoBorda / 2);
      const circumference = 2 * Math.PI * radius;
      progressRing.style.strokeDasharray = `${circumference}`;
      progressRing.style.strokeDashoffset = '0';
    }
  },
  
  // Configura os listeners de eventos para os botões do timer
  setupEventListeners: function() {
    const pomodoroTimer = document.getElementById('pomodoro-timer');
    if (!pomodoroTimer) return; // Se o timer não existe, não faz nada

    // Botão de iniciar/pausar
    const startButton = pomodoroTimer.querySelector('#start-timer');
    startButton?.addEventListener('click', () => {
      if (this.state.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    });
    
    // Botão de reiniciar
    const resetButton = pomodoroTimer.querySelector('#reset-timer');
    resetButton?.addEventListener('click', () => {
      this.resetTimer();
    });
    
    // Botões de modo
    pomodoroTimer.querySelector('#pomodoro-mode')?.addEventListener('click', () => {
      this.setMode('pomodoro');
      this.setActiveButton('#pomodoro-mode');
    });
    
    pomodoroTimer.querySelector('#short-break-mode')?.addEventListener('click', () => {
      this.setMode('shortBreak');
      this.setActiveButton('#short-break-mode');
    });
    
    pomodoroTimer.querySelector('#long-break-mode')?.addEventListener('click', () => {
      this.setMode('longBreak');
      this.setActiveButton('#long-break-mode');
    });
  },

  // Novo: Configura listener para mudanças de visibilidade da página
  setupVisibilityListener: function() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.state.isRunning) {
        // Recalcula o tempo restante quando a página fica visível novamente
        this.updateTimeLeftBasedOnTimestamp();
      }
    });
  },
  
  // Define o botão ativo (destaque visual)
  setActiveButton: function(buttonId) {
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
      btn.style.backgroundColor = '#333340';
      btn.classList.remove('active-mode');
    });
    
    const activeButton = document.querySelector(buttonId);
    if (activeButton) {
      activeButton.style.backgroundColor = this.getModeColor();
      activeButton.classList.add('active-mode');
    }
  },
  
  // Retorna a cor do modo atual
  getModeColor: function() {
    switch (this.state.mode) {
      case 'pomodoro':
        return '#472525'; // Alterado para o vermelho mais escuro para Pomodoro
      case 'shortBreak':
        return '#4c9195'; // Verde-azulado para pausa curta
      case 'longBreak':
        return '#457ca3'; // Azul para pausa longa
      default:
        return '#6C63FF';
    }
  },
  
  // Inicia o cronômetro
  startTimer: function() {
    if (this.state.isRunning) return;
    
    // Reproduz o som de início do cronômetro
    const startSound = new Audio(this.sounds.start);
    startSound.play();
    
    this.state.isRunning = true;
    
    // Atualiza o ícone do botão para pausa
    const startButton = document.querySelector('#start-timer');
    if (startButton) {
      startButton.innerHTML = '❚❚';
      startButton.title = 'Pausar';
    }

    // Novo: Define os timestamps de início e término
    const now = Date.now();
    this.state.startTimestamp = now;
    this.state.endTimestamp = now + (this.state.timeLeft * 1000);

    // Configura um intervalo para atualizar a exibição a cada segundo
    this.state.interval = setInterval(() => {
      this.updateTimeLeftBasedOnTimestamp();
      this.updateTimerDisplay();
      this.updateProgressRing();
    }, 900);

    // Configura um timeout para verificar a conclusão do timer
    this.scheduleCompletionCheck();
  },
  
  // Novo: Atualiza o tempo restante com base no timestamp
  updateTimeLeftBasedOnTimestamp: function() {
    if (!this.state.isRunning || !this.state.endTimestamp) return;
    
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((this.state.endTimestamp - now) / 1000));
    
    // Atualiza o tempo restante
    this.state.timeLeft = remaining;
    
    // Verifica se o timer chegou ao fim
    if (this.state.timeLeft <= 0) {
      this.timerComplete();
    }
  },

  // Novo: Agenda verificação de conclusão do timer (funciona mesmo em segundo plano)
  scheduleCompletionCheck: function() {
    // Limpa qualquer verificação existente
    if (this.state.checkTimeoutId) {
      clearTimeout(this.state.checkTimeoutId);
    }

    // Se o timer não estiver rodando ou já estiver no fim, não agenda
    if (!this.state.isRunning || this.state.timeLeft <= 0) return;

    // Calcula o tempo exato para a conclusão
    const timeToCompletion = this.state.timeLeft * 1000;
    
    // Configura um timeout que será executado no momento exato da conclusão
    this.state.checkTimeoutId = setTimeout(() => {
      // Verifica se o timer ainda está rodando quando o timeout executa
      if (this.state.isRunning) {
        this.timerComplete();
      }
    }, timeToCompletion);
  },
  
  // Pausa o cronômetro
  pauseTimer: function() {
    if (!this.state.isRunning) return;
    
    this.state.isRunning = false;
    clearInterval(this.state.interval);
    
    // Novo: Limpa o timeout de verificação de conclusão
    if (this.state.checkTimeoutId) {
      clearTimeout(this.state.checkTimeoutId);
      this.state.checkTimeoutId = null;
    }
    
    // Atualiza o ícone do botão para play
    const startButton = document.querySelector('#start-timer');
    if (startButton) {
      startButton.innerHTML = '▶';
      startButton.title = 'Iniciar';
    }
  },
  
  // Reinicia o cronômetro
  resetTimer: function() {
    this.pauseTimer();
    
    // Define o tempo baseado no modo atual
    this.setTimeForCurrentMode();
    
    // Novo: Limpa os timestamps
    this.state.startTimestamp = null;
    this.state.endTimestamp = null;
    
    this.updateTimerDisplay();
    this.updateProgressRing();
  },
  
  // Define o tempo com base no modo atual
  setTimeForCurrentMode: function() {
    switch (this.state.mode) {
      case 'pomodoro':
        this.state.timeLeft = 25 * 60;
        this.state.totalTime = 25 * 60;
        break;
      case 'shortBreak':
        this.state.timeLeft = 5 * 60;
        this.state.totalTime = 5 * 60;
        break;
      case 'longBreak':
        this.state.timeLeft = 15 * 60;
        this.state.totalTime = 15 * 60;
        break;
    }
  },
  
  // Atualiza o display do cronômetro
  updateTimerDisplay: function() {
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = this.formatTime(this.state.timeLeft);
    }
  },
  
  // Atualiza o anel de progresso
  updateProgressRing: function() {
    const progressRing = document.querySelector('.timer-progress-ring');
    if (progressRing) {
      const radius = (this.circuloCarregamentoTamanho / 2) - (this.circuloCarregamentoTamanhoBorda / 2);
      const circumference = 2 * Math.PI * radius;
      const progressPercentage = 1 - (this.state.timeLeft / this.state.totalTime);
      const offset = circumference * progressPercentage;
      
      // Define a cor e o offset do anel de progresso
      progressRing.style.stroke = this.getModeColor();
      progressRing.style.strokeDasharray = circumference;
      progressRing.style.strokeDashoffset = offset;
    }
  },
  
  // Formata o tempo em segundos para MM:SS
  formatTime: function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
  
  // Define o modo do timer (pomodoro, pausa curta ou pausa longa)
  setMode: function(mode) {
    // Se o timer estiver rodando, pergunte antes de mudar o modo
    if (this.state.isRunning) {
      if (!confirm('O timer está rodando. Deseja mudar o modo e reiniciar o timer?')) {
        return;
      }
      this.pauseTimer();
    }
    
    this.state.mode = mode;
    
    // Reseta o timer para o tempo adequado ao modo
    this.setTimeForCurrentMode();
    
    // Atualiza a cor do anel de progresso
    this.updateProgressRing();
    
    // Atualiza o display do timer
    this.updateTimerDisplay();
    
    // Atualiza o ícone do botão para play
    const startButton = document.querySelector('#start-timer');
    if (startButton) {
      startButton.innerHTML = '▶';
      startButton.title = 'Iniciar';
    }

    // Novo: Limpa os timestamps ao trocar de modo
    this.state.startTimestamp = null;
    this.state.endTimestamp = null;
  },
  
  // Função chamada quando o timer chega a zero
  timerComplete: function() {
    // Evita dupla execução
    if (!this.state.isRunning) return;
    
    this.pauseTimer();
    
    // Notificação de que o timer acabou
    const audio = new Audio(this.sounds.complete);
    audio.play();
    
    // Alterna automaticamente entre modos
    if (this.state.mode === 'pomodoro') {
      this.setMode('shortBreak');
      this.setActiveButton('#short-break-mode');
    } else {
      this.setMode('pomodoro');
      this.setActiveButton('#pomodoro-mode');
    }
  }
};
