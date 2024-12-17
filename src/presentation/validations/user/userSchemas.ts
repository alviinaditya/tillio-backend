import { z } from "zod";

// Constants for regex patterns
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const VERIFICATION_CODE_REGEX = /^[0-9a-fA-F]{24}$/;

// Schemas
export const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters long.")
  .max(20, "Username must be at most 20 characters long.")
  .regex(USERNAME_REGEX, "Username can only contain letters and numbers");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .max(100);

export const userAgentSchema = z.string().optional();

export const verificationCodeSchema = z
  .string()
  .regex(VERIFICATION_CODE_REGEX, "Invalid verification code")
  .length(24, "Verification code must be exactly 24 characters.");

export const emailSchema = z.string().email("Invalid email address.");

// Combined Schemas
export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string(),
  userAgent: userAgentSchema,
});

export const registerSchema = loginSchema.extend({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resendVerificationEmailSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  code: verificationCodeSchema,
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
  logoutOtherSessions: z.boolean().default(false),
});

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters long.")
    .optional(),
  avatar: z.string().optional(),
});
