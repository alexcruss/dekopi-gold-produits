# Politique de sécurité

Ce dépôt contient le site vitrine de DEKOPI GOLD (https://produits.pierredegboevi.com/). C'est un site statique : une page HTML, des images, aucun serveur ni base de données. Le formulaire de contact n'envoie rien à un serveur, il prépare un message WhatsApp ou un e-mail dans l'application de la personne.

## Signaler une faille

Si vous trouvez un problème de sécurité (script injecté, lien piégé, fuite d'information, contenu modifié sans autorisation), écrivez à **pierredegboevi@gmail.com** avec :

- l'adresse de la page concernée ;
- ce que vous avez observé et comment le reproduire ;
- si possible, une capture d'écran.

Merci de ne pas ouvrir d'issue publique pour une faille : un message privé permet de corriger avant que le problème soit connu de tous.

## Délais

- Accusé de réception sous 72 heures.
- Correction ou réponse détaillée sous 14 jours selon la gravité.

## Ce qui est couvert

- Le contenu de ce dépôt et du site publié sur produits.pierredegboevi.com.

## Ce qui ne l'est pas

- Les sites livrés aux clients et liés depuis la page (ils ont leurs propres dépôts).
- Les services tiers : GitHub Pages, Google Fonts, WhatsApp, Chariow.

## Protections en place

- HTTPS imposé sur le domaine.
- Politique de sécurité du contenu (CSP) dans `index.html` : le seul script autorisé est celui de la page, aucune connexion réseau sortante depuis le JavaScript.
- Analyse des secrets et protection au push activées sur le dépôt.
- Aucun secret, mot de passe ni clé d'API dans le code ni dans l'historique.
