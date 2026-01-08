import { Checkout } from "@polar-sh/nextjs";

// Support Railway, Vercel, or custom app URL
const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null);

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: baseUrl
    ? `${baseUrl}/dashboard?checkout=success`
    : "/dashboard?checkout=success",
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
