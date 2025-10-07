// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Quête — Don discret & rapide</h1>
        <p className="text-gray-600">
          Scannez le QR code de la paroisse ou cliquez ci-dessous pour tester la page de don.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/p/saint-paul"
            className="rounded-xl px-5 py-3 border border-black hover:bg-black hover:text-white transition"
          >
            Aller à la page de don
          </a>
          <a
            href="/merci"
            className="rounded-xl px-5 py-3 border border-gray-300 hover:bg-gray-100 transition"
          >
            Voir la page “merci”
          </a>
        </div>

        <p className="text-xs text-gray-500">
          Démo — remplacez <code>saint-paul</code> par le slug de votre paroisse.
        </p>
      </div>
    </main>
  );
}
