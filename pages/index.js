import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.pk_test_51Rs2g2CX8MG8wIGVEw87DP5HvHxKhOwYhABknLqWmWBP145mLqDbjQxUrG4naVdX50mqM2zmlh9uDUAO1ZzQqvXx00CroDd8ne);

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!email) {
      alert("Merci de saisir ton email");
      return;
    }
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert(result.error.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, textAlign: "center" }}>
      <h1>Achat Formation Vinted</h1>
      <p>Apprends à acheter et revendre sur Vinted.</p>

      <input
        type="email"
        placeholder="Ton email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <button onClick={handleCheckout} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Chargement..." : "Acheter la formation - 49€"}
      </button>
    </div>
  );
}
