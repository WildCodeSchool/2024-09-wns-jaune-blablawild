export function formatDate(dateString: string, locale: string) {
  const date = new Date(dateString).toLocaleString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
 
  return date
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/\b\w+\b/g, (word) => {
      if (word.length > 2) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
}

export function formatLocalTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC' 
  }).replace(':', 'h');
}