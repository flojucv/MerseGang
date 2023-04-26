# <center> MerseGang </center>

## Sommaire recapitulatif des dossiers
1. [Partie Discord](https://github.com/flojucv/MerseGang/blob/master/Commandes)
    1. [Event *Permet la detection de message ou de reaction etc*](https://github.com/flojucv/MerseGang/blob/master/Events)
    2. [Commande administrateur](https://github.com/flojucv/MerseGang/blob/master/Commandes/Administrateur)
    3. [Commande Membre](https://github.com/flojucv/MerseGang/blob/master/Commandes/Membre)
    4. [Commande Mersecoins *C'est la partie discord du bot qui gere l'économie*](https://github.com/flojucv/MerseGang/blob/master/Commandes/Mersecoins)
2. [Partie Twitch](https://github.com/flojucv/MerseGang/blob/master/CommandesTwitch)
3. [Partie "Site"](https://github.com/flojucv/MerseGang/blob/master/MerseGang_site_shop)


## Package

* discord.js
* fs
* ms
* dotenv
* tmi.js
* twitchrequest
* moment


## Système d'économie
Une système d'économie comparrable au point de chaîne a était mit en place sur twitch, les utilisateurs doivent lier leur compte twitch et discord via une commande [&link pseudo#0000](https://github.com/flojucv/MerseGang/blob/master/CommandesTwitch/link.js). Une fois cette opération effectuée, les utilisateurs ayant lié leur compte et étant connecté sur le chat twitch du streamer lors de ses live gagnent 1 MerseCoins par minute. Le MerseCoins est la monnaie du système d'économie. Via un système de drop, les utilisateurs peuvent participer à deux events lorsque le stream est lancé :

### DROP
Le premier event est un drop, le bot envoie un mot générer aléatoirement et n'ayant aucune cense dans le chat twitch est le premier personne à rentrer le mot gagne entre 50 et 100 MerseCoins se chiffre et aussi générer aléatoirement.

### QUESTION
Le deuxième event est une question que le bot envoie dans le chat twitch, les utilisateurs ont 2 minutes pour répondre à la question et peuvent gagner entre 50 et 100 MerseCoins générer aléatoirement. Si au bout de ces 2 minutes personne n'a trouvé la réponse, le bot renvoie la question mais cette fois si avec 4 propositions de réponse. L'utilisateur qui trouve la réponse gagne entre 25 et 50 MerseCoins.

*Le bot lance un event tous les 15 minutes*

Les utilisateurs disposant aussi de commande de mini-jeux pour le moment au nombre de 1 :

### [quitoudouble](https://github.com/flojucv/MerseGang/blob/master/CommandesTwitch/quitoudouble.js)
L'utilisateur rentre la commande &quitoudouble suivie du nombre de MerseCoins qui souhaite miser, l'utilisateur doit miser au minimum 10 MerseCoins.
L'utilisateur a ensuite 1 chance sur 2 de gagner le double de sa mise ou alors de perdre sa mise.

## Système d'économie commande commune entre Discord et Twitch

### [Compte](https://github.com/flojucv/MerseGang/blob/master/Commandes/Mersecoins/compte.js)
La commande compte permet à l'utilisateur qui l'exécute de consulter le nombre de MerseCoins qu'ils possèdent.

### [shop](https://github.com/flojucv/MerseGang/blob/master/Commandes/Mersecoins/shop.js)
La commande possède deux fonctionnements :

Le premier fonctionnement est d'utiliser &shop sans rentrer d'argument derrière. L'utilisateur verra alors pour discord un embed apparaitre avec tous les articles que propose le streamer, sur twitch le bot renseignera de soi utiliser la commande discord soit de regarder sur se [site](https://flojucvsitewebcreators.on.drv.tw/MerseGang%20site%20shop/) afin de voir les articles proposés par le streamer.

Le deuxième fonctionnement est d'utiliser la commande &shop suivie d'un chiffre qui correspond à un article :

Si l'utilisateur ne possèdent pas l'argent le bot lui indiquera, sinon le bot retireront les MerseCoins du compte de l'utilisateur et afficheront un message pour avertir le streamer qu'un utilisateur a acheté un article en précisant l'article et l'utilisateur concerner.

*Tous les liens dans les titres sont la partie discord des commandes, les commandes twitch se trouvent dans le dossier [CommandesTwitch](https://github.com/flojucv/MerseGang/tree/master/CommandesTwitch)*

## Système d'économie commande twitch

Le système d'économie dispose d'un autre système les prédictions qui sont divisé en 3 commande :
### [predictionStart](https://github.com/flojucv/MerseGang/blob/master/CommandesTwitch/predictionStart.js)

Cette commande peut uniquement être utilisée par les modérateurs et le streamer.
La commande permet de lancer une prédiction. La syntaxe de la commande est la suivante &predictionstart question: votre question choix1: votre premier choix 2: votre deuxième choix.
Les mots question:, choix1: et choix2: permettent au système de délimiter les 3 arguments.
Une fois la prédiction lancer les viewers du stream ont alors 10 minutes pour prédire via la commande &prediction

### [prediction](https://github.com/flojucv/MerseGang/blob/master/CommandesTwitch/prediction.js)
Les viewers peuvent exécuter la commande suivie du mot choix1 ou choix2 et de leur mise. Leur choix sera alors renseigné dans un fichier JSON, s'il le souhaite les viewers peuvent ajouter une mise dans leur choix après leur premier mise mais ils ne peuvent pas changer de choix.

### [predictionStop](https://github.com/flojucv/MerseGang/blob/master/CommandesTwitch/predictionStop.js)
Cette commande peut uniquement être utilisée par les modérateurs et le streamer.
Il renseignait alors qu'elle choix a gagné.
Puis le système distribue les récompenses aux personnes qui ont gagné les prédictions.
Pour la distribution des récompenses, le bot calcul le cout total misé par l'équipe qui a perdu et distribue proportionnellement à leur mise au viewer qui a gagné.
Plus un viewer mis plus il reçoit de MerseCoins s'il gagne.

Le bot dispose encore de beaucoup de commande qui ne seront pas tout décrits ici.
