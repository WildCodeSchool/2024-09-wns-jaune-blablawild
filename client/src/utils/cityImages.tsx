export const cityImages: Record<string, string> = {
  "paris": "/cities/paris.webp",
  "lyon": "/cities/lyon.webp",
  "marseille": "/cities/marseille.webp",
  "toulouse": "/cities/toulouse.webp",
  "nantes": "/cities/nantes.webp",
  "strasbourg": "/cities/strasbourg.webp",
  "bordeaux": "/cities/bordeaux.webp",
  "angers": "/cities/angers.webp"
};

export const getStaticCityImage = (cityName: string): string => {
  const normalizedCity = cityName.toLowerCase().trim();
  
  return cityImages[normalizedCity] || "/cities/default.webp";
};