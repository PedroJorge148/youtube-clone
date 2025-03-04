import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().optional(),
  DATABASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
