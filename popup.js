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
    historyList.innerHTML = ''; // Vider la liste

    if (history.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'history-item';
      emptyMessage.textContent = "Aucun PDF dans l'historique";
      historyList.appendChild(emptyMessage);
      return;
    }

    history.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.dataset.url = item.url;

      const titleDiv = document.createElement('div');
      titleDiv.textContent = item.title;

      const dateDiv = document.createElement('div');
      dateDiv.className = 'date';
      dateDiv.textContent = new Date(item.date).toLocaleString();

      div.appendChild(titleDiv);
      div.appendChild(dateDiv);
      historyList.appendChild(div);

      // Ajouter l'événement de clic
      div.addEventListener('click', () => {
        console.log("Élément d'historique cliqué", item.url); // Pour le débogage
        browser.runtime.sendMessage({
          action: "download",
          url: item.url
        }).catch(error => console.error('Erreur:', error));
      });
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique:", error);
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
