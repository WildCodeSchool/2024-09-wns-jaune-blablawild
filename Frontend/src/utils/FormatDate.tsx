export function formatDate(dateString: string, locale: string) {
    return new Date(dateString).toLocaleString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
  