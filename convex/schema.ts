import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  customers: defineTable({
    userId: v.string(), // Clerk user ID
    membership: v.union(v.literal("free"), v.literal("pro")),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_polarCustomerId", ["polarCustomerId"]),
});
