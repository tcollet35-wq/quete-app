// lib/parishes.ts
export type Parish = {
  slug: string;
  name: string;
  city?: string;
  logo?: string;    // /public/...
  tagline?: string; // phrase sous le titre
};

export const parishes: Record<string, Parish> = {
  "saint-paul": {
    slug: "saint-paul",
    name: "Paroisse Saint-Paul",
    city: "Paris",
    logo: "/logo-paroisse.svg",   // mets un vrai logo dans /public si tu veux
    tagline: "Merci pour votre générosité",
  },
};

export function getParish(slug: string): Parish {
  return (
    parishes[slug] ?? {
      slug,
      name: `Paroisse ${slug}`,
      logo: "/favicon.ico",
      tagline: "Don discret & rapide",
    }
  );
}
