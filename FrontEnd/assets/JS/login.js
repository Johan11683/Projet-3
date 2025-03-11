// Script : Page de connexion
// 1: envoie les données du formulaire de connexion à l'API pour obtenir un token
// 2: stocke le token dans le localStorage
// 3: redirige l'utilisateur vers la page d'accueil
// 4: affiche un message d'erreur si les identifiants sont incorrects
// 5: gère les erreurs réseau ou autres
// 6: effectue la connexion
// 7: affiche les messages d'erreur ou cache le message d'erreur

// Récupération des éléments du DOM une seule fois
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Fonction pour afficher les messages d'erreur
const displayError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
};

// Fonction pour cacher le message d'erreur
const hideError = () => {
    errorMessage.style.display = "none";
};

// Fonction pour effectuer la connexion
const loginUser = async (email, password) => {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Connexion réussie, on cache le message d'erreur et redirige l'utilisateur
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
        displayError("Une erreur est survenue.");
    }
};

// Écouteur d'événement pour la soumission du formulaire
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const email = emailInput.value.trim(); // On enlève les espaces superflus
    const password = passwordInput.value.trim(); // On enlève les espaces superflus

    // Vérifier si les champs sont vides
    if (!email || !password) {
        displayError("Les champs email et mot de passe sont obligatoires.");
        return;
    }

    // Appeler la fonction de connexion
    loginUser(email, password);
});
