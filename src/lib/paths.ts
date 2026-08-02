/** Base path for static assets (embed-demo, case.html, etc.) */
export function publicPath(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}

/** Origin + base path — for Stripe redirect URLs on GitHub Pages */
export function appOrigin(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${window.location.origin}${base}`;
}
