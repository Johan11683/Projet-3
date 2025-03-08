const modifyButton = document.getElementById("modifyButton");
const modalContainer = document.createElement("div");
modalContainer.id = "modal-container";
modalContainer.classList.add("modal-container");

// Contenu de la modale avec deux vues
modalContainer.innerHTML = `
    <div class="modal">
        <!-- Vue Galerie -->
        <div id="modal-gallery-view">
            <h3>Galerie photo</h3>
            <span class="close-modal">&times;</span>
            <div id="modal-gallery"></div> <!-- Conteneur pour les images -->
            <div class="modal-divider"></div> <!-- Barre grise -->
            <button class="add-photo-btn">Ajouter une photo</button> <!-- Bouton -->
        </div>

        <!-- Vue Ajout Photo (initialement cachée) -->
        <div id="modal-add-photo-view" style="display: none;">
            <span class="back-to-gallery">← Retour</span>
            <h3>Ajout photo</h3>
            <form id="add-photo-form">
                <input type="file" id="photo-input" accept="image/*">
                <input type="text" id="photo-title" placeholder="Titre">
                <button type="submit" class="submit-photo-btn">Valider</button>
            </form>
        </div>
    </div>
`;

// Ajouter la modale au body
document.body.appendChild(modalContainer);

// Vérifier si le token est présent
function checkToken() {
    const token = localStorage.getItem("token");
    console.log('Token actuel:', token);
    modifyButton.classList.toggle("show", !!token);
}

// Vérifier immédiatement à l'ouverture de la page
checkToken();

// Fonction pour ouvrir la modale
function openModal() {
    modalContainer.style.display = "block";
    document.body.classList.add("modal-open"); // Ajoute l'effet d'opacité
    console.log("La modale est affichée.");

    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (!response.ok) throw new Error('Erreur de chargement des images');
            return response.json();
        })
        .then(data => {
            const modalGallery = document.getElementById("modal-gallery");
            modalGallery.innerHTML = '';

            data.forEach(item => {
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("image-container");

                const img = document.createElement("img");
                img.src = item.imageUrl;
                img.alt = item.title;
                img.classList.add("modal-image");

                // Création du bouton de suppression (en div)
                const deleteButton = document.createElement("div");
                deleteButton.classList.add("delete-image-btn");
                deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; // Icône Font Awesome

                // Ajouter l'image et le bouton dans le conteneur
                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteButton);

                // Ajouter le conteneur de l'image à la galerie
                modalGallery.appendChild(imgContainer);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

// Fonction pour fermer la modale
function closeModalFunction() {
    modalContainer.style.display = "none";
    document.body.classList.remove("modal-open"); // Retire l'effet d'opacité
    console.log("La modale est fermée.");
}

// Basculer vers la vue Ajout Photo
function showAddPhotoView() {
    document.getElementById("modal-gallery-view").style.display = "none";
    document.getElementById("modal-add-photo-view").style.display = "block";
}

// Revenir à la vue Galerie
function showGalleryView() {
    document.getElementById("modal-add-photo-view").style.display = "none";
    document.getElementById("modal-gallery-view").style.display = "block";
}

// Événements
modifyButton.addEventListener("click", openModal);
modalContainer.querySelector(".close-modal").addEventListener("click", closeModalFunction);
modalContainer.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView);
modalContainer.querySelector(".back-to-gallery").addEventListener("click", showGalleryView);

window.addEventListener("click", (event) => {
    if (modalContainer.style.display === "block" && !modalContainer.querySelector(".modal").contains(event.target) && event.target !== modifyButton) {
        closeModalFunction();
    }
});
