"use client";

import { useEffect, useState } from "react";
import { useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
// ✅ bons types côté navigateur
import type {
  PaymentRequest as StripePaymentRequest,
  PaymentRequestPaymentMethodEvent,
} from "@stripe/stripe-js";

type Props = {
  parishSlug: string;
  currency?: string; // ex: "EUR"
};

export default function DonationMobile({ parishSlug, currency = "EUR" }: Props) {
  const stripe = useStripe();

  // UI state
  const [amount, setAmount] = useState<number>(500); // 5,00 € par défaut
  const [email, setEmail] = useState<string>("");

  // Payment Request
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);
  const [reason, setReason] = useState<string>("Initialisation…");

  const quick = [200, 500, 1000, 2000, 5000, 10000]; // 2, 5, 10, 20, 50, 100 €

  // 1) Créer l'objet Payment Request et vérifier la compatibilité device/navigateur
  useEffect(() => {
    if (!stripe) {
      setReason("Stripe pas chargé");
      return;
    }

    const pr = stripe.paymentRequest({
      country: "FR",
      currency: currency.toLowerCase(), // "eur"
      total: { label: "Don à la paroisse", amount },
      requestPayerEmail: false, // on gère l'email via notre champ optionnel
    });

    pr
      .canMakePayment()
      .then((res) => {
        if (res) {
          setPaymentRequest(pr);
          setReason("OK");
        } else {
          setPaymentRequest(null);
          setReason("Non compatible (device/navigateur) ou Apple Pay non vérifié");
        }
      })
      .catch(() => {
        setPaymentRequest(null);
        setReason("Erreur canMakePayment");
      });
  }, [stripe, amount, currency]);

  // 2) Gestion du paiement quand l’utilisateur valide dans Apple/Google Pay
  useEffect(() => {
    if (!paymentRequest || !stripe) return;

    const handler = async (ev: PaymentRequestPaymentMethodEvent) => {
      try {
        // Crée le PaymentIntent sur notre API (côté serveur)
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ amount, currency, parishSlug, email }),
        });
        const data = await res.json();

        if (!data?.clientSecret) {
          ev.complete("fail");
          alert(data?.error || "Erreur création paiement");
          return;
        }

        // Confirme le paiement avec le payment method fourni par Apple/Google Pay
        const { error } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: ev.paymentMethod.id,
        });

        if (error) {
          ev.complete("fail");
          alert(error.message || "Échec paiement");
        } else {
          ev.complete("success");
          // Redirection vers la page "merci"
          window.location.href = "/merci";
        }
      } catch {
        ev.complete("fail");
        alert("Erreur réseau/paiement");
      }
    };

    // on abonne l'événement
    paymentRequest.on("paymentmethod", handler);

    // pas d'API officielle .off sur ce wrapper — on laisse tel quel
    // (Stripe gère le cycle de vie du PaymentRequest côté élément)
  }, [paymentRequest, stripe, amount, currency, parishSlug, email]);

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Donner à la paroisse</h1>
      <p className="text-gray-600">
        Paroisse : <strong>{parishSlug}</strong>
      </p>

      {/* Montants rapides */}
      <div className="grid grid-cols-3 gap-2">
        {quick.map((v) => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            className={`rounded-xl p-3 border ${
              amount === v ? "border-black" : "border-gray-200"
            }`}
          >
            {(v / 100).toFixed(2)} €
          </button>
        ))}
      </div>

      {/* Autre montant */}
      <div>
        <label className="text-sm">Autre montant (€)</label>
        <input
          type="number"
          inputMode="decimal"
          min={0.5}
          step="0.5"
          className="w-full border rounded-xl p-3"
          onChange={(e) => {
            const val = parseFloat(e.target.value || "0");
            setAmount(Math.max(0, Math.round(val * 100))); // en centimes
          }}
          placeholder="Ex: 7"
        />
      </div>

      {/* Email optionnel pour reçu annuel */}
      <div>
        <label className="text-sm">Email (pour reçu annuel, optionnel)</label>
        <input
          type="email"
          className="w-full border rounded-xl p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
        />
      </div>

      {/* Bouton Apple Pay / Google Pay si compatible, sinon message explicatif */}
      {paymentRequest ? (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      ) : (
        <div className="rounded-xl border border-dashed p-3 text-sm">
          Bouton indisponible ici. Teste sur iPhone/Safari (Apple Pay) ou Android/Chrome (Google Pay).
          <div className="text-xs mt-1 text-gray-500">Raison : {reason}</div>
        </div>
      )}
    </div>
  );
}
