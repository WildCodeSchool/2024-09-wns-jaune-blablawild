const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const getUnsplashImage = async (cityName: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(cityName)} skyline architecture landmark&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API Unsplash: ${response.status}`);
    }
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Erreur Unsplash:', error);
    return "/images/cities/default.jpg";
  }
};