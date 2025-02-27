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
