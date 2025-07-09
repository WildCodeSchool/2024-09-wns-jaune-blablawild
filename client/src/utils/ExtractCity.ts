export function extractCityFromAddress(adress: string): string {
  if (!adress) return "";

  const postalCodeCityPattern = /\b\d{5}\s+(.+)$/;
  const match = adress.match(postalCodeCityPattern)

  if(match && match[1]){
    return match[1].trim()
  }

  return adress
}
