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
- Notifications lors de la détection d'un PDF

## Installation

### Installation temporaire (pour le développement)
1. Ouvrez Firefox
2. Tapez `about:debugging` dans la barre d'adresse
3. Cliquez sur "Ce Firefox"
4. Cliquez sur "Charger un module complémentaire temporaire"
5. Sélectionnez le fichier `manifest.json` de l'extension

### Installation permanente
⚠️ L'installation permanente nécessite Firefox Developer Edition ou Firefox Nightly car Firefox standard ne permet pas l'installation d'extensions non signées.

#### Avec Firefox Developer Edition :
1. Installez Firefox Developer Edition depuis [le site officiel](https://www.mozilla.org/fr/firefox/developer/)
2. Dans Firefox Developer Edition, allez dans `about:config`
3. Cherchez `xpinstall.signatures.required` et mettez-le à `false`
4. Installez web-ext : `npm install --global web-ext`
5. Dans le dossier de l'extension, exécutez : `web-ext build`
6. Dans Firefox Developer Edition, allez à `about:addons`
7. Cliquez sur la roue dentée (⚙️)
8. Sélectionnez "Installer un module depuis un fichier..."
9. Sélectionnez le fichier .zip créé dans le dossier `web-ext-artifacts`

## Structure des fichiers

- `manifest.json` : Configuration de l'extension
- `background.js` : Script principal de l'extension
- `popup.html` : Interface utilisateur de l'extension
- `popup.js` : Script de l'interface utilisateur
- `icon.png` : Icône de l'extension

## Permissions requises

- `downloads` : Pour télécharger les PDFs
- `webRequest` : Pour détecter les PDFs
- `notifications` : Pour les notifications
- `storage` : Pour l'historique
- `contextMenus` : Pour le menu contextuel
- Accès aux domaines :
  - stradalex.com
  - uclouvain.be
  - lexnow.io
  - storage.googleapis.com

## Support

L'extension est compatible avec :
- Stradalex via le proxy UCLouvain
- Lexnow.io

## Développement

Pour modifier l'extension :
1. Modifiez les fichiers source
2. Rechargez l'extension dans `about:debugging`
3. Testez les modifications
4. Créez un nouveau build avec `web-ext build`

## Notes

- L'extension nécessite Firefox 57 ou supérieur
- Les PDFs sont détectés automatiquement lors de la navigation
- Le nommage des fichiers est basé sur l'URL de la page source