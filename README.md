# JuriPDF - Extension Firefox pour Stradalex & Lexnow

JuriPDF est une extension Firefox qui permet de télécharger facilement les PDFs depuis Stradalex et Lexnow avec un nommage automatique des fichiers.

## Fonctionnalités

- Détection automatique des PDFs sur Stradalex et Lexnow
- Téléchargement via :
  - Un bouton dans la barre d'outils
  - Un menu contextuel (clic droit)
  - Une interface popup avec historique
- Nommage automatique des fichiers :
  - Pour Stradalex : utilise l'identifiant du document (ex: PRIDRADM_004.pdf)
  - Pour Lexnow : utilise l'identifiant du document
- Historique des 10 derniers PDFs détectés
- Notifications lors de la détection d'un PDF (Bêta)

# Installation sur Firefox (PC)

⚠️ **Comme l'extension n'est pas disponible sur Firefox Browser Add-ons**, il faut l'installer manuellement. Voici comment faire !

---

## 🛠️ Installation permanente de JuriPDF (méthode recommandée)

🚀 **Une fois installée, l'extension reste active même après le redémarrage de Firefox.**

### 📥 Étape unique : Installer l'extension

1. Télécharger l’extention
    - Cliquez sur ce lien pour télécharger l'extension : [JuriPDF - Firefox Add-ons](https://addons.mozilla.org/firefox/downloads/file/4464530/84b5dedd8eec4440bd01-1.2.xpi)
        - L’installation se fait automatiquement, passez à l’étape 2.
    - Si rien ne se produit ou que le lien ne fonctionne pas, [télécharger le fichier directement depuis la page de releases](https://github.com/Sorcier88/JuriPDF/releases).
        - Une fois téléchargé, ouvrez le fichier avec Firefox.
        - Une fois l’installation terminée, vous pourrez supprimer le fichier.
2. Si une fenêtre contextuelle apparaîtra dans Firefox pour vous demander de confirmer l'installation. Cliquez sur **"Continuer l'installation"**.
3. Firefox vous demandera ensuite de confirmer l'ajout de l'extension. Cliquez sur **"Ajouter"**.
4. L'extension est maintenant installée et prête à l'emploi ! 🎉

✅ **Vous n'avez plus besoin de recharger l'extension après chaque redémarrage.** 

---

## 🛠️ Installation temporaire (méthode complexe)

🚀 **Idéal pour tester rapidement l'extension**

💡 **⚠️ Elle doit être rechargée après chaque redémarrage de Firefox.**

### 🔧 Étape 1 : Ouvrir le mode développeur

1. Ouvrez **Firefox** et tapez **`about:debugging`** dans la barre d'adresse.
2. Dans le menu de gauche, cliquez sur **"Ce Firefox"**.

### 📂 Étape 2 : Charger l'extension

1. **Téléchargez** l’extension depuis la page de releases du [GitHub](https://github.com/Sorcier88/JuriPDF/releases).
2. **Décompressez** le fichier ZIP dans un dossier accessible.
3. Sur la page `about:debugging`, cliquez sur **"Charger un module complémentaire temporaire"**.
4. Sélectionnez le fichier **`manifest.json`** du dossier extrait.

✅ **L'extension est maintenant installée et prête à l'emploi !** 🎉

⚠️ **Attention !** L'extension **sera désactivée** à chaque redémarrage de Firefox. Pour continuer à l'utiliser, vous devrez refaire ces étapes.

---

# :chrome: Installation sur Chrome

⚠️ **Comme l'extension n'est pas disponible sur le Chrome Web Store**, il faut l'installer manuellement. Voici comment faire ! 

---

## 🛠️ Installation de l’extension Chrome non empaquetée

🚀 **Une fois installée, l'extension reste active tant que le mode développeur est activé**

### 🔧 Étape 1 : Accéder à la page des extensions

1. Ouvrez **Google Chrome.** 
2. Tapez `chrome://extensions/` dans la barre d'adresse et appuyez sur **Entrée**.
3. Activez le **Mode développeur** en haut à droite.

### 📥 Étape 2 : Télécharger l’extension

1. **Téléchargez** l’extension via la page de releases du [GitHub](https://github.com/Sorcier88/JuriPDF/releases).
2. **Décompressez** le fichier ZIP dans un dossier accessible.
3. Garder tous les fichier dans un dossier où il n’y a que ça. Le dossier servira à installer l’extension dans Chrome. Il ne faut pas toucher à ce dossier mais vous pouvez le mettre où vous le souhaitez sur votre PC. 

### 📂 Étape 3 : Charger l'Extension

1. Cliquez sur le bouton **"Charger l'extension non empaquetée"** qui apparaît en haut à gauche de la page des extensions. 
2. Une fenêtre de sélection de dossier s'ouvrira. Sélectionnez le dossier contenant tous les fichiers de l'extension.

### ✅ Étape 4 : Vérifier l'Installation

1. L'extension devrait maintenant apparaître dans la liste des extensions installées.
2. Vérifiez que l'extension est activée (le bouton à côté de son nom doit être bleu). 

### 💡 Conseils Utiles

- **Gardez le Mode Développeur Activé** : Pour que l'extension non empaquetée reste active, le mode développeur doit rester activé.
