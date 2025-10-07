"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DonationMobile from "../../../components/DonationMobile";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: "stripe" } }}>
      <main className="min-h-screen bg-white">
        <DonationMobile parishSlug={params.slug} currency="EUR" />
      </main>
    </Elements>
  );
}
