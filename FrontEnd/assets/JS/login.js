const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Connexion réussie, on cache le message d'erreur
            errorMessage.style.display = "none";
            localStorage.setItem("token", data.token);
            window.location.href = "index.html"; // Redirection vers la page d'accueil
        } else {
            // Afficher un message d'erreur si les identifiants sont incorrects
            errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
            errorMessage.style.display = "block"; // Afficher le message d'erreur
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        errorMessage.textContent = "Une erreur est survenue. Réessayez.";
        errorMessage.style.display = "block"; // Afficher le message d'erreur
    }
});
