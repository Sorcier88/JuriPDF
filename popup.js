document.getElementById('download-latest').addEventListener('click', () => {
  console.log("Bouton cliqué"); // Pour le débogage
  browser.runtime.sendMessage({ action: "downloadLatest" })
    .catch(error => console.error('Erreur:', error));
});

// Charger et afficher l'historique
async function loadHistory() {
  try {
    const { history = [] } = await browser.storage.local.get('history');
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-item">Aucun PDF dans l\'historique</div>';
      return;
    }
    
    historyList.innerHTML = history.map(item => `
      <div class="history-item" data-url="${item.url}">
        <div>${item.title}</div>
        <div class="date">${new Date(item.date).toLocaleString()}</div>
      </div>
    `).join('');

    // Ajouter les événements de clic pour chaque élément
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        console.log("Élément d'historique cliqué", item.dataset.url); // Pour le débogage
        browser.runtime.sendMessage({
          action: "download",
          url: item.dataset.url
        }).catch(error => console.error('Erreur:', error));
      });
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error);
  }
}

// Charger l'historique au démarrage
loadHistory();

// Mettre à jour l'historique quand il change
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.history) {
    loadHistory();
  }
}); 