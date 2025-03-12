// Script pour la modale de gestion des images (ajout, suppression)
// 1: Création et ajout de la modale au DOM
// 2: Vérifier la présence du token (après connexion) pour afficher le bouton modifier
// 3: Ouvrir la modale via le bouton modifier
// 4: Charger les images depuis l'API dans la modale
// 5: Ajouter les images avec bouton de suppression
// 6: Gérer la suppression d'une image
// 7: Réinitialiser la modale
// 8: Fermer la modale
// 9: Navigation entre les vues de la modale (galerie avec suppression et ajout photo)
// 10: Charger les catégories pour le menu déroulant
// 11: Gestion des restrictions de l'upload d'image (type, taille)
// 12: Prévisualisation de l'image
// 13: Vérifier si le formulaire est valide, çad que tous les champs sont remplis, nécessaire pour activer le bouton "Valider"
// 14: Activer/désactiver le bouton "Valider" à chaque modification des champs
// 15: Si "Valider" est cliqué, envoyer les données à l'API et ajouter l'image à la modale et à la galerie
// 16: Fonction updateGallery pour mettre à jour la galerie après ajout ou suppression d'une image
// 17: Appeler la fonction updateGallery pour mettre à jour la galerie après ajout de photo
// 18: Appeler la fonction updateGallery pour mettre à jour la galerie après suppression d'une photo


// Création et ajout de la modale au DOM
const modifyButton = document.getElementById("modifyButton"); // Récupérer le bouton de modification
const modalContainer = document.createElement("div"); // Créer un élément div pour la modale
modalContainer.id = "modal-container"; // Ajouter un ID à la modale
modalContainer.classList.add("modal-container"); // Ajouter une classe CSS à la modale

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

document.body.appendChild(modalContainer); // Ajouter la modale au body

// Vérifier la présence du token pour afficher le bouton de modification
function checkToken() { // Fonction pour vérifier la présence du token
    if (localStorage.getItem("token")) { // Si le token est présent dans le localStorage
        modifyButton.classList.add("show");// Ajouter la classe "show" pour afficher le bouton de modification
        console.log('Token présent')
    } else { // Sinon
        modifyButton.classList.remove("show");  //  Retirer la classe "show" pour masquer le bouton de modification
        console.log('Token manquant')
    }
}

checkToken(); // Appeler la fonction pour vérifier le token dès le début du code

// Ouvrir la modale
function openModal() { // Fonction pour ouvrir la modale
    modalContainer.style.display = "block"; // Afficher la modale
    document.body.classList.add("modal-open"); // Ajouter une classe CSS
    fetchImages(); // Appeler la fonction fetchImages pour charger les images depuis l'API
    console.log('Bouton modifier cliqué, modale ouverte')
}

// Fermer la modale
function closeModal() { // Fonction pour fermer la modale
    modalContainer.style.display = "none"; // Cacher la modale 
    document.body.classList.remove("modal-open"); // Retirer la classe CSS pour fermer la modale
    resetModal(); // Appeler la fonction resetModal pour réinitialiser la modale
    console.log('Modale fermée')
}

// Charger les images depuis l'API dans la modale
function fetchImages() { // Fonction pour charger les images depuis l'API
    fetch('http://localhost:5678/api/works') // Récupérer les images depuis l'API
        .then(response => response.json()) // Convertir la réponse en JSON
        .then(data => { // Utiliser les données
            const modalGallery = document.getElementById("modal-gallery"); // Sélectionner la galerie dans la modale
            modalGallery.innerHTML = '';  // Vider la galerie avant d'ajouter les nouvelles images
            data.forEach(item => createImage(item, modalGallery)); // Pour chaque image, appeler la fonction createImage
            console.log('Images mises à jour dans la modale')
        })
        .catch(error => console.error('Erreur:', error));
}

