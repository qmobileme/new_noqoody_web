import { z } from "zod";

export const rsvpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+()\-\s\d]{6,30}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  event: z.string().trim().min(1, "Choose an event").max(160),
  guests: z.string().trim().min(1, "Select how many will attend").max(20),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
  /** Honeypot — real users never see or fill this field. */
  website: z.string().max(200).optional().or(z.literal("")),
  /** Milliseconds the visitor spent on the form before submitting. */
  elapsedMs: z.number().int().nonnegative().max(86_400_000).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
