// Stockage des variables dans chrome.storage car les Service Workers ne gardent pas les variables globales
async function setLastUrls(pdfUrl, pageUrl) {
  await chrome.storage.local.set({ lastPdfUrl: pdfUrl, lastPageUrl: pageUrl });
}

async function getLastUrls() {
  const { lastPdfUrl, lastPageUrl } = await chrome.storage.local.get(['lastPdfUrl', 'lastPageUrl']);
  return { lastPdfUrl, lastPageUrl };
}

const MAX_HISTORY_ITEMS = 10;

// Initialisation du menu contextuel
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "download-pdf",
    title: "Télécharger le PDF",
    contexts: ["page"],
    documentUrlPatterns: ["*://*.stradalex.com/*", "*://*.lexnow.io/*"]
  });
});

// Écoute toutes les requêtes
// ... existing code ...

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    console.log('Requête détectée:', details.url);
    
    try {
      // Détection Lexnow améliorée
      if (details.url.includes('lexnow.io') || details.url.includes('lexnow-doc-content')) {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const pageUrl = tabs[0]?.url || '';
        
        if (details.url.includes('lexnow-doc-content')) {
          console.log('PDF Lexnow détecté:', details.url);
          await setLastUrls(details.url, pageUrl);
          await handlePdfDetection(details.url, pageUrl);
        }
      } 
      // Détection Stradalex améliorée
      else if (details.url.includes('stradalex.com')) {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const pageUrl = tabs[0]?.url || '';
        
        // Vérification plus précise pour Stradalex
        if (
          details.url.includes('.pdf') || 
          details.url.includes('/pdf/') || 
          details.url.includes('/doc/') ||
          details.url.match(/\/[A-Z0-9_]+$/i)
        ) {
          console.log('PDF Stradalex détecté:', details.url);
          await setLastUrls(details.url, pageUrl);
          await handlePdfDetection(details.url, pageUrl);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la détection:', error);
    }
  },
  {
    urls: [
      "*://*.stradalex.com/*",
      "*://*.lexnow.io/*",
      "*://storage.googleapis.com/lexnow-doc-content/*"
    ],
    types: ["main_frame", "sub_frame", "xmlhttprequest", "other"]
  },
);

// Amélioration de la fonction handlePdfDetection
async function handlePdfDetection(pdfUrl, pageUrl) {
  if (!pdfUrl) return;
  
  try {
    console.log('Traitement du PDF:', pdfUrl);
    
    await addToHistory({
      url: pdfUrl,
      pageUrl: pageUrl,
      date: new Date().toISOString(),
      title: extractFileName(pageUrl || pdfUrl)
    });

    await chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon.png"),
      title: "PDF Détecté",
      message: "Un nouveau PDF est disponible au téléchargement"
    });
  } catch (error) {
    console.error('Erreur dans handlePdfDetection:', error);
  }
}

// ... existing code ...

// La fonction extractFileName reste inchangée
function extractFileName(url) {

  // Pour les URLs de type Stradalex standard
  const stradalexMatch = url.match(/\/doc\/([A-Z0-9_]+)/i);
  if (stradalexMatch && stradalexMatch[1]) {
    return stradalexMatch[1] + '.pdf';
  }
  
  // Pour les URLs de stockage Google Cloud de Lexnow
  const lexnowGoogleMatch = url.match(/lexnow-doc-content\/([^\/\?]+)/);
  if (lexnowGoogleMatch && lexnowGoogleMatch[1]) {
    return `lexnow-${lexnowGoogleMatch[1]}.pdf`;
  }
  
  // Pour les URLs de type lexnow
  const lexnowMatch = url.match(/\/detail\/(\d+)/);
  if (lexnowMatch && lexnowMatch[1]) {
    return `lexnow-${lexnowMatch[1]}.pdf`;
  }
  
  // Pour les autres URLs Stradalex
  const docMatch = url.match(/\/([A-Z0-9_]+)$/i);
  if (docMatch && docMatch[1]) {
    return docMatch[1] + '.pdf';
  }
  
  return "document-juridique.pdf";

}

// Gestion de l'historique
async function addToHistory(pdfInfo) {
  const { history = [] } = await chrome.storage.local.get('history');
  
  const exists = history.some(item => item.url === pdfInfo.url);
  if (!exists) {
    history.unshift(pdfInfo);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
    await chrome.storage.local.set({ history });
  }
}

// Gestionnaire de clic sur le bouton de l'extension
chrome.action.onClicked.addListener(async () => {
  const { lastPdfUrl, lastPageUrl } = await getLastUrls();
  if (lastPdfUrl) {
    await downloadPdf(lastPdfUrl, lastPageUrl);
  } else {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon.png"),
      title: "Aucun PDF détecté",
      message: "Aucun PDF n'a été détecté sur cette page."
    });
  }
});

// Gestionnaire de clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "download-pdf") {
    const { lastPdfUrl, lastPageUrl } = await getLastUrls();
    if (lastPdfUrl) {
      await downloadPdf(lastPdfUrl, lastPageUrl);
    }
  }
});

// Gestionnaire de messages depuis le popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadLatest") {
    getLastUrls().then(({lastPdfUrl, lastPageUrl}) => {
      downloadPdf(lastPdfUrl, lastPageUrl);
    });
  } else if (message.action === "download") {
    downloadPdf(message.url, message.pageUrl);
  }
});

async function downloadPdf(url, pageUrl) {
  if (url) {
    console.log("Tentative de téléchargement:", url);
    let filename;
    
    if (pageUrl && pageUrl.includes('stradalex')) {
      filename = extractFileName(pageUrl);
    } else {
      filename = extractFileName(url);
    }
    
    try {
      await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      await chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: "Erreur de téléchargement",
        message: "Impossible de télécharger le PDF. " + error.message
      });
    }
  }
}