import { z } from "zod";

export const usernameSchema = z.string()
.min(3, "Username must be at least 3 characters long")
.max(20, "Username must be no longer than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const SignUpSchema = z.object({
  username: usernameSchema,
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
})
