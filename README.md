# Téléprompteur (HTML/JS) https://eal49.github.io/BatraPrompt/

Une application web simple de téléprompteur. Collez votre texte, choisissez une vitesse en mots/seconde, puis faites défiler le texte automatiquement. Vous pouvez aussi générer une page autonome « lecture seule » à partager ou utiliser pour la présentation.

## Fonctionnalités
- Défilement automatique basé sur la vitesse en mots/seconde (WPS)
- Contrôles: Démarrer, Pause/Reprendre, Réinitialiser
- Réglages: taille de police, fondu haut/bas
- Génération d'une page HTML autonome (lecture seule) avec un nom de fichier unique
- Raccourcis clavier: Espace (pause/reprendre), R (réinitialiser)

## Prérequis
- Un navigateur moderne (Chrome, Edge, Firefox, Safari récents). Aucune installation nécessaire.

## Installation / Lancement
1. Téléchargez ou clonez le projet.
2. Ouvrez le fichier `index.html` dans votre navigateur (double-clic ou glisser-déposer dans la fenêtre du navigateur).

Aucune étape de build n'est requise.

## Utilisation
1. Collez votre texte dans le champ « Text ».
2. Réglez la vitesse via « Speed (words/sec) ». Conseil: 2 à 4 mots/sec correspond à un débit de parole naturel.
3. Ajustez la taille de police si nécessaire.
4. Cliquez sur « Start » pour commencer le défilement.
5. Utilisez « Pause » pour mettre en pause (ou la barre d'espace), puis « Resume » (ou barre d'espace) pour reprendre.
6. « Reset » ramène le texte au début.

## Générer une page de lecture
- Cliquez sur « Generate » pour télécharger une page HTML autonome préconfigurée avec:
  - le texte actuel,
  - la vitesse (WPS),
  - la taille de police,
  - l'option de fondu.
- Ouvrez ensuite le fichier téléchargé (ex: `teleprompter-YYYY-MM-DDTHH-MM-SS-Z.html`) pour l'utiliser comme téléprompteur en lecture seule.

## Détails techniques
- La vitesse en mots/seconde est convertie en pixels/seconde à l'exécution, en estimant le nombre de pixels par mot d'après la hauteur réelle du contenu et le nombre de mots.
- Le défilement utilise `requestAnimationFrame` pour une animation fluide.

## Raccourcis clavier
- Espace: Pause/Reprendre
- R: Réinitialiser

## Conseils
- Utilisez un texte suffisamment long pour dépasser la hauteur de la zone d'affichage.
- Si le défilement semble trop lent/rapide, ajustez la vitesse (WPS) ou la taille de police.
- Passez en plein écran (F11 ou via votre navigateur) pour une meilleure lisibilité lors de la présentation.

## Compatibilité
Testé sur les dernières versions de Chrome/Edge/Firefox. Si vous rencontrez un problème, essayez d'augmenter la vitesse, de modifier la taille de police, ou de recharger la page.

## Licence
Libre d'utilisation dans un contexte personnel ou de démonstration.

