const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const imageCache = new Map<string, string>();

export const getUnsplashImage = async (cityName: string): Promise<string> => {
  if (imageCache.has(cityName)) {
    return imageCache.get(cityName)!;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(cityName)} skyline architecture landmark&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 403) {
        console.error('Erreur 403: Clé API Unsplash invalide ou limites dépassées');
        console.error('Vérifiez votre clé API sur https://unsplash.com/developers');
      } else if (response.status === 401) {
        console.error('Erreur 401: Clé API Unsplash non autorisée');
      } else if (response.status === 429) {
        console.error('Erreur 429: Trop de requêtes, limites de taux dépassées');
      }
      
      throw new Error(`Erreur API Unsplash: ${response.status}`);
    }
    
    const data = await response.json();
    const imageUrl = data.urls.regular;
    
    imageCache.set(cityName, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Erreur Unsplash:', error);
    const fallbackImage = "/images/cities/default.jpg";
    
    imageCache.set(cityName, fallbackImage);
    
    return fallbackImage;
  }
};