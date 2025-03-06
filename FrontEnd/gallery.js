fetch('http://localhost:5678/api/works')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de chargement des données');
    }
    return response.json();
  })
  .then(data => {
    const container = document.querySelector('.gallery');  // Récupère le conteneur de la galerie
    // Vider le conteneur avant d'ajouter les nouveaux éléments
    container.innerHTML = '';

    data.forEach(item => {
      // Créer l'élément figure pour chaque projet
      const figure = document.createElement('figure');
      
      // Créer l'image du projet
      const img = document.createElement('img');
      img.src = item.imageUrl;  // URL de l'image
      img.alt = item.title;     // Titre de l'image (utile pour l'accessibilité)
      figure.appendChild(img);
      
      // Créer la légende (figcaption) pour le projet
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = item.title;  // Titre du projet
      figure.appendChild(figcaption);
      
      // Ajouter le projet à la galerie
      container.appendChild(figure);
    });
  })
  .catch(error => {
    console.error('Erreur:', error);
  });


  document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les catégories depuis l'API
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(categories => {
        // Ajouter un bouton "Tous"
        const filterTous = document.getElementById('filter-tous');
        filterTous.addEventListener('click', () => filterGallery('tous'));
  
        // Ajouter les boutons de filtres pour chaque catégorie
        const filterSection = document.getElementById('filtres');
        categories.forEach(category => {
          const filterButton = document.createElement('button');
          filterButton.textContent = category.name;
          filterButton.addEventListener('click', () => filterGallery(category.name));
          filterSection.appendChild(filterButton);
        });
  
        // Fonction pour appliquer le filtre
        function filterGallery(category) {
          const gallery = document.querySelector('.gallery');  // Utiliser la classe pour récupérer la galerie
          console.log('Filtrage des travaux pour la catégorie:', category);
          gallery.innerHTML = '';  // Vider la galerie avant de la remplir avec les éléments filtrés
  
          fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(works => {
              let filteredWorks = works;
              if (category !== 'tous') {
                filteredWorks = works.filter(work => work.category.name === category);
              }
  
              // Remplir la galerie avec les éléments filtrés
              filteredWorks.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = work.title;
                figure.appendChild(img);
                figure.appendChild(figcaption);
                gallery.appendChild(figure);
              });
            })
            .catch(error => {
              console.error('Erreur lors du filtrage:', error);
            });
        }
  
        // Initialiser la galerie avec tous les projets au début
        filterGallery('tous');
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories :', error);
      });
  });
