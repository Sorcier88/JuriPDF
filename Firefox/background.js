let lastPdfUrl = null;
let lastPageUrl = null;
const MAX_HISTORY_ITEMS = 10;

// Initialisation du menu contextuel
browser.contextMenus.create({
  id: "download-pdf",
  title: "Télécharger le PDF",
  contexts: ["page"],
  documentUrlPatterns: ["*://*.stradalex.com/*", "*://*.lexnow.io/*"]
});

// Écoute toutes les requêtes
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Détecter si c'est une URL Lexnow
    if (details.url.includes('lexnow.io') || details.url.includes('storage.googleapis.com/lexnow-doc-content')) {
      if (details.url.includes('storage.googleapis.com/lexnow-doc-content')) {
        lastPdfUrl = details.url;
        
        browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
          if (tabs[0]) {
            lastPageUrl = tabs[0].url;
            console.log('URL de la page Lexnow:', lastPageUrl);
            console.log('URL du PDF Lexnow:', lastPdfUrl);
          }
        });

        handlePdfDetection(lastPdfUrl, lastPageUrl);
      }
    } 
    // Détecter si c'est une URL Stradalex
    else if (details.url.includes('.pdf') || details.url.includes('/pdf/')) {
      lastPdfUrl = details.url;
      
      // Capturer l'URL de la page active avant de mettre à jour lastPdfUrl
      browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
        if (tabs[0]) {
          lastPageUrl = tabs[0].url;
          console.log('URL de la page Stradalex:', lastPageUrl);
          console.log('URL du PDF Stradalex:', lastPdfUrl);
          
          // Appeler handlePdfDetection ici, après avoir capturé l'URL de la page
          handlePdfDetection(lastPdfUrl, lastPageUrl);
        }
      });
    }
  },
  {
    urls: [
      "*://*.stradalex.com/*",
      "*://*.lexnow.io/*",
      "*://app.lexnow.io/*",
      "*://storage.googleapis.com/lexnow-doc-content/*"
    ],
    types: ["main_frame", "sub_frame", "xmlhttprequest"]
  }
);

function handlePdfDetection(pdfUrl, pageUrl) {
  if (!pdfUrl) return;

  // Stocker l'URL de la page pour une utilisation ultérieure
  lastPageUrl = pageUrl;

  addToHistory({
    url: pdfUrl,
    pageUrl: pageUrl,
    date: new Date().toISOString(),
    title: extractFileName(pageUrl || pdfUrl)  // Utiliser d'abord l'URL de la page
  });

  browser.notifications.create({
    type: "basic",
    iconUrl: browser.runtime.getURL("icon.png"),
    title: "PDF Détecté",
    message: "Un nouveau PDF est disponible au téléchargement"
  });
}

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
  const { history = [] } = await browser.storage.local.get('history');
  
  const exists = history.some(item => item.url === pdfInfo.url);
  if (!exists) {
    history.unshift(pdfInfo);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
    await browser.storage.local.set({ history });
  }
}

// Gestionnaire de clic sur le bouton de l'extension
browser.browserAction.onClicked.addListener(() => {
  if (lastPdfUrl) {
    downloadPdf(lastPdfUrl, lastPageUrl);
  } else {
    browser.notifications.create({
      type: "basic",
      iconUrl: browser.runtime.getURL("icon.png"),
      title: "Aucun PDF détecté",
      message: "Aucun PDF n'a été détecté sur cette page."
    });
  }
});

// Gestionnaire de clic sur le menu contextuel
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "download-pdf" && lastPdfUrl) {
    downloadPdf(lastPdfUrl, lastPageUrl);
  }
});

// Gestionnaire de messages depuis le popup
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "downloadLatest") {
    downloadPdf(lastPdfUrl, lastPageUrl);
  } else if (message.action === "download") {
    downloadPdf(message.url, message.pageUrl);
  }
});

function downloadPdf(url, pageUrl) {
  if (url) {
    console.log("Tentative de téléchargement:", url);
    let filename;
    
    // Si c'est une URL Stradalex, utiliser l'URL de la page pour le nom
    if (pageUrl && pageUrl.includes('stradalex')) {
      filename = extractFileName(pageUrl);
    } else {
      filename = extractFileName(url);
    }
    
    browser.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    }).catch(error => {
      console.error("Erreur lors du téléchargement:", error);
      browser.notifications.create({
        type: "basic",
        iconUrl: browser.runtime.getURL("icon.png"),
        title: "Erreur de téléchargement",
        message: "Impossible de télécharger le PDF. " + error.message
      });
    });
  }
} 