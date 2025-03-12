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
const fetchData = async (url) => { // La fonction utilise Fetch pour récupérer les données depuis l'API
  try {
    const response = await fetch(url); // Elle effectue une requête HTTP GET pour récupérer les données (par défaut = GET)
    if (!response.ok) throw new Error('Erreur de chargement des données');  // Si la réponse n'est pas OK, une erreur est levée
    return await response.json(); // Convertit la réponse en JSON et la retourne
  } catch (error) { 
    console.error(error); // Affiche l'erreur dans la console
  }
};

// Fonction pour afficher les projets dans la galerie
const displayGallery = (works) => {
  const container = document.querySelector('.gallery'); // Sélectionne la galerie
  container.innerHTML = ''; // Vider la galerie avant d'ajouter les nouveaux éléments

  works.forEach(({ imageUrl, title }) => {
    const figure = document.createElement('figure'); // Pour chaque projet, crée une "figure"
    const img = document.createElement('img'); // Crée une balise "img" pour l'image
    img.src = imageUrl; // Définit l'attribut "src" de l'image
    img.alt = title; // Définit l'attribut "alt" de l'image
    const figcaption = document.createElement('figcaption'); // Crée une balise "figcaption" pour le titre
    figcaption.textContent = title; // Définit le texte du titre

    figure.append(img, figcaption); // Ajoute l'image et le titre à la "figure"
    container.appendChild(figure); // Ajoute la "figure" à la galerie
  });
};

// Fonction pour appliquer le filtre
const filterGallery = async (categoryId) => { // La fonction prend en paramètre l'ID de la catégorie
  const works = await fetchData('http://localhost:5678/api/works'); // Récupère les projets depuis l'API
  const filteredWorks = categoryId === 'tous' // Si l'ID est "tous", tous les projets sont affichés, sinon le filtre est appliqué
    ? works // Si l'ID est "tous", tous les projets sont affichés
    : works.filter(work => work.category.id === categoryId); // Sinon, les projets sont filtrés par catégorie
  displayGallery(filteredWorks); // Affiche les projets filtrés dans la galerie
};

const createFilterButtons = (categories) => {
  const filterSection = document.querySelector('#filtres');
  
  // Ajouter le bouton "Tous"
  const filterTous = document.querySelector('#filter-tous');
  filterTous.addEventListener('click', () => {
    filterGallery('tous');
    setActiveButton(filterTous); // Ajoute la classe "active" au bouton "Tous"
  });

  // "Tous" est actif par défaut
  setActiveButton(filterTous); // Ajoute la classe "active" au bouton "Tous" par défaut

  // Ajouter les boutons de filtres pour chaque catégorie
  categories.forEach(({ id, name }) => {
    const filterButton = document.createElement('button');
    filterButton.textContent = name;
    filterButton.classList.add('btn-filter');
    filterButton.dataset.id = id;
    filterSection.appendChild(filterButton);

    filterButton.addEventListener('click', () => {
      filterGallery(id);
      setActiveButton(filterButton); // Ajoute la classe "active" au bouton cliqué
      console.log(`La catégorie : ${name} est cliquée`);
    });
  });
};

// Fonction qui permet d'ajouter la classe Active au bouton cliqué, et d'empêcher qu'il soit cliquable à nouveau
const setActiveButton = (activeButton) => {
  const allButtons = document.querySelectorAll('#filtres button');
  allButtons.forEach(button => {
    button.classList.remove('active'); // Retire la classe "active" de tous les boutons
    button.disabled = false; // Réactive tous les boutons
  });
  activeButton.classList.add('active'); // Ajoute la classe "active" au bouton sélectionné
  activeButton.disabled = true; // Désactive le bouton actif
};



// Fonction d'initialisation
const init = async () => { // La fonction initialise l'application
  const works = await fetchData('http://localhost:5678/api/works'); // Récupère les projets depuis l'API
  displayGallery(works);// Affiche les projets dans la galerie

  const categories = await fetchData('http://localhost:5678/api/categories'); // Récupère les catégories depuis l'API
  createFilterButtons(categories); // Crée les boutons de filtres pour chaque catégorie

  filterGallery('tous'); // Applique le filtre "Tous" par défaut  
};

// Fonction pour mettre à jour la galerie après une modification (ajout ou suppression)
const updateGallery = async () => { // La fonction met à jour la galerie après une modification
  const works = await fetchData('http://localhost:5678/api/works'); // Récupère les projets depuis l'API
  displayGallery(works); //  Affiche les projets dans la galerie
};

// Attacher la fonction à l'objet global `window` pour la rendre accessible ailleurs
window.updateGallery = updateGallery; // Rend la fonction updateGallery accessible dans modale.js

// Appeler la fonction d'initialisation pour démarrer l'application
init();
