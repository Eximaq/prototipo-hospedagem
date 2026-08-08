export function buildGoogleMapsEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function buildGoogleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildWazeSearchUrl(query: string) {
  return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
}

export function buildWazeCoordinatesUrl(latitude: number, longitude: number) {
  return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
}
