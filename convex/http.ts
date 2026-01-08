import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// HTTP endpoint for webhook to update customer membership
http.route({
  path: "/updateCustomer",
  method: "POST",
  handler: httpAction(async (ctx: any, request: Request) => {
    const body = await request.json();
    const { userId, membership, polarCustomerId, polarSubscriptionId } = body;

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    try {
      await ctx.runMutation(api.customers.upsertByUserId, {
        userId,
        membership: membership || "free",
        polarCustomerId,
        polarSubscriptionId,
      });

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error updating customer:", error);
      return new Response("Internal error", { status: 500 });
    }
  }),
});

export default http;
