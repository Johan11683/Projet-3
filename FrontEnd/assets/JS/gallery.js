// Script pour afficher les projets dans la galerie et appliquer les filtres
// 1 : Récupère les données des projets et des catégories depuis l'API
// 2 : Affiche les projets dans la galerie
// 3 : Crée les boutons de filtres pour chaque catégorie
// 4 : Applique le filtre lorsqu'un bouton est cliqué, "Tous" par défaut
// 5 : Initialise l'application en appelant la fonction init
// 6 : Met à jour la galerie après une modification (ajout ou suppression) avec la fonction updateGallery
// 7 : Attache la fonction updateGallery à l'objet global window pour la rendre accessible dans modale.js 
//     et ainsi mettre à jour la galerie et la modale après une modification


// Fonction utilitaire pour récupérer les données depuis l'API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erreur de chargement des données');
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fonction pour afficher les projets dans la galerie
const displayGallery = (works) => {
  const container = document.querySelector('.gallery');
  container.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux éléments

  works.forEach(({ imageUrl, title }) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = title;

    figure.append(img, figcaption);
    container.appendChild(figure);
  });
};

// Fonction pour appliquer le filtre
const filterGallery = async (categoryId) => {
  const works = await fetchData('http://localhost:5678/api/works');
  const filteredWorks = categoryId === 'tous' 
    ? works 
    : works.filter(work => work.category.id === categoryId);
  displayGallery(filteredWorks);
};

// Fonction pour créer les boutons de filtres
const createFilterButtons = (categories) => {
  const filterSection = document.querySelector('#filtres');

  // Ajouter le bouton "Tous"
  const filterTous = document.querySelector('#filter-tous');
  filterTous.addEventListener('click', () => filterGallery('tous'));

  // Ajouter les boutons de filtres pour chaque catégorie
  categories.forEach(({ id, name }) => {
    const filterButton = document.createElement('button');
    filterButton.textContent = name;
    filterButton.classList.add('btn-filter');
    filterButton.dataset.id = id;
    filterSection.appendChild(filterButton);

    filterButton.addEventListener('click', () => filterGallery(id));
  });
};

// Fonction d'initialisation
const init = async () => {
  const works = await fetchData('http://localhost:5678/api/works');
  displayGallery(works);

  const categories = await fetchData('http://localhost:5678/api/categories');
  createFilterButtons(categories);

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
