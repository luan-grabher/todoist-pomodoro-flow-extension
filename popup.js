// Script para o popup da extensão
document.addEventListener('DOMContentLoaded', function() {
  // Verifica se estamos na página correta do Todoist
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    const statusElement = document.querySelector('.status');
    
    if (currentUrl.includes('app.todoist.com/app/today')) {
      statusElement.textContent = 'Status: Ativo na página do Todoist Today';
      statusElement.style.backgroundColor = '#e0f7e0';
      statusElement.style.color = '#2e7d32';
    } else {
      statusElement.textContent = 'Status: Inativo (não está na página do Todoist Today)';
      statusElement.style.backgroundColor = '#ffebee';
      statusElement.style.color = '#c62828';
    }
  });
});