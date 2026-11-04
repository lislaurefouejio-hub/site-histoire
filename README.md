# Entre les Pages — mon site d'histoires

Nom provisoire, sans mon nom : je peux le changer en une ligne
(voir le titre dans `index.html`).

Ambiance choisie : bibliothèque ancienne, chaude et élégante
(brun bois, doré, crème, écriture serif comme dans les livres).

## Les fichiers (c'est tout, rien de compliqué)

- `index.html` — la page du site : ce qu'on voit (titres, boutons, sections).
- `styles.css` — les couleurs et la présentation.
- `app.js` — le fonctionnement : histoires, écriture, correcteur.

Aucune installation, aucun outil à compiler. C'est fait exprès pour que
je puisse tout lire, tout comprendre et tout modifier moi-même.

## L'ouvrir dans VS Code

1. Ouvrir VS Code → Fichier → Ouvrir le dossier → choisir ce dossier.
2. Ouvrir `index.html`, puis lancer un aperçu (extension « Live Server »
   si elle est là, sinon double-cliquer `index.html` dans l'explorateur).

## Écrire mes histoires

- Onglet « Mon espace d'écriture » → « Nouvelle histoire ».
- Le texte est enregistré automatiquement dans le navigateur de
  l'ordinateur où j'écris (localStorage).
- Le correcteur français (LanguageTool, gratuit) vérifie pendant que
  je tape : les suggestions apparaissent sous le chapitre, je clique
  sur une correction pour l'appliquer.
- Bouton « Exporter » : je garde une copie `mes-histoires.json` de
  toutes mes histoires. Bouton « Importer » : je les recharge.

## Le mettre en ligne (GitHub Pages, gratuit)

1. Créer un dépôt (repository) sur mon compte GitHub, par exemple
   nommé `site-histoire`.
2. Y déposer les 3 fichiers : `index.html`, `styles.css`, `app.js`.
3. Dans le dépôt : Settings → Pages → Source : branche `main`, dossier `/ (root)` → Save.
4. Après quelques minutes, le site répond à une adresse du type
   `https://<mon-compte>.github.io/site-histoire/`
   — ce lien se partage à qui je veux.
   Note : le site lui-même n'affiche pas mon nom ; seul le lien
   contient le nom de mon compte GitHub, car il fait partie de l'adresse.

Pour mettre une histoire en ligne : j'écris ici (ou sur ma copie locale),
j'exporte le `.json`, j'ouvre la copie en ligne du site et je l'importe,
ou je remplace les histoires directement dans le code si je préfère.
