export function formatTime(dateString: string, locale: string) {
    return new Date(dateString).toLocaleString(locale, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }