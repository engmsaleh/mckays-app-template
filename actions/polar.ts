"use server";

import { polar } from "@/lib/polar";
import { auth } from "@clerk/nextjs/server";

export async function createPolarCheckout(productId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Not authenticated" };
    }

    // Support Railway, Vercel, or custom app URL
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");

    const successUrl = `${baseUrl}/dashboard?checkout=success`;

    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: userId, // Links the Polar customer to Clerk user
      successUrl,
    });

    return { url: checkout.url };
  } catch (error) {
    console.error("Polar checkout error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create checkout",
    };
  }
}
