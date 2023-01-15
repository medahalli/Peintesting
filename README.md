# Reddit
A reddit clone made with Jade/Pug,Html, Css ,javascript, NodeJs and MySQL.

Fonctionnalités
----------------


Authentification : validé - cette page est la page par défaut, lorsque l’utilisateur n’est pas authentifié, il sera redirigé vers cette page directement.
Si l’utilisateur veut créer un compte, il peut cliquer sur le bouton « sign up ».

Inscription : validé - si l'utilisateur n'est pas enregistré il peut créer un compte dans cette page.
Après que l’utilisateur crée un compte, il est redirigé vers la page d’authentification pour s’authentifier.

Ajout des postes : validé, chaque utilisateur avec une session active peut ajouter des postes, l’heure d’ajout est enregistrée et affichée sous le titre de chaque lien.

Page profil : lorsque l’utilisateur crée un compte, une page profile est créée automatiquement pour lui. Pour afficher son profile, il peut cliquer sur le bouton « profil » situé dans la barre en-haut. 
Dans le profil, l’utilisateur trouve son pseudo, son email, et les liens qu’il a postés.
Si l’utilisateur veut afficher le profil d’un autre utilisateur, il peut cliquer sur son pseudo, et il sera redirigé directement vers son profil. 
Dans le profil d’un autre utilisateur, on trouve son pseudo seulement, mais l’email reste privé.

Page d’accueil : Dans cette page, l’utilisateur trouve tous les postes publiés par les autres utilisateurs, ainsi que ses propres postes.

Up vote/down vote : non validé.

Éditer/Supprimer des liens : non validé. 

Commenter un lien : non validé.
 

------------------
src/views/index.jade: la page d'accueil(Home page).

src/views/log-in.jade: la page d'Authentification.

src/views/sign-up.jade: la page d'Inscription.

src/views/user.jade: quand vous consultez votre profil ou le profil d'un autre utilisateur, cette page affiche l'historique de publication de ce profil. 

src/about.html: contient des informations sur l'équipe.

src/help.html: page d'aide en cas d'un problème. Cette page est accessible même si l’utilisateur n’est pas authentifié.
