function showError(message) {
  const container = document.getElementById('history-container');
  if (container) {
      container.innerHTML = `<div class="error">${message}</div>`;
  }
}

function showHistory(history) {
  const container = document.getElementById('history-container');
  if (!container) {
      console.error('Container non trouvé');
      return;
  }

  if (!history || history.length === 0) {
      container.innerHTML = '<p class="no-history">Aucun historique disponible</p>';
      return;
  }

  const html = history.map(item => `
      <div class="history-item">
          <div>${item.title || 'Sans titre'}</div>
          <div class="date">${new Date(item.date).toLocaleDateString()}</div>
      </div>
  `).join('');

  container.innerHTML = html;

  // Ajouter les écouteurs après avoir mis le HTML
  container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', function() {
          const url = this.dataset.url;
          const pageUrl = this.dataset.pageUrl;
          chrome.runtime.sendMessage({
              action: 'download',
              url: url,
              pageUrl: pageUrl
          });
      });
  });
}

// Fonction principale
function init() {
  try {
      chrome.storage.local.get('history', function(data) {
          if (chrome.runtime.lastError) {
              showError('Erreur lors du chargement: ' + chrome.runtime.lastError.message);
              return;
          }
          showHistory(data.history);
      });

      const downloadLatestBtn = document.getElementById('download-latest');
      downloadLatestBtn.addEventListener('click', function() {
          chrome.runtime.sendMessage({ action: 'downloadLatest' });
      });
  } catch (error) {
      showError('Erreur: ' + error.message);
  }
}

// S'assurer que le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}