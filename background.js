// Script de background que roda em segundo plano
console.log("Background script da extensão Pomodoro Flow carregado");

// Ouvinte para quando a extensão for instalada ou atualizada
chrome.runtime.onInstalled.addListener(function(details) {
  console.log("Extensão Pomodoro Flow instalada/atualizada:", details.reason);
});