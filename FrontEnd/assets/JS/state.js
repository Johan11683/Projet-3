// Récupération des éléments HTML
const authLink = document.getElementById("auth-link");
const filtres = document.getElementById("filtres");
const editModeBar = document.getElementById("edit-mode-bar");

// Vérifie si la page actuelle est index.html
const isIndexPage = window.location.pathname.includes("index.html");

// Vérifie si un token est présent dans le localStorage
const isLoggedIn = Boolean(localStorage.getItem("token"));

if (isLoggedIn) {
    // Utilisateur connecté
    authLink.textContent = "logout"; // Change le texte du lien pour "logout"

    if (filtres) {
        filtres.classList.add("hidden"); // Cacher les filtres si connecté
    }

    if (isIndexPage && editModeBar) {
        editModeBar.classList.remove("hidden"); // Afficher la barre d'édition uniquement sur index.html
        document.body.classList.add("edit-mode-active"); // Décaler le header pour activer le mode édition
    }

    // Événement de déconnexion
    authLink.addEventListener("click", () => {
        localStorage.removeItem("token"); // Supprime le token du localStorage
        window.location.href = "index.html"; // Redirige vers la page d'accueil
    });
} else {
    // Utilisateur non connecté
    authLink.setAttribute("href", "login.html"); // Redirige vers la page de login

    if (filtres) {
        filtres.classList.remove("hidden"); // Afficher les filtres si non connecté
    }

    if (isIndexPage && editModeBar) {
        editModeBar.classList.add("hidden"); // Cacher la barre d'édition si non connecté
        document.body.classList.remove("edit-mode-active"); // Annuler le décalage du header
    }
}
