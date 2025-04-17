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
      
      // Remover o botão de redirecionamento se existir
      const redirectButton = document.getElementById('redirect-button');
      if (redirectButton) {
        redirectButton.remove();
      }
    } else {
      statusElement.textContent = 'Status: Inativo (não está na página do Todoist Today)';
      statusElement.style.backgroundColor = '#ffebee';
      statusElement.style.color = '#c62828';
      
      // Criar botão de redirecionamento se não existir
      if (!document.getElementById('redirect-button')) {
        const redirectButton = document.createElement('button');
        redirectButton.id = 'redirect-button';
        redirectButton.textContent = 'Ir para o Todoist Today';
        redirectButton.style.display = 'block';
        redirectButton.style.width = '100%';
        redirectButton.style.padding = '10px';
        redirectButton.style.marginTop = '10px';
        redirectButton.style.backgroundColor = '#db4c3f';
        redirectButton.style.color = 'white';
        redirectButton.style.border = 'none';
        redirectButton.style.borderRadius = '5px';
        redirectButton.style.cursor = 'pointer';
        
        // Adicionar evento de clique para redirecionar
        redirectButton.addEventListener('click', function() {
          chrome.tabs.update({ url: 'https://app.todoist.com/app/today' });
          window.close(); // Fecha o popup após o redirecionamento
        });
        
        // Adicionar o botão após o elemento de status
        statusElement.after(redirectButton);
      }
    }
  });
});