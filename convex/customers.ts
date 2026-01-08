import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get customer by Clerk user ID
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx: any, args: { userId: string }) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .first();
  },
});

// Get customer by Polar customer ID (for webhooks)
export const getByPolarCustomerId = query({
  args: { polarCustomerId: v.string() },
  handler: async (ctx: any, args: { polarCustomerId: string }) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_polarCustomerId", (q: any) =>
        q.eq("polarCustomerId", args.polarCustomerId)
      )
      .first();
  },
});

// Create a new customer
export const create = mutation({
  args: {
    userId: v.string(),
    membership: v.optional(v.union(v.literal("free"), v.literal("pro"))),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
  },
  handler: async (
    ctx: any,
    args: {
      userId: string;
      membership?: "free" | "pro";
      polarCustomerId?: string;
      polarSubscriptionId?: string;
    }
  ) => {
    const now = Date.now();
    return await ctx.db.insert("customers", {
      userId: args.userId,
      membership: args.membership ?? "free",
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update customer by Clerk user ID
export const updateByUserId = mutation({
  args: {
    userId: v.string(),
    membership: v.optional(v.union(v.literal("free"), v.literal("pro"))),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
  },
  handler: async (
    ctx: any,
    args: {
      userId: string;
      membership?: "free" | "pro";
      polarCustomerId?: string;
      polarSubscriptionId?: string;
    }
  ) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.membership !== undefined) updates.membership = args.membership;
    if (args.polarCustomerId !== undefined)
      updates.polarCustomerId = args.polarCustomerId;
    if (args.polarSubscriptionId !== undefined)
      updates.polarSubscriptionId = args.polarSubscriptionId;

    await ctx.db.patch(customer._id, updates);
    return customer._id;
  },
});

// Update customer by Polar customer ID (for webhooks)
export const updateByPolarCustomerId = mutation({
  args: {
    polarCustomerId: v.string(),
    membership: v.optional(v.union(v.literal("free"), v.literal("pro"))),
    polarSubscriptionId: v.optional(v.string()),
  },
  handler: async (
    ctx: any,
    args: {
      polarCustomerId: string;
      membership?: "free" | "pro";
      polarSubscriptionId?: string;
    }
  ) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_polarCustomerId", (q: any) =>
        q.eq("polarCustomerId", args.polarCustomerId)
      )
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.membership !== undefined) updates.membership = args.membership;
    if (args.polarSubscriptionId !== undefined)
      updates.polarSubscriptionId = args.polarSubscriptionId;

    await ctx.db.patch(customer._id, updates);
    return customer._id;
  },
});

// Create or update customer (upsert) - useful for webhooks
export const upsertByUserId = mutation({
  args: {
    userId: v.string(),
    membership: v.optional(v.union(v.literal("free"), v.literal("pro"))),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
  },
  handler: async (
    ctx: any,
    args: {
      userId: string;
      membership?: "free" | "pro";
      polarCustomerId?: string;
      polarSubscriptionId?: string;
    }
  ) => {
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existing) {
      const updates: Record<string, unknown> = {
        updatedAt: now,
      };

      if (args.membership !== undefined) updates.membership = args.membership;
      if (args.polarCustomerId !== undefined)
        updates.polarCustomerId = args.polarCustomerId;
      if (args.polarSubscriptionId !== undefined)
        updates.polarSubscriptionId = args.polarSubscriptionId;

      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      return await ctx.db.insert("customers", {
        userId: args.userId,
        membership: args.membership ?? "free",
        polarCustomerId: args.polarCustomerId,
        polarSubscriptionId: args.polarSubscriptionId,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
