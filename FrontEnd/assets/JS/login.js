// Script : Page de connexion
// 1: envoie les données du formulaire de connexion à l'API pour obtenir un token
// 2: stocke le token dans le localStorage
// 3: redirige l'utilisateur vers la page d'accueil
// 4: affiche un message d'erreur si les identifiants sont incorrects
// 5: gère les erreurs réseau ou autres
// 6: effectue la connexion
// 7: affiche les messages d'erreur ou cache le message d'erreur

// Récupération des éléments du DOM une seule fois
const loginForm = document.getElementById("loginForm"); // Sélectionne le formulaire de connexion
const errorMessage = document.getElementById("errorMessage"); // Sélectionne le message d'erreur
const emailInput = document.getElementById("email"); // Sélectionne l'input de l'email
const passwordInput = document.getElementById("password"); // Sélectionne l'input du mot de passe

// Fonction pour afficher les messages d'erreur
const displayError = (message) => { // La fonction prend un message en paramètre
    errorMessage.textContent = message; // Définit le texte du message d'erreur
    errorMessage.style.display = "block"; // Affiche le message d'erreur
};

// Fonction pour cacher le message d'erreur
const hideError = () => { // La fonction ne prend pas de paramètre (pas de message à afficher, elle vient cacher le message)
    errorMessage.style.display = "none"; // Cache le message d'erreur
};

// Fonction pour effectuer la connexion
const loginUser = async (email, password) => { // La fonction prend l'email et le mot de passe en paramètres
    try { // Essayer d'effectuer la connexion
        const response = await fetch("http://localhost:5678/api/users/login", { // Effectue une requête POST à l'API
            method: "POST", // Avec la méthode POST
            headers: { "Content-Type": "application/json" }, // JSON
            body: JSON.stringify({ email, password }),// Les données à envoyer sont l'email et le mot de passe
        });

        const data = await response.json(); // Récupère les données de la réponse

        if (response.ok) { // Si la réponse est OK (200)
            // Connexion réussie, on cache le message d'erreur et redirige l'utilisateur
            hideError(); // Cacher le message d'erreur
            localStorage.setItem("token", data.token); // Sauvegarder le token
            window.location.href = "index.html"; // Redirection vers la page d'accueil
            console.log('L\'administrateur est connecté')
        } else { // Si la réponse n'est pas OK
            // Afficher un message d'erreur si les identifiants sont incorrects
            displayError("Erreur dans l’identifiant ou le mot de passe");
        }
    } catch (error) { // Gérer les erreurs réseau ou autre
        // Gérer les erreurs réseau ou autre
        console.error("Erreur lors de la connexion :", error);
        displayError("Une erreur est survenue.");
    }
};

// Écouteur d'événement pour la soumission du formulaire
loginForm.addEventListener("submit", (e) => { // Lorsque le formulaire est soumis
    e.preventDefault(); // Empêche le rechargement de la page

    const email = emailInput.value.trim(); // On enlève les espaces superflus
    const password = passwordInput.value.trim(); // On enlève les espaces superflus

    // Vérifier si les champs sont vides
    if (!email || !password) { // Si l'email ou le mot de passe est vide
        displayError("Les champs email et mot de passe sont obligatoires.");
        return;
    }

    // Appeler la fonction de connexion
    loginUser(email, password); // Appeler la fonction de connexion avec l'email et le mot de passe
});
