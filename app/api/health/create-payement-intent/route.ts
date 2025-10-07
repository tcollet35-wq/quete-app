// app/api/create-payment-intent/route.ts
export const runtime = "nodejs";

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// ⬇️ ne PAS passer apiVersion : le SDK utilisera sa version embarquée
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
