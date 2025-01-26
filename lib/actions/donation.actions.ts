"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";

export const checkoutDonation = async (donation: { amount: number }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: Math.round(donation.amount * 100),
            product_data: {
              name: "Donation",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      metadata: {
        amount: donation.amount,
      },
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};
