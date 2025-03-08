// Récupération des éléments du DOM une seule fois
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Fonction pour afficher les messages d'erreur
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

// Fonction pour cacher le message d'erreur
function hideError() {
    errorMessage.style.display = "none";
}

// Fonction pour effectuer la connexion
async function loginUser(email, password) {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Connexion réussie, on cache le message d'erreur
            hideError();
            localStorage.setItem("token", data.token); // Sauvegarder le token
            window.location.href = "index.html"; // Redirection vers la page d'accueil
        } else {
            // Afficher un message d'erreur si les identifiants sont incorrects
            displayError("Erreur dans l’identifiant ou le mot de passe");
        }
    } catch (error) {
        // Gérer les erreurs réseau ou autre
        console.error("Erreur lors de la connexion :", error);
        displayError("Une erreur est survenue. Réessayez.");
    }
}

// Écouteur d'événement pour la soumission du formulaire
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const email = emailInput.value;
    const password = passwordInput.value;

    // Appeler la fonction de connexion
    loginUser(email, password);
});
