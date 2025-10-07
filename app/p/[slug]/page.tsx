"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DonationMobile from "@/components/DonationMobile";
import ParishHero from "@/components/ParishHero";
import { getParish } from "@/lib/parishes";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Page({ params }: { params: { slug: string } }) {
  const parish = getParish(params.slug);

  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: "stripe" } }}>
      <main className="min-h-screen bg-white">
        <ParishHero
          name={parish.name}
          city={parish.city}
          logo={parish.logo}
          tagline={parish.tagline}
        />

        <section className="max-w-sm mx-auto p-6">
          <DonationMobile parishSlug={params.slug} currency="EUR" />

          {/* gages de confiance / info fiscalité */}
          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>Paiement sécurisé. Apple Pay / Google Pay selon votre appareil.</p>
            <p>Vous recevrez un récapitulatif annuel pour la déduction fiscale.</p>
          </div>
        </section>
      </main>
    </Elements>
  );
}
