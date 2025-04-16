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
        // Pour éviter de capitaliser les petits mots comme "le", "de", etc.
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
}
