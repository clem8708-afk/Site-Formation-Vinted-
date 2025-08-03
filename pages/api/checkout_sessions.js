import Stripe from "stripe";

const stripe = new Stripe(process.env.pk_test_51Rs2g2CX8MG8wIGVEw87DP5HvHxKhOwYhABknLqWmWBP145mLqDbjQxUrG4naVdX50mqM2zmlh9uDUAO1ZzQqvXx00CroDd8ne);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Formation Achat-Revente Vinted",
              },
              unit_amount: 4900, // 49,00 €
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/merci`,
        cancel_url: `${req.headers.origin}/`,
        customer_email: email,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
