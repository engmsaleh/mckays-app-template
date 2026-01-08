"use server"

import { api } from "@/convex/_generated/api"
import { currentUser } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export type Customer = {
  _id: string
  userId: string
  membership: "free" | "pro"
  polarCustomerId?: string
  polarSubscriptionId?: string
  createdAt: number
  updatedAt: number
}

export async function getCustomerByUserId(
  userId: string
): Promise<Customer | null> {
  const customer = await convex.query(api.customers.getByUserId, { userId })
  return customer as Customer | null
}

export async function getBillingDataByUserId(userId: string): Promise<{
  customer: Customer | null
  clerkEmail: string | null
  polarEmail: string | null
}> {
  // Get Clerk user data
  const user = await currentUser()

  // Get customer from Convex
  const customer = await convex.query(api.customers.getByUserId, { userId })

  // Get Polar email if it exists (using Clerk email for now)
  const polarEmail = customer?.polarCustomerId
    ? user?.emailAddresses[0]?.emailAddress || null
    : null

  return {
    customer: customer as Customer | null,
    clerkEmail: user?.emailAddresses[0]?.emailAddress || null,
    polarEmail
  }
}

export async function createCustomer(
  userId: string
): Promise<{ isSuccess: boolean; data?: Customer }> {
  try {
    const customerId = await convex.mutation(api.customers.create, {
      userId,
      membership: "free"
    })

    const customer = await convex.query(api.customers.getByUserId, { userId })

    if (!customer) {
      return { isSuccess: false }
    }

    return { isSuccess: true, data: customer as Customer }
  } catch (error) {
    console.error("Error creating customer:", error)
    return { isSuccess: false }
  }
}

export async function updateCustomerByUserId(
  userId: string,
  updates: Partial<Omit<Customer, "_id" | "userId" | "createdAt" | "updatedAt">>
): Promise<{ isSuccess: boolean; data?: Customer }> {
  try {
    await convex.mutation(api.customers.updateByUserId, {
      userId,
      ...updates
    })

    const customer = await convex.query(api.customers.getByUserId, { userId })

    if (!customer) {
      return { isSuccess: false }
    }

    return { isSuccess: true, data: customer as Customer }
  } catch (error) {
    console.error("Error updating customer by userId:", error)
    return { isSuccess: false }
  }
}

export async function updateCustomerByPolarCustomerId(
  polarCustomerId: string,
  updates: Partial<Omit<Customer, "_id" | "userId" | "createdAt" | "updatedAt">>
): Promise<{ isSuccess: boolean; data?: Customer }> {
  try {
    await convex.mutation(api.customers.updateByPolarCustomerId, {
      polarCustomerId,
      ...updates
    })

    const customer = await convex.query(api.customers.getByPolarCustomerId, {
      polarCustomerId
    })

    if (!customer) {
      return { isSuccess: false }
    }

    return { isSuccess: true, data: customer as Customer }
  } catch (error) {
    console.error("Error updating customer by polarCustomerId:", error)
    return { isSuccess: false }
  }
}
