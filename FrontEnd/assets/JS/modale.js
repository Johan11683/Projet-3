// Création et ajout de la modale au DOM
const modifyButton = document.getElementById("modifyButton");
const modalContainer = document.createElement("div");
modalContainer.id = "modal-container";
modalContainer.classList.add("modal-container");

modalContainer.innerHTML = `
    <div class="modal">
        <!-- Vue Galerie -->
        <div id="modal-gallery-view">
            <h3>Galerie photo</h3>
            <span class="close-modal">&times;</span>
            <div id="modal-gallery"></div>
            <div class="modal-divider"></div>
            <button class="add-photo-btn">Ajouter une photo</button>
        </div>

        <!-- Vue Ajout Photo -->
        <div id="modal-add-photo-view" style="display: none;">
            <span class="close-modal">&times;</span>
            <span class="back-to-gallery"><i class="fa-solid fa-arrow-left"></i></span>
            <div class="modal-container">
                <h3>Ajout photo</h3>
                <div class="modal-add-photo-content">
                    <div class="upload-area">
                        <div id="uploaded-image-container" class="hidden">
                            <img id="uploaded-image" src="" alt="Image prévisualisée">
                        </div>
                        <i class="fa-regular fa-image" id="upload-icon"></i>
                        <button type="button" id="upload-photo-btn" class="upload-photo-btn">
                            <p>+ Ajouter photo</p>
                        </button>
                        <input type="file" id="photo-upload" accept=".png, .jpg" class="hidden">
                        <span class="file-info">jpg, png : max 4 Mo</span>
                    </div>
                    <p id="error-message" class="error-message" style="color: red; font-size: 14px; display: none;"></p> <!-- Ajout de style pour le message d'erreur -->
                    <form id="photo-form">
                        <label for="photo-title">Titre</label>
                        <input type="text" id="photo-title" required>
                        <label for="photo-category">Catégorie</label>
                        <select id="photo-category" required>
                            <option value="">Sélectionner une catégorie</option>
                        </select>
                        <div class="modal-divider"></div>
                    </form>
                    <button class="add-photo-btn" id="submit-photo-btn" disabled>Valider</button>
                </div>
            </div>
        </div>
    </div>
`;

document.body.appendChild(modalContainer);

// Vérifier la présence du token pour afficher le bouton de modification
function checkToken() {
    modifyButton.classList.toggle("show", !!localStorage.getItem("token"));
}

checkToken();

// Ouvrir la modale
function openModal() {
    modalContainer.style.display = "block";
    document.body.classList.add("modal-open");
    fetchImages();
}

// Charger les images depuis l'API
function fetchImages() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            const modalGallery = document.getElementById("modal-gallery");
            modalGallery.innerHTML = ''; 
            data.forEach(item => createImage(item, modalGallery));
        })
        .catch(error => console.error('Erreur:', error));
}

// Ajouter une image avec bouton de suppression
function createImage(item, modalGallery) {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");

    imgContainer.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}" class="modal-image">
        <div class="delete-image-btn"><i class="fa-solid fa-trash-can"></i></div>
    `;

    modalGallery.appendChild(imgContainer);

    imgContainer.querySelector(".delete-image-btn").addEventListener("click", () => {
        handleDeleteImage(item.id, imgContainer);
    });
}

// Supprimer une image
// Supprimer une image
function handleDeleteImage(imageId, imgContainer) {
    const token = localStorage.getItem('token');  // Récupérer le token depuis localStorage

    if (!token) {
        alert('Vous devez être connecté pour supprimer une image.');
        return;  // Empêche la suppression si le token est manquant
    }

    fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`  // Ajouter le token dans les en-têtes
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Erreur de suppression');
        imgContainer.remove();
        console.log('Image supprimée');
    })
    .catch(error => alert('Erreur lors de la suppression.'));
}


// Réinitialiser la modale
function resetModal() {
    document.getElementById("photo-form").reset();
    document.getElementById("error-message").textContent = '';

    const uploadedImageContainer = document.getElementById("uploaded-image-container");
    uploadedImageContainer.classList.add("hidden");

    document.getElementById("upload-photo-btn").style.display = "block";
    document.getElementById("upload-icon").style.display = "inline";
    document.querySelector(".upload-area span").style.display = "inline";

    // Réinitialiser l'input file pour permettre la réinsertion de la même image
    document.getElementById("photo-upload").value = '';
}

