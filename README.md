# Entre les Pages — mon site d'histoires

Nom provisoire, sans mon nom : je peux le changer en une ligne
(voir le titre dans `index.html`).

Direction choisie : captivant, belles couleurs (violet, corail, rose,
doré, turquoise) — des histoires qui parlent de nous, classées par
univers : Vie, Amour, Famille, Épreuves, Espoir, Foi.

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
- Chaque histoire est un récit complet (pas un roman en chapitres) :
  un titre, un univers, un résumé, une image de couverture, et le
  récit écrit en parties. Le lecteur lit une partie à la fois et
  clique sur la flèche « Lire la suite » pour continuer — chaque
  partie peut avoir sa propre image, si je veux.
- Le texte est enregistré automatiquement dans le navigateur de
  l'ordinateur où j'écris (localStorage).
- Le correcteur français (LanguageTool, gratuit) vérifie pendant que
  je tape : les suggestions apparaissent sous le texte, je clique
  sur une correction pour l'appliquer.
- Bouton « Exporter » : je garde une copie `mes-histoires.json` de
  toutes mes histoires. Bouton « Importer » : je les recharge.

## Le mettre en ligne (GitHub Pages, gratuit)

1. Créer un dépôt (repository) sur mon compte GitHub, par exemple
   nommé `site-histoire`.
2. Y déposer les fichiers : `index.html`, `styles.css`, `app.js`
   et `image-accueil.png` (l'image de la page d'accueil).
3. Dans le dépôt : Settings → Pages → Source : branche `main`, dossier `/ (root)` → Save.
4. Après quelques minutes, le site répond à une adresse du type
   `https://<mon-compte>.github.io/site-histoire/`
   — ce lien se partage à qui je veux.
   Note : le site lui-même n'affiche pas mon nom ; seul le lien
   contient le nom de mon compte GitHub, car il fait partie de l'adresse.

Pour mettre une histoire en ligne : j'écris ici (ou sur ma copie locale),
j'exporte le `.json`, j'ouvre la copie en ligne du site et je l'importe,
ou je remplace les histoires directement dans le code si je préfère.
