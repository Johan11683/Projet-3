// Récupération du bouton et création du conteneur modal
const modifyButton = document.getElementById("modifyButton");
const modalContainer = document.createElement("div");
modalContainer.id = "modal-container";
modalContainer.classList.add("modal-container");

// Contenu HTML de la modale avec deux vues
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
            <span class="close-modal">&times;</span>
            <span class="back-to-gallery"><i class="fa-solid fa-arrow-left"></i></span>
            <div class="modal-container">
                <h3>Ajout photo</h3>
                <div class="modal-add-photo-content">
                    
                    <div class="upload-area">
                        <i class="fa-regular fa-image"></i>
                        <button type="button" id="upload-photo-btn" class="upload-photo-btn"><p>+ Ajouter photo</p></button>
                        <input type="file" id="photo-upload" accept=".png, .jpg" class="hidden">
                        <span>jpg, png : max 4 Mo</span>
                        
                    </div>
                    
                    
                    <p id="error-message" class="error-message"></p>

                    <form id="photo-form">
                        <!-- Titre de la photo -->
                        <label for="photo-title">Titre</label>
                        <input type="text" id="photo-title" required>

                        <!-- Menu déroulant pour les catégories -->
                        <label for="photo-category">Catégorie</label>
                        <select id="photo-category" required>
                            <option value="">Sélectionner une catégorie</option>
                            <!-- Les options seront ajoutées dynamiquement avec JavaScript -->
                        </select>
                        <div class="modal-divider"></div> <!-- Barre grise -->
                    </form>
                    <button class="add-photo-btn" id="submit-photo-btn" disabled>Valider</button>
                </div>
            </div>
        </div>
    </div>
`;



// Ajouter la modale au body
document.body.appendChild(modalContainer);

// Fonction pour vérifier le token
function checkToken() {
    const token = localStorage.getItem("token");
    modifyButton.classList.toggle("show", !!token);
}

// Vérification immédiate à l'ouverture de la page
checkToken();

// Ouvrir la modale et charger les images
function openModal() {
    modalContainer.style.display = "block";
    document.body.classList.add("modal-open"); // Effet d'opacité
    fetchImages();
}

// Charger les images
function fetchImages() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            const modalGallery = document.getElementById("modal-gallery");
            modalGallery.innerHTML = ''; // Réinitialisation de la galerie
            data.forEach(item => {
                createImage(item, modalGallery); // Créer l'image et son bouton
            });
        })
        .catch(error => console.error('Erreur:', error));
}

// Créer l'image et ajouter le bouton de suppression
function createImage(item, modalGallery) {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;
    img.classList.add("modal-image");

    const deleteButton = document.createElement("div");
    deleteButton.classList.add("delete-image-btn");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; // Icône Font Awesome

    // Ajouter l'image et le bouton de suppression dans le conteneur
    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteButton);

    // Ajouter le conteneur de l'image à la galerie
    modalGallery.appendChild(imgContainer);

    // Ajouter l'événement de suppression
    addDeleteEvent(deleteButton, item, imgContainer);
}

// Ajouter l'événement de suppression
function addDeleteEvent(deleteButton, item, imgContainer) {
    deleteButton.addEventListener("click", () => handleDeleteImage(item.id, imgContainer));
}

// Supprimer l'image de la galerie
function handleDeleteImage(imageId, imgContainer) {
    fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) throw new Error('Erreur de suppression');
        imgContainer.remove(); // Retirer l'image de la galerie
        console.log('Image supprimée avec succès');
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'image.');
    });
}

// Fermer la modale
function closeModal() {
    modalContainer.style.display = "none";
    document.body.classList.remove("modal-open"); // Retirer l'effet d'opacité
    console.log("La modale est fermée.");
}

// Afficher la vue d'ajout de photo
function showAddPhotoView() {
    document.getElementById("modal-gallery-view").style.display = "none";
    document.getElementById("modal-add-photo-view").style.display = "block";
}

// Revenir à la vue galerie
function showGalleryView() {
    document.getElementById("modal-add-photo-view").style.display = "none";
    document.getElementById("modal-gallery-view").style.display = "block";
}

// Récupérer les catégories et les ajouter au menu déroulant
function fetchCategories() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById("photo-category");
            categorySelect.innerHTML = '<option value=""></option>'; // Remise à zéro

            // Ajouter chaque catégorie dans le menu déroulant
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error);
            alert('Erreur de récupération des catégories.');
        });
}

// Récupération des éléments
const fileInput = document.getElementById('photo-upload');
const uploadButton = document.getElementById('upload-photo-btn');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById("submit-photo-btn");

// Seul le bouton "+ Ajouter photo" doit ouvrir le sélecteur de fichiers
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

// Suppression de l'ancien comportement sur l'uploadArea
// uploadArea.addEventListener('click', () => {
//     fileInput.click();
// });

// Validation du fichier
fileInput.addEventListener('change', validateFile);

function validateFile() {
    const file = fileInput.files[0];
    if (file) {
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
            errorMessage.textContent = 'Seuls les fichiers PNG et JPG sont autorisés.';
            fileInput.value = '';
        } else if (file.size > 4 * 1024 * 1024) { // 4 Mo
            errorMessage.textContent = 'Le fichier ne doit pas dépasser 4 Mo.';
            fileInput.value = '';
        } else {
            errorMessage.textContent = '';
        }
    }
}

// Vérifier la validité des champs
function checkFormValidity() {
    const title = document.getElementById("photo-title").value.trim();
    const category = document.getElementById("photo-category").value;

    if (title && category && fileInput.files[0]) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Vérifier la validité des champs au fur et à mesure de la saisie
document.getElementById("photo-title").addEventListener("input", checkFormValidity);
document.getElementById("photo-category").addEventListener("change", checkFormValidity);

// Initialiser les événements
function addEventListeners() {
    modifyButton.addEventListener("click", openModal);
    modalContainer.querySelectorAll(".close-modal").forEach(closeButton => {
        closeButton.addEventListener("click", closeModal);
    });
    modalContainer.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView);
    modalContainer.querySelector(".back-to-gallery").addEventListener("click", showGalleryView);

    // Fermer la modale si un clic se fait en dehors de celle-ci
    window.addEventListener("click", (event) => {
        if (modalContainer.style.display === "block" && !modalContainer.querySelector(".modal").contains(event.target) && event.target !== modifyButton) {
            closeModal();
        }
    });

    fetchCategories(); // Charger les catégories lors de l'ouverture de la modale
}

// Initialiser les événements
addEventListeners();
