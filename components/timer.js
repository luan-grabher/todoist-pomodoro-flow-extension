// Arquivo responsável pela lógica e renderização do cronômetro Pomodoro

// Namespace para as funções do cronômetro
const PomodoroTimer = {
  // Estado inicial do timer
  state: {
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutos em segundos
    mode: 'pomodoro', // 'pomodoro', 'shortBreak', 'longBreak'
    interval: null
  },

  // Função para criar e renderizar o cronômetro
  render: function(container) {
    const timerElement = document.createElement('div');
    timerElement.id = 'pomodoro-timer';
    timerElement.classList.add('pomodoro-timer');
    
    // Estilização básica do timer
    timerElement.style.fontSize = '24px';
    timerElement.style.textAlign = 'center';
    timerElement.style.padding = '10px';
    timerElement.style.marginTop = '10px';
    timerElement.style.backgroundColor = '#e44332'; // Cor vermelha para o modo pomodoro
    timerElement.style.color = 'white';
    timerElement.style.borderRadius = '5px';
    
    // Estrutura do timer
    timerElement.innerHTML = `
      <div class="timer-display">${this.formatTime(this.state.timeLeft)}</div>
      <div class="timer-controls" style="margin-top: 10px;">
        <button id="start-timer" style="margin-right: 5px; padding: 5px 10px;">Iniciar</button>
        <button id="pause-timer" style="margin-right: 5px; padding: 5px 10px;" disabled>Pausar</button>
        <button id="reset-timer" style="padding: 5px 10px;">Reiniciar</button>
      </div>
      <div class="timer-modes" style="margin-top: 10px;">
        <button id="mode-pomodoro" style="margin-right: 5px; padding: 5px 10px; background-color: #e44332; color: white;">Pomodoro</button>
        <button id="mode-short-break" style="margin-right: 5px; padding: 5px 10px;">Pausa Curta</button>
        <button id="mode-long-break" style="padding: 5px 10px;">Pausa Longa</button>
      </div>
    `;
    
    // Adiciona o timer ao container
    container.appendChild(timerElement);
    
    // Adiciona os event listeners para os botões
    this.setupEventListeners();
    
    return timerElement;
  },
  
  // Configura os listeners de eventos para os botões do timer
  setupEventListeners: function() {
    document.getElementById('start-timer')?.addEventListener('click', () => this.startTimer());
    document.getElementById('pause-timer')?.addEventListener('click', () => this.pauseTimer());
    document.getElementById('reset-timer')?.addEventListener('click', () => this.resetTimer());
    
    document.getElementById('mode-pomodoro')?.addEventListener('click', () => this.setMode('pomodoro'));
    document.getElementById('mode-short-break')?.addEventListener('click', () => this.setMode('shortBreak'));
    document.getElementById('mode-long-break')?.addEventListener('click', () => this.setMode('longBreak'));
  },
  
  // Inicia o cronômetro
  startTimer: function() {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    document.getElementById('start-timer').disabled = true;
    document.getElementById('pause-timer').disabled = false;
    
    this.state.interval = setInterval(() => {
      this.state.timeLeft -= 1;
      this.updateTimerDisplay();
      
      if (this.state.timeLeft <= 0) {
        this.timerComplete();
      }
    }, 1000);
  },
  
  // Pausa o cronômetro
  pauseTimer: function() {
    if (!this.state.isRunning) return;
    
    this.state.isRunning = false;
    document.getElementById('start-timer').disabled = false;
    document.getElementById('pause-timer').disabled = true;
    
    clearInterval(this.state.interval);
  },
  
  // Reinicia o cronômetro
  resetTimer: function() {
    this.pauseTimer();
    
    // Define o tempo baseado no modo atual
    switch (this.state.mode) {
      case 'pomodoro':
        this.state.timeLeft = 25 * 60;
        break;
      case 'shortBreak':
        this.state.timeLeft = 5 * 60;
        break;
      case 'longBreak':
        this.state.timeLeft = 15 * 60;
        break;
    }
    
    this.updateTimerDisplay();
  },
  
  // Atualiza o display do cronômetro
  updateTimerDisplay: function() {
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = this.formatTime(this.state.timeLeft);
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
    this.pauseTimer();
    this.state.mode = mode;
    
    // Reseta o timer para o tempo adequado ao modo
    switch (mode) {
      case 'pomodoro':
        this.state.timeLeft = 25 * 60;
        document.getElementById('pomodoro-timer').style.backgroundColor = '#e44332';
        break;
      case 'shortBreak':
        this.state.timeLeft = 5 * 60;
        document.getElementById('pomodoro-timer').style.backgroundColor = '#4c9195';
        break;
      case 'longBreak':
        this.state.timeLeft = 15 * 60;
        document.getElementById('pomodoro-timer').style.backgroundColor = '#457ca3';
        break;
    }
    
    // Atualiza a aparência dos botões de modo
    document.getElementById('mode-pomodoro').style.backgroundColor = mode === 'pomodoro' ? '#e44332' : '';
    document.getElementById('mode-pomodoro').style.color = mode === 'pomodoro' ? 'white' : '';
    
    document.getElementById('mode-short-break').style.backgroundColor = mode === 'shortBreak' ? '#4c9195' : '';
    document.getElementById('mode-short-break').style.color = mode === 'shortBreak' ? 'white' : '';
    
    document.getElementById('mode-long-break').style.backgroundColor = mode === 'longBreak' ? '#457ca3' : '';
    document.getElementById('mode-long-break').style.color = mode === 'longBreak' ? 'white' : '';
    
    this.updateTimerDisplay();
  },
  
  // Função chamada quando o timer chega a zero
  timerComplete: function() {
    this.pauseTimer();
    
    // Notificação de que o timer acabou
    const audio = new Audio('https://soundbible.com/grab.php?id=1746&type=mp3');
    audio.play();
    
    // Alterna automaticamente entre modos (opcional)
    if (this.state.mode === 'pomodoro') {
      this.setMode('shortBreak');
    } else {
      this.setMode('pomodoro');
    }
  }
};
