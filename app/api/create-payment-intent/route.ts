// app/api/create-payment-intent/route.ts
export const runtime = "nodejs";

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "EUR", parishSlug, email } = await req.json();

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Montant minimum 0,50 €" }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { parishSlug, email: email || "" },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: pi.client_secret });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
