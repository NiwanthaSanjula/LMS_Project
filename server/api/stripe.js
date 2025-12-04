import Stripe from "stripe";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false, // IMPORTANT
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  let event;
  const sig = req.headers["stripe-signature"];

  try {
    const buf = await buffer(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe webhook received:", event.type);

  // YOU CAN HANDLE EVENTS HERE
  // e.g. payment_intent.succeeded

  return res.json({ received: true });
}
