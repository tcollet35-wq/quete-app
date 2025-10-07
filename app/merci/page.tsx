// app/merci/page.tsx
import Link from "next/link";

export default function Merci() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-semibold">Merci pour votre don 🙏</h1>
        <p>Votre contribution a bien été prise en compte.</p>
        <Link href="/" className="underline">Retour</Link>
      </div>
    </main>
  );
}
