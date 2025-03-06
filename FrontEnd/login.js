const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Cacher le message d'erreur avant chaque nouvelle tentative
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.style.display = "none"; // Cacher le message d'erreur

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Connexion réussie
                localStorage.setItem("token", data.token);
                window.location.href = "index.html"; // Redirection vers la page d'accueil
            } else {
                // Afficher un message d'erreur si les identifiants sont incorrects
                errorMessage.textContent = "Identifiants incorrects";
                errorMessage.style.display = "block"; // Afficher le message d'erreur
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            errorMessage.textContent = "Une erreur est survenue. Réessayez.";
            errorMessage.style.display = "block"; // Afficher le message d'erreur
        }
    });
} else {
    console.log("Le formulaire de connexion n'est pas présent sur cette page.");
}

const authLink = document.getElementById("auth-link");
const filtres = document.getElementById("filtres");
const editModeBar = document.getElementById("edit-mode-bar");

// Vérifie si la page actuelle est index.html
const isIndexPage = window.location.pathname.includes("index.html");

// Vérifie si un token est présent dans le localStorage
if (localStorage.getItem("token")) {
    authLink.textContent = "Logout";

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
    authLink.textContent = "Login";
    authLink.setAttribute("href", "login.html");

    if (filtres) {
        filtres.classList.remove("hidden"); // Réafficher les filtres
    }

    if (isIndexPage && editModeBar) {
        editModeBar.classList.add("hidden"); // Cacher la barre si déconnecté
        document.body.classList.remove("edit-mode-active"); // Annuler le décalage
    }
}
