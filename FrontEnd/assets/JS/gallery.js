// Script pour afficher les projets dans la galerie et appliquer les filtres
// 1 : Récupère les données des projets dans l'API
// 2 : Crée un élément figure pour chaque projet avec une image et un titre dans le DOM
// 3 : Affiche les projets dans la galerie
// 4 : Filtrer les projets en fonction de la catégorie sélectionnée
// 5 : Créer tous les boutons de filtre cliquables et applique le filtre "Tous" par défaut
// 6 : Défini l'événement de clic à chaque bouton de filtre
// 7 : Définit un bouton comme actif et désactive les autres
// 8 : Met à jour la galerie après une modification (ajout, suppression...)
// 9 : Initialise l'application et charge les projets avec le filtre "Tous"

// Fonction utilitaire pour récupérer les données depuis l'API
const fetchData = async (url) => { 
  try {
    const response = await fetch(url); // Envoie une requête fetch pour obtenir les données depuis l'URL
    if (!response.ok) throw new Error('Erreur de chargement des données'); // Si la réponse est incorrecte, on lance une erreur
    return await response.json(); // Si la réponse est correcte, on retourne les données au format JSON
  } catch (error) { 
    console.error(error); // Si une erreur survient lors du fetch, on l'affiche dans la console
  }
};

// Fonction pour créer un élément <figure> contenant une image et un titre
const createProjectElement = (imageUrl, title) => {
  const figure = document.createElement('figure'); // Crée un élément <figure> pour contenir l'image et le titre
  const img = document.createElement('img'); // Crée un élément <img> pour afficher l'image
  img.src = imageUrl; // Affecte l'URL de l'image à la source de l'élément <img>
  img.alt = title; // Ajoute le titre comme texte alternatif pour l'image (accessibilité)
  
  const figcaption = document.createElement('figcaption'); // Crée un élément <figcaption> pour afficher le titre
  figcaption.textContent = title; // Assigne le titre du projet à l'élément <figcaption>

  figure.append(img, figcaption); // Ajoute l'image et le titre à l'élément <figure>
  return figure; // Retourne l'élément <figure> complet
};

// Fonction pour afficher les projets dans la galerie
const displayGallery = (works) => { 
  const container = document.querySelector('.gallery'); // Sélectionne l'élément du DOM pour la galerie
  container.innerHTML = ''; // Vide le contenu de la galerie pour ne pas avoir de doublons

  works.forEach(({ imageUrl, title }) => { // Pour chaque projet dans le tableau works
    const projectElement = createProjectElement(imageUrl, title); // Crée un élément pour le projet
    container.appendChild(projectElement); // Ajoute l'élément projet à la galerie
  });
};

// Fonction pour filtrer les projets en fonction de la catégorie sélectionnée
const filterGallery = async (categoryId) => {
  const works = await fetchData('http://localhost:5678/api/works'); // Récupère tous les projets depuis l'API
  
  let filteredWorks; // Déclare une variable pour stocker les projets filtrés
  if (categoryId === 'tous') { // Si la catégorie sélectionnée est "tous"
    filteredWorks = works; // Affiche tous les projets
  } else {
    filteredWorks = works.filter(work => work.category.id === categoryId); // Filtre les projets par catégorie
  }

  displayGallery(filteredWorks); // Affiche les projets filtrés dans la galerie
};

// Fonction pour créer tous les boutons de filtre
const createAllFilterButtons = (categories) => {
  const filterSection = document.querySelector('#filtres'); // Sélectionne la section des filtres dans le DOM
  const filterTous = document.querySelector('#filter-tous'); // Sélectionne le bouton "Tous" dans le DOM

  addFilterButton(filterTous, 'tous', 'Tous'); // Ajoute l'événement de clic pour le bouton "Tous"
  setActiveButton(filterTous); // Déclare "Tous" comme actif par défaut

  categories.forEach(({ id, name }) => { // Pour chaque catégorie dans le tableau categories
    const filterButton = document.createElement('button'); // Crée un bouton pour la catégorie
    filterButton.textContent = name; // Affecte le nom de la catégorie comme texte du bouton
    filterButton.classList.add('btn-filter'); // Ajoute une classe pour styliser le bouton
    filterButton.dataset.id = id; // Ajoute l'ID de la catégorie comme attribut data-id
    filterSection.appendChild(filterButton); // Ajoute le bouton dans la section des filtres

    addFilterButton(filterButton, id, name); // Ajoute un événement de clic à ce bouton
  });
};  

// Fonction pour ajouter un événement de clic à chaque bouton de filtre
const addFilterButton = (button, categoryId, name) => {
  button.addEventListener('click', () => { // Ajoute un événement de clic à ce bouton
    filterGallery(categoryId); // Applique le filtre correspondant à la catégorie cliquée
    setActiveButton(button); // Définit ce bouton comme actif en ajoutant la classe "active"
    console.log(`La catégorie : ${name} est cliquée`); // Affiche un message dans la console pour déboguer
  });
};

// Fonction pour définir un bouton comme actif et désactiver les autres
const setActiveButton = (activeButton) => {
  const allButtons = document.querySelectorAll('#filtres button'); // Sélectionne tous les boutons de filtre

  allButtons.forEach(button => { // Parcourt chaque bouton de filtre
    button.classList.remove('active'); // Retire la classe "active" de tous les boutons
    button.disabled = false; // Réactive tous les boutons
  });

  activeButton.classList.add('active'); // Ajoute la classe "active" au bouton sélectionné
  activeButton.disabled = true; // Désactive le bouton pour qu'il ne soit plus cliquable
};

// Fonction pour mettre à jour la galerie après une modification (ajout, suppression...)
const updateGallery = async () => {
  const works = await fetchData('http://localhost:5678/api/works'); // Récupère les projets mis à jour depuis l'API
  displayGallery(works); // Affiche les projets mis à jour dans la galerie
};

// Fonction d'initialisation de l'application
const init = async () => {
  const works = await fetchData('http://localhost:5678/api/works'); // Récupère tous les projets depuis l'API
  displayGallery(works); // Affiche les projets dans la galerie

  const categories = await fetchData('http://localhost:5678/api/categories'); // Récupère toutes les catégories depuis l'API
  createAllFilterButtons(categories); // Crée les boutons de filtres pour chaque catégorie

  filterGallery('tous'); // Applique le filtre "Tous" par défaut
};

// Attacher la fonction updateGallery à l'objet global `window` pour qu'elle soit accessible ailleurs (comme dans modale.js)
window.updateGallery = updateGallery; // Permet à updateGallery d'être utilisée dans d'autres scripts

init(); // Démarre l'application et charge les projets avec le filtre "Tous"