// Ajouter une image avec bouton de suppression
function createImage(item, modalGallery) { // Fonction pour ajouter une image avec un bouton de suppression
    const imgContainer = document.createElement("div"); // Créer un élément div pour l'image
    imgContainer.classList.add("image-container"); // Ajouter une classe CSS à l'élément

    imgContainer.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}" class="modal-image"> 
        <div class="delete-image-btn"><i class="fa-solid fa-trash-can"></i></div>
    `; // Ajouter l'image et le bouton de suppression à l'élément

    modalGallery.appendChild(imgContainer); // Ajouter l'image à la galerie (de la modale)

    imgContainer.querySelector(".delete-image-btn").addEventListener("click", () => { // Ajouter un événement au bouton de suppression
        handleDeleteImage(item.id, imgContainer); // Appeler la fonction handleDeleteImage pour supprimer l'image
    });
}

// Supprimer une image
function handleDeleteImage(imageId, imgContainer) { // Fonction pour supprimer une image
    const token = localStorage.getItem('token');  // Récupérer le token depuis localStorage

    fetch(`http://localhost:5678/api/works/${imageId}`, { // Effectuer une requête DELETE pour supprimer l'image
        method: 'DELETE', // Utiliser la méthode DELETE
        headers: { // Ajouter les en-têtes, précise certaines informations sur la requête, on aurait pu rajouter content-type JSON pour GET et POST
            'Authorization': `Bearer ${token}`  // Ajouter le token dans les en-têtes
        }
    })
    .then(response => { // Récupérer la réponse
        if (!response.ok) { // Si la réponse n'est pas OK
            throw new Error('Erreur de suppression'); // Lancer une erreur
        }
        imgContainer.remove(); // Supprimer l'image de la galerie
        console.log('Image supprimée');// Afficher un message de confirmation
        fetchImages();  // Mettre à jour la galerie après suppression
        updateGallery(); // Appeler la fonction updateGallery pour mettre à jour la galerie après suppression d'une photo
    })
    .catch(error => alert('Erreur lors de la suppression.')); // Gérer les erreurs
}

// Réinitialiser la modale
function resetModal() { // Fonction pour réinitialiser la modale
    document.getElementById("photo-form").reset(); // Réinitialiser le formulaire
    document.getElementById("error-message").textContent = ''; // Réinitialiser le message d'erreur

    const uploadedImageContainer = document.getElementById("uploaded-image-container"); // Sélectionner le conteneur de l'image
    uploadedImageContainer.classList.add("hidden"); // Cacher le conteneur de l'image

    document.getElementById("upload-photo-btn").style.display = "block"; // Afficher le bouton d'ajout de photo
    document.getElementById("upload-icon").style.display = "inline"; // Afficher l'icône d'ajout de photo
    document.querySelector(".upload-area span").style.display = "inline"; // Afficher le texte d'ajout de photo

    // Réinitialiser l'input file pour permettre la réinsertion de la même image
    document.getElementById("photo-upload").value = ''; // Réinitialiser l'input file
}



// Navigation entre les vues de la modale
function showAddPhotoView() { // Fonction pour afficher la vue d'ajout de photo
    document.getElementById("modal-gallery-view").style.display = "none"; // Cacher la vue de la galerie
    document.getElementById("modal-add-photo-view").style.display = "block"; // Afficher la vue d'ajout de photo
    console.log('Bouton Ajouter une photo cliqué, passage sur la vue "Ajout photo"')
}

function showGalleryView() { // Fonction pour afficher la vue de la galerie
    document.getElementById("modal-add-photo-view").style.display = "none"; // Cacher la vue d'ajout de photo
    document.getElementById("modal-gallery-view").style.display = "block"; // Afficher la vue de la galerie
    console.log('Flèche retour cliquée, retour sur la modale "Galerie Photo"')
}

