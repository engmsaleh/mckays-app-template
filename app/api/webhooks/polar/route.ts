import { Webhooks } from "@polar-sh/nextjs";

// Get the Convex site URL (different from deployment URL)
// Format: https://<deployment-name>.convex.site
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  ".convex.cloud",
  ".convex.site"
);

async function updateCustomerMembership(
  userId: string,
  membership: "free" | "pro",
  polarCustomerId?: string,
  polarSubscriptionId?: string
) {
  if (!CONVEX_SITE_URL) {
    console.error("CONVEX_SITE_URL not configured");
    return;
  }

  try {
    const response = await fetch(`${CONVEX_SITE_URL}/updateCustomer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        membership,
        polarCustomerId,
        polarSubscriptionId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update customer:", await response.text());
    }
  } catch (error) {
    console.error("Error calling Convex:", error);
  }
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log("Polar webhook received:", payload.type);

    // Handle subscription events
    if (
      payload.type === "subscription.created" ||
      payload.type === "subscription.active"
    ) {
      const data = payload.data as {
        id: string;
        customerId: string;
        customer?: { externalId?: string };
      };

      const userId = data.customer?.externalId;
      if (userId) {
        await updateCustomerMembership(userId, "pro", data.customerId, data.id);
      }
    }

    if (
      payload.type === "subscription.canceled" ||
      payload.type === "subscription.revoked"
    ) {
      const data = payload.data as {
        customer?: { externalId?: string };
      };

      const userId = data.customer?.externalId;
      if (userId) {
        await updateCustomerMembership(userId, "free");
      }
    }

    // Handle checkout events for logging
    if (
      payload.type === "checkout.created" ||
      payload.type === "checkout.updated"
    ) {
      const data = payload.data as { id: string; status?: string };
      console.log(`Checkout ${payload.type}:`, data.id, data.status);
    }
  },
});
