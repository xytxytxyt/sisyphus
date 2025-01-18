export function getGoogleSearchUrl(query: string): string {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
