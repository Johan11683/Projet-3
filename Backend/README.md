# Backend API - Sophie Bluel

Ce dossier contient le code backend du projet

## Lancement du backend

Ouvrez un terminal à cet emplacement

Pour installer les dépendances du projet, executez la commande 
```bash 
npm install
```

Une fois les dépendances installées lancez le projet avec la commande 
```bash 
npm start
```

**Laisser tourner ce terminal pour travailler**

## Compte de test pour Sophie Bluel

|email|password|
| :---------------: | :---------------: |
|sophie.bluel@test.tld|S0phie|

## Accéder à Swagger

[documentation Swagger](http://localhost:5678/api-docs/)

Pour lire la documentation, utiliser Chrome ou Firefox


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
            <h3>Ajout photo</h3>
            <div class="modal-add-photo-content">
                <div class="upload-container">
                    <label for="photo-upload" class="upload-area">
                        <i class="fa-regular fa-image"></i>
                        <button type="button" id="upload-photo-btn" class="add-photo-btn">+ Ajouter photo</button>
                        <span>png, jpg: max 4 Mo</span>
                    </label>
                    <input type="file" id="photo-upload" accept=".png, .jpg" class="hidden" />
                    <p id="error-message" class="error-message"></p>
                </div>
            
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
`;