// Fermer la modale
function closeModal() {
    modalContainer.style.display = "none";
    document.body.classList.remove("modal-open");
    resetModal();
}

// Navigation entre les vues de la modale
function showAddPhotoView() {
    document.getElementById("modal-gallery-view").style.display = "none";
    document.getElementById("modal-add-photo-view").style.display = "block";
}

function showGalleryView() {
    document.getElementById("modal-add-photo-view").style.display = "none";
    document.getElementById("modal-gallery-view").style.display = "block";
}

// Charger les catégories pour le menu déroulant
function fetchCategories() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById("photo-category");
            categorySelect.innerHTML = '<option value=""></option>';

            categories.forEach(category => {
                categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        })
        .catch(() => alert('Erreur de récupération des catégories.'));
}

// Gestion de l'upload d'image
const fileInput = document.getElementById('photo-upload');
const uploadButton = document.getElementById('upload-photo-btn');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById("submit-photo-btn");

uploadButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', validateFile);

function validateFile() {
    const file = fileInput.files[0];
    console.log("Fichier sélectionné:", file.name, "Taille:", file.size, "Type:", file.type);

    if (file) {
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
            errorMessage.textContent = 'Seuls les fichiers PNG et JPG sont autorisés.';
            errorMessage.style.display = 'block';  // Afficher le message d'erreur
            fileInput.value = '';
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            errorMessage.textContent = 'Le fichier ne doit pas dépasser 4 Mo.';
            errorMessage.style.display = 'block';  // Afficher le message d'erreur
            fileInput.value = '';
            return;
        }

        errorMessage.textContent = '';
        errorMessage.style.display = 'none';  // Cacher le message d'erreur
        previewImage(file);
    }
}

// Prévisualisation de l'image
function previewImage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const uploadedImage = document.getElementById("uploaded-image");
        uploadedImage.src = event.target.result;

        const uploadedImageContainer = document.getElementById("uploaded-image-container");
        uploadedImageContainer.classList.remove('hidden');

        uploadButton.style.display = 'none';
        document.getElementById('upload-icon').style.display = 'none';
        document.querySelector('.file-info').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Vérifier si le formulaire est valide
function checkFormValidity() {
    const title = document.getElementById("photo-title").value.trim();
    const category = document.getElementById("photo-category").value;
    const file = fileInput.files[0];

    // Vérifier si un des champs est vide
    if (!title || !category || !file) {
        submitButton.disabled = true;
        errorMessage.textContent = "Tous les champs sont obligatoires.";
        errorMessage.style.display = 'block';  // Afficher le message d'erreur
    } else {
        submitButton.disabled = false;
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';  // Cacher le message d'erreur
    }
}

// Activer/désactiver le bouton "Valider" à chaque modification des champs
document.getElementById("photo-title").addEventListener("input", checkFormValidity);
document.getElementById("photo-category").addEventListener("change", checkFormValidity);

// Ajouter les événements
modifyButton.addEventListener("click", openModal);
modalContainer.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", closeModal));
modalContainer.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView);
modalContainer.querySelector(".back-to-gallery").addEventListener("click", showGalleryView);
window.addEventListener("click", (e) => {
    if (modalContainer.style.display === "block" && !modalContainer.querySelector(".modal").contains(e.target) && e.target !== modifyButton) {
        closeModal();
    }
});

// Fonction d'envoi des données à l'API
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    sendDataToAPI();
});

// Fonction pour envoyer les données à l'API
function sendDataToAPI() {
    const title = document.getElementById("photo-title").value.trim();
    const category = document.getElementById("photo-category").value;
    const file = fileInput.files[0];

    // Créer un formulaire FormData pour l'envoi de données multipart/form-data (inclut le fichier)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    // Envoi des données à l'API
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Authentification avec le token
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erreur dans la transmission des données');
        }
    })
    .then(data => {
        // Si la réponse est correcte, afficher un message de succès
        alert('Données transmises avec succès');
        console.log(data);
        closeModal(); // Fermer la modale après envoi réussi
        fetchImages(); // Mettre à jour la galerie avec la nouvelle image
    })
    .catch(error => {
        // Si erreur, afficher un message d'erreur
        alert(error.message);
    });
}

fetchCategories();