// Charger les catégories pour le menu déroulant
function fetchCategories() { // Fonction pour charger les catégories depuis l'API
    fetch('http://localhost:5678/api/categories') // Récupérer les catégories depuis l'API
        .then(response => response.json()) //   Convertir la réponse en JSON
        .then(categories => { // Utiliser les données
            
            const categorySelect = document.getElementById("photo-category"); // Sélectionner le menu déroulant
            categorySelect.innerHTML = '<option value=""></option>'; // Ajouter une option "vide" comme dans la maquette

            categories.forEach(category => { // Pour chaque catégorie, ajouter une option dans le menu déroulant
                categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`; // Ajouter une option avec l'ID et le nom de la cat.
                
            });
        })
        .catch(() => alert('Erreur de récupération des catégories.')); // Gérer les erreurs
}

// Gestion de l'upload d'image
const fileInput = document.getElementById('photo-upload'); // Sélectionner l'input file
const uploadButton = document.getElementById('upload-photo-btn'); // Sélectionner le bouton d'ajout de photo
const errorMessage = document.getElementById('error-message'); // Sélectionner le message d'erreur
const submitButton = document.getElementById("submit-photo-btn"); // Sélectionner le bouton de validation

uploadButton.addEventListener('click', () => fileInput.click()); // Ouvrir l'explorateur de fichiers lors du clic sur le bouton
fileInput.addEventListener('change', validateFile); // Vérifier le fichier sélectionné lors du changement de l'input file

function validateFile() { // Fonction pour valider le fichier sélectionné
    const file = fileInput.files[0]; // Récupérer le fichier sélectionné
    console.log("Fichier sélectionné:", file.name, "Taille:", file.size, "Type:", file.type); // Afficher les informations du fichier dans la console

    if (file) { // Si un fichier est sélectionné
        const allowedTypes = ['image/png', 'image/jpeg']; // Types de fichiers autorisés
        if (!allowedTypes.includes(file.type)) { // Vérifier si le type du fichier est autorisé
            errorMessage.textContent = 'Seuls les fichiers PNG et JPG sont autorisés.'; // Afficher un message d'erreur
            errorMessage.style.display = 'block';  // Afficher le message d'erreur
            fileInput.value = ''; // Réinitialiser l'input file
            return; // Arrêter l'exécution de la fonction lorsque le fichier est invalide (break ne fonctionne que dans les boucles)
        }

        if (file.size > 4 * 1024 * 1024) { // Vérifier si la taille du fichier ne dépasse pas 4 Mo
            errorMessage.textContent = 'Le fichier ne doit pas dépasser 4 Mo.'; // Afficher un message d'erreur
            errorMessage.style.display = 'block';  // Afficher le message d'erreur // Afficher le message d'erreur
            fileInput.value = ''; // Réinitialiser l'input file
            return; // Arrêter l'exécution de la fonction lorsque le fichier est invalide
        }

        errorMessage.textContent = ''; // Réinitialiser le message d'erreur (si l'utilisateur a corrigé son erreur, il faut cacher le message)
        errorMessage.style.display = 'none';  // Cacher le message d'erreur
        previewImage(file); // Appeler la fonction previewImage pour afficher l'image
    }
}

// Prévisualisation de l'image
function previewImage(file) { // Fonction pour prévisualiser l'image sélectionnée
    const reader = new FileReader(); // Créer un objet FileReader : permet de charger l'objet en URL sans l'envoyer au serveur
    reader.onload = (event) => { // Lorsque le chargement est terminé
        const uploadedImage = document.getElementById("uploaded-image"); // Sélectionner l'image prévisualisée
        uploadedImage.src = event.target.result; // Définir l'URL de l'image prévisualisée

        const uploadedImageContainer = document.getElementById("uploaded-image-container"); // Sélectionner le conteneur de l'image
        uploadedImageContainer.classList.remove('hidden'); // Afficher le conteneur de l'image

        uploadButton.style.display = 'none'; // Cacher le bouton d'ajout de photo
        document.getElementById('upload-icon').style.display = 'none'; // Cacher l'icône d'ajout de photo
        document.querySelector('.file-info').style.display = 'none'; // Cacher le texte d'ajout de photo
    };
    reader.readAsDataURL(file); // Lire le contenu du fichier en tant qu'URL
    console.log('Image chargée avec succès, prévisualisation en cours')
}

// Vérifier si le formulaire est valide
function checkFormValidity() { // Fonction pour vérifier si le formulaire est valide
    const title = document.getElementById("photo-title").value.trim(); // Récupérer le titre de l'image
    
    const category = document.getElementById("photo-category").value; // Récupérer la catégorie de l'image
    const file = fileInput.files[0]; // Récupérer le (1er) fichier sélectionné

    // Vérifier si un des champs est vide
    if (!title || !category || !file) { // Si title ou catégorie ou file sont vides
        submitButton.disabled = true; // Alors : Désactiver le bouton "Valider" (disabled=true)
        errorMessage.textContent = "Tous les champs sont obligatoires."; // Définir un message d'erreur
        errorMessage.style.display = 'block';  // Afficher le message d'erreur
    } else { // Sinon (si tous les champs sont remplis)
        submitButton.disabled = false; // Activer le bouton "Valider"
        errorMessage.textContent = ''; // Réinitialiser le message d'erreur
        errorMessage.style.display = 'none';  // Cacher le message d'erreur
        console.log('Tous les champs sont remplis, bouton valider déverouillé')
    }

}

// Activer/désactiver le bouton "Valider" à chaque modification des champs
document.getElementById("photo-title").addEventListener("input", checkFormValidity); // Vérifier le titre
document.getElementById("photo-category").addEventListener("change", checkFormValidity); // Vérifier la catégorie

// Ajouter les événements
modifyButton.addEventListener("click", openModal); // Ouvrir la modale lors du clic sur le bouton de modification
modalContainer.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", closeModal)); // Fermer la modale lors du clic close-modal
modalContainer.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView); // Afficher la vue d'ajout de photo lors du clic sur ajouter
modalContainer.querySelector(".back-to-gallery").addEventListener("click", showGalleryView); // Afficher la vue de la galerie lors du clic sur la flèche
window.addEventListener("click", (e) => { // Fermer la modale lors du clic en dehors de la modale
    if (modalContainer.style.display === "block" && !modalContainer.querySelector(".modal").contains(e.target) && e.target !== modifyButton) { 
        closeModal(); // Si la modale est ouverte et que l'élément cliqué n'est pas dans la modale, fermer la modale
    }
});

// Fonction d'envoi des données à l'API
submitButton.addEventListener('click', (e) => { // Ajouter un événement au clic sur le bouton "Valider"
    e.preventDefault(); // Empêcher le rechargement de la page
    sendDataToAPI(); // Appeler la fonction sendDataToAPI pour envoyer les données à l'API
});

// Fonction pour envoyer les données à l'API
function sendDataToAPI() { // Fonction pour envoyer les données à l'API
    const title = document.getElementById("photo-title").value.trim(); // Récupérer le titre de l'image
    const category = document.getElementById("photo-category").value; // Récupérer la catégorie de l'image
    const file = fileInput.files[0]; // Récupérer le fichier sélectionné fileInput.files[0] est un tableau de fichiers, on prend le 1er

    // Créer un formulaire FormData pour l'envoi de données
    const formData = new FormData(); // Créer un objet FormData qui comprend les valeurs des champs du formulaire
    formData.append("title", title); // Ajouter le titre à l'objet FormData
    formData.append("category", category); // Ajouter la catégorie à l'objet FormData
    formData.append("image", file); // Ajouter l'image à l'objet FormData

    // Envoi des données à l'API
    fetch('http://localhost:5678/api/works', { // Envoyer les données à l'API
        method: 'POST', // Utiliser la méthode POST
        body: formData, // Utiliser l'objet FormData pour les données
        headers: { // Ajouter les en-têtes (spécifie certaines informations sur la requête)
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Authentification avec le token
        }
    })
    .then(response => { // Récupérer la réponse
        if (response.ok) { // Si la réponse est OK
            return response.json(); // Convertir la réponse en JSON
        } else { // Sinon
            throw new Error('Erreur dans la transmission des données'); // Lancer une erreur
        }
    })
    .then(data => { // Utiliser les données
        // Si la réponse est correcte, afficher un message de succès
        alert('Données transmises avec succès');
        closeModal(); // Fermer la modale après envoi réussi
        updateGallery(); // Appeler la fonction updateGallery pour mettre à jour la galerie après ajout de photo
    })
    .catch(error => { // Gérer les erreurs
        // Si erreur, afficher un message d'erreur
        alert(error.message); // Afficher le message d'erreur
    });
}

fetchCategories(); // Appeler la fonction fetchCategories pour charger les catégories dès le début du code
