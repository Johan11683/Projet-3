const modifyButton = document.getElementById("modifyButton");

// Vérification si le token est présent dans le localStorage
const token = localStorage.getItem("token");

console.log("Token trouvé : ", token);  // Log du token pour voir s'il est correctement récupéré

if (token) {
    modifyButton.classList.add("show");
} else {
    modifyButton.classList.remove("show");
}

// Ajouter un événement au bouton "Modifier" pour afficher la modale
modifyButton.addEventListener("click", () => {
    console.log("Le bouton Modifier a été cliqué");
    // Code pour afficher la modale plus tard
});
