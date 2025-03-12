// Gère l'affichage dynamique des éléments en fonction de l'état de connexion de l'utilisateur.
// Ce fichier est inclus dans toutes les pages du site pour gérer la connexion/déconnexion, 
// l'affichage des filtres, de la barre d'édition, et la redirection en fonction de l'état de l'utilisateur.

// Récupérer les éléments HTML utilisés
const authLink = document.getElementById("auth-link"); // Lien de connexion/déconnexion
const filtres = document.getElementById("filtres"); // Section des filtres
const editModeBar = document.getElementById("edit-mode-bar"); // Barre d'édition

// Vérifie si la page actuelle est "index.html"
const isIndexPage = window.location.pathname.includes("index.html"); 

// Vérifie si l'utilisateur est connecté (présence d'un token dans localStorage)
const isLoggedIn = Boolean(localStorage.getItem("token"));

// Fonction pour afficher les éléments spécifiques à un utilisateur connecté
const showForLoggedInUser = () => {
    // Mettre à jour le lien de connexion/déconnexion
    authLink.textContent = "logout";
    

    // Cacher la section des filtres si l'utilisateur est connecté
    if (filtres) {
        filtres.classList.add("hidden");
    }

    // Afficher la barre d'édition uniquement si l'utilisateur est sur la page index.html
    if (isIndexPage && editModeBar) {
        editModeBar.classList.remove("hidden");
        document.body.classList.add("edit-mode-active");
    }

    console.log('L\'administrateur est connecté')
    console.log('Déconnexion possible avec logout activée\nFiltres cachés\nBarre d\'édition active \nBouton modifier actif')



    // Gérer l'événement de déconnexion
    authLink.addEventListener("click", () => {
        // Supprimer le token du localStorage et rediriger vers la page d'accueil
        localStorage.removeItem("token"); // Si on clique sur authlink (logout si déconnecté), alors le token est supprimé
        window.location.href = "index.html"; // redirection vers la page d'accueil
    });
};

// Fonction pour afficher les éléments spécifiques à un utilisateur non connecté
const showForLoggedOutUser = () => {
    // Mettre à jour le lien de connexion pour rediriger vers la page de login
    authLink.setAttribute("href", "login.html");

    // Afficher la section des filtres uniquement si l'utilisateur n'est pas connecté
    if (filtres) {
        filtres.classList.remove("hidden");
    }

    // Cacher la barre d'édition si l'utilisateur n'est pas connecté et sur la page index.html
    if (isIndexPage && editModeBar) {
        editModeBar.classList.add("hidden");
        document.body.classList.remove("edit-mode-active");
    }
};

// Applique les modifications selon l'état de l'utilisateur (connecté ou non)
if (isLoggedIn) {
    showForLoggedInUser();
} else {
    showForLoggedOutUser();
}
