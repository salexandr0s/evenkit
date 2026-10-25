import { z } from "zod";

const email = z.email().max(254);
const password = z.string().min(1).max(1024);
const newPassword = z.string().min(12).max(128);
const returnTo = z.string().max(2048).optional();
export const authRequestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("login"), email, password, returnTo }),
  z.object({ action: z.literal("signup"), email, password: newPassword, returnTo }),
  z.object({ action: z.literal("request-reset"), email, returnTo }),
  z.object({ action: z.literal("update-password"), password: newPassword, returnTo }),
]);
export type AuthRequest = z.infer<typeof authRequestSchema>;
export const authResponseSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), message: z.string(), redirect: z.string().optional() }),
  z.object({ status: z.literal("error"), error: z.object({ message: z.string() }) }),
]);
export type AuthResponse = z.infer<typeof authResponseSchema>;
