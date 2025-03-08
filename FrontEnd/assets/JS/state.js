const authLink = document.getElementById("auth-link");
const filtres = document.getElementById("filtres");
const editModeBar = document.getElementById("edit-mode-bar");

// Vérifie si la page actuelle est index.html
const isIndexPage = window.location.pathname.includes("index.html");

// Vérifie si un token est présent dans le localStorage
if (localStorage.getItem("token")) {
    authLink.textContent = "logout";

    if (filtres) {
        filtres.classList.add("hidden"); // Cacher les filtres
    }

    if (isIndexPage && editModeBar) {
        editModeBar.classList.remove("hidden"); // Afficher la barre uniquement sur index.html
        document.body.classList.add("edit-mode-active"); // Décaler le header
    }

    authLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
} else {
    authLink.textContent = "login";
    authLink.setAttribute("href", "login.html");

    if (filtres) {
        filtres.classList.remove("hidden"); // Réafficher les filtres
    }

    if (isIndexPage && editModeBar) {
        editModeBar.classList.add("hidden"); // Cacher la barre si déconnecté
        document.body.classList.remove("edit-mode-active"); // Annuler le décalage
    }
    

}