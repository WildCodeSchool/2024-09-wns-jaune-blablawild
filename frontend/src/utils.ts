export function getUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const queryString = window.location.search;
  if (!queryString) return params;
  new URLSearchParams(queryString).forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function capitalizeFirstLetter(text: string) {
  return text[0].toUpperCase() + text.slice(1);
}
