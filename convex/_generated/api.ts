/* eslint-disable */
/**
 * Generated API stub - will be replaced by `npx convex dev`
 *
 * Run `npx convex dev` to generate the actual types.
 */

import { GenericId } from "convex/values";

// Stub types for API - these will be replaced by actual generated types
export const api = {
  customers: {
    getByUserId: {} as any,
    getByPolarCustomerId: {} as any,
    create: {} as any,
    updateByUserId: {} as any,
    updateByPolarCustomerId: {} as any,
    upsertByUserId: {} as any,
  },
} as const;

export type Id<T extends string> = GenericId<T>;
