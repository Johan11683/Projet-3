// Fonction utilitaire pour récupérer les données depuis l'API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur de chargement des données');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fonction pour afficher les projets dans la galerie
const displayGallery = (works) => {
  const container = document.querySelector('.gallery');
  container.innerHTML = ''; // On vide la galerie avant de rajouter les nouveaux éléments

  works.forEach(({ imageUrl, title }) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = imageUrl;  // L'image du projet
    img.alt = title;     // Le titre du projet, pour l'accessibilité
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = title; // Le titre du projet

    figure.append(img, figcaption);
    container.appendChild(figure);
  });
};

// Fonction pour appliquer le filtre
const filterGallery = async (categoryId) => {
  // Récupérer les données des travaux
  const works = await fetchData('http://localhost:5678/api/works');
  
  let filteredWorks;  // On déclare filteredWorks

  // Si la catégorie est 'tous', on garde tous les travaux
  if (categoryId === 'tous') {
    filteredWorks = works;
  } else {
    // Sinon, on filtre les projets par catégorie
    filteredWorks = works.filter(work => work.category.id === categoryId);
  }

  // Affichage des projets filtrés
  displayGallery(filteredWorks);
};

// Fonction pour créer les boutons de filtres
function createFilterButtons(categories) {
  const filterSection = document.querySelector('#filtres');

  // Ajouter un bouton "Tous"
  const filterTous = document.querySelector('#filter-tous');
  filterTous.addEventListener('click', () => filterGallery('tous'));

  // Ajouter les boutons de filtres pour chaque catégorie
  categories.forEach(({ id, name }) => {
    const filterButton = document.createElement('button');
    filterButton.textContent = name;
    filterButton.classList.add('btn-filter');
    filterButton.dataset.id = id; // Lier l'ID de la catégorie au bouton
    filterSection.appendChild(filterButton);

    // Quand on clique sur un bouton de catégorie, on applique le filtre
    filterButton.addEventListener('click', () => filterGallery(id));
  });
}

// Fonction d'initialisation
const init = async () => {
  // Récupérer et afficher les projets dans la galerie
  const works = await fetchData('http://localhost:5678/api/works');
  displayGallery(works);

  // Récupérer les catégories et initialiser les filtres
  const categories = await fetchData('http://localhost:5678/api/categories');
  createFilterButtons(categories);

  // Initialiser la galerie avec tous les projets au début
  filterGallery('tous');
};

// Fonction pour mettre à jour la galerie après une modification (ajout ou suppression)
const updateGallery = async () => {
  const works = await fetchData('http://localhost:5678/api/works');
  displayGallery(works);
};

// Attacher la fonction à l'objet global `window` pour la rendre accessible ailleurs
window.updateGallery = updateGallery;



// Appeler la fonction d'initialisation pour démarrer l'application
init();
