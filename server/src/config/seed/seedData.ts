export const routes = [
  // Routes depuis/vers Paris (hub principal)
  { departure: 'Paris', arrival: 'Lyon' },
  { departure: 'Lyon', arrival: 'Paris' },
  { departure: 'Paris', arrival: 'Marseille' },
  { departure: 'Marseille', arrival: 'Paris' },
  { departure: 'Paris', arrival: 'Toulouse' },
  { departure: 'Toulouse', arrival: 'Paris' },
  { departure: 'Paris', arrival: 'Bordeaux' },
  { departure: 'Bordeaux', arrival: 'Paris' },
  { departure: 'Paris', arrival: 'Nantes' },
  { departure: 'Nantes', arrival: 'Paris' },
  { departure: 'Paris', arrival: 'Strasbourg' },
  { departure: 'Strasbourg', arrival: 'Paris' },
  { departure: 'Paris', arrival: 'Angers' },
  { departure: 'Angers', arrival: 'Paris' },

  // Routes Lyon - autres villes
  { departure: 'Lyon', arrival: 'Marseille' },
  { departure: 'Marseille', arrival: 'Lyon' },
  { departure: 'Lyon', arrival: 'Toulouse' },
  { departure: 'Toulouse', arrival: 'Lyon' },
  { departure: 'Lyon', arrival: 'Strasbourg' },
  { departure: 'Strasbourg', arrival: 'Lyon' },

  // Routes Marseille - autres villes
  { departure: 'Marseille', arrival: 'Toulouse' },
  { departure: 'Toulouse', arrival: 'Marseille' },
  { departure: 'Marseille', arrival: 'Bordeaux' },
  { departure: 'Bordeaux', arrival: 'Marseille' },

  // Routes Toulouse - autres villes
  { departure: 'Toulouse', arrival: 'Bordeaux' },
  { departure: 'Bordeaux', arrival: 'Toulouse' },

  // Routes Bordeaux - autres villes
  { departure: 'Bordeaux', arrival: 'Nantes' },
  { departure: 'Nantes', arrival: 'Bordeaux' },
  { departure: 'Bordeaux', arrival: 'Angers' },
  { departure: 'Angers', arrival: 'Bordeaux' },

  // Routes Nantes - autres villes
  { departure: 'Nantes', arrival: 'Angers' },
  { departure: 'Angers', arrival: 'Nantes' },
  { departure: 'Nantes', arrival: 'Lyon' },
  { departure: 'Lyon', arrival: 'Nantes' },

  // Routes régionales supplémentaires
  { departure: 'Angers', arrival: 'Lyon' },
  { departure: 'Lyon', arrival: 'Angers' },
  { departure: 'Strasbourg', arrival: 'Marseille' },
  { departure: 'Marseille', arrival: 'Strasbourg' },
  { departure: 'Strasbourg', arrival: 'Toulouse' },
  { departure: 'Toulouse', arrival: 'Strasbourg' },
  { departure: 'Angers', arrival: 'Toulouse' },
  { departure: 'Toulouse', arrival: 'Angers' },
  { departure: 'Nantes', arrival: 'Strasbourg' },
  { departure: 'Strasbourg', arrival: 'Nantes' },
];

  export const getRandomRoute = () => {
    return routes[Math.floor(Math.random() * routes.length)];
  }

  export const reviewData = [
    // Notes 5/5
    { rating: 5, comment: "Parfait ! Conducteur exemplaire, je recommande à 100%." },
    { rating: 5, comment: "Excellent trajet, très professionnel et sympathique." },
    { rating: 5, comment: "Impeccable, ponctuel et très agréable." },
    { rating: 5, comment: "Top ! Conduite sûre et ambiance détendue." },
    { rating: 5, comment: "Fantastique, merci pour ce super moment !" },
    { rating: 5, comment: "Parfait, je n'hésiterai pas à refaire appel à ce conducteur." },
    { rating: 5, comment: "Rien à redire, expérience parfaite du début à la fin." },
    { rating: 5, comment: "Excellent conducteur, très ponctuel et voiture impeccable." },
    { rating: 5, comment: "Super trajet, bonne musique et excellente compagnie !" },
    { rating: 5, comment: "Parfait en tous points, merci beaucoup !" },

    // Notes 4/5
    { rating: 4, comment: "Très bien, petit retard mais trajet agréable." },
    { rating: 4, comment: "Bonne expérience, conducteur sympa et prudent." },
    { rating: 4, comment: "Très satisfait, juste un peu de circulation." },
    { rating: 4, comment: "Bien, voiture confortable et bonne conduite." },
    { rating: 4, comment: "Très bon conducteur, je recommande." },
    { rating: 4, comment: "Rien à redire, trajet sans problème." },
    { rating: 4, comment: "Très bien, ponctuel et respectueux." },
    { rating: 4, comment: "Bonne expérience, dommage pour les embouteillages." },
    { rating: 4, comment: "Très correct, conducteur agréable et sérieux." },
    { rating: 4, comment: "Bien dans l'ensemble, petit souci de GPS au début." },

    // Notes 3/5
    { rating: 3, comment: "Correct, sans plus. Trajet classique." },
    { rating: 3, comment: "Bien, mais pourrait être plus ponctuel." },
    { rating: 3, comment: "Acceptable, conduite un peu rapide à mon goût." },
    { rating: 3, comment: "Correct, conversation limitée mais trajet ok." },
    { rating: 3, comment: "Bien dans l'ensemble, quelques embouteillages." },
    { rating: 3, comment: "Trajet correct, conducteur peu bavard." },
    { rating: 3, comment: "Acceptable, voiture un peu ancienne mais propre." },
    { rating: 3, comment: "Moyen, pas d'ambiance particulière." },
    { rating: 3, comment: "Correct, mais j'ai connu mieux." },

    // Notes 2/5
    { rating: 2, comment: "Moyen, en retard et conduite un peu brusque." },
    { rating: 2, comment: "Pas terrible, musique trop forte." },
    { rating: 2, comment: "Décevant, conducteur peu aimable." },
    { rating: 2, comment: "Trajet compliqué, plusieurs détours." },
    { rating: 2, comment: "Pas génial, voiture pas très propre." },
    { rating: 2, comment: "Mitigé, communication difficile." },
    { rating: 2, comment: "Bof, en retard et conduite nerveuse." },
    { rating: 2, comment: "Pas satisfait, trop de stops non prévus." },

    // Notes 1/5
    { rating: 1, comment: "Très décevant, beaucoup de retard." },
    { rating: 1, comment: "Mauvaise expérience, conduite dangereuse." },
    { rating: 1, comment: "À éviter, conducteur désagréable." },
    { rating: 1, comment: "Terrible, voiture en mauvais état." },
    { rating: 1, comment: "Très mauvais, non respect des horaires." },
    { rating: 1, comment: "Décevant, trajet très inconfortable." },
    { rating: 1, comment: "Mauvaise expérience, je déconseille." },
    { rating: 1, comment: "Catastrophique, conduite très dangereuse." }
  ];

  export const getRandomReview = () => {
    const random = Math.random();
    let ratingRange;
    
    if (random < 0.4) ratingRange = 5; // 40% de 5 étoiles
    else if (random < 0.7) ratingRange = 4; // 30% de 4 étoiles
    else if (random < 0.85) ratingRange = 3; // 15% de 3 étoiles
    else if (random < 0.95) ratingRange = 2; // 10% de 2 étoiles
    else ratingRange = 1; // 5% de 1 étoile
    
    // Filtrer les reviews par rating
    const reviewsForRating = reviewData.filter(r => r.rating === ratingRange);
    
    // Sélectionner une review aléatoire dans cette catégorie
    return reviewsForRating[Math.floor(Math.random() * reviewsForRating.length)];
  };