// components/ParishHero.tsx
type Props = {
  name: string;
  city?: string;
  logo?: string;
  tagline?: string;
};

export default function ParishHero({ name, city, logo, tagline }: Props) {
  return (
    <header className="bg-gradient-to-b from-gray-50 to-white border-b">
      <div className="max-w-sm mx-auto px-6 py-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full overflow-hidden ring-1 ring-gray-200 bg-white flex items-center justify-center">
          {/* image classique pour éviter la config next/image */}
          <img
            src={logo || "/favicon.ico"}
            alt={name}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{name}</h1>
          {city ? <p className="text-gray-600">{city}</p> : null}
          {tagline ? <p className="text-sm text-gray-500 mt-1">{tagline}</p> : null}
        </div>
      </div>
    </header>
  );
}
