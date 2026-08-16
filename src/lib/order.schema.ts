import { z } from "zod";
import { ABSOLUTE_MAX_QUANTITY, VOLUME_OPTIONS } from "./order-devices";

export const orderSchema = z.object({
  existingMerchant: z.boolean(),
  businessName: z.string().trim().min(2, "Business name must be at least 2 characters.").max(100),
  contactName: z.string().trim().min(2, "Contact name must be at least 2 characters.").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address, e.g. name@company.com.")
    .max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number with at least 7 digits.")
    .max(20)
    .regex(/^[+]?[0-9\s()-]+$/, "Phone number can only contain digits, spaces, +, -, and ()."),
  monthlyVolume: z
    .string()
    .refine(
      (v) => (VOLUME_OPTIONS as readonly string[]).includes(v),
      "Select your monthly transaction volume.",
    ),
  acceptedTerms: z.boolean().refine((v) => v, "You must accept the Terms of Use & Privacy Policy."),
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1, "Unknown device selected.").max(60),
        quantity: z.number().int().min(1).max(ABSOLUTE_MAX_QUANTITY),
      }),
    )
    .min(1, "Select at least one device before submitting.")
    .max(30),
  // Honeypot: must stay empty.
  company_website: z.string().max(0).optional().default(""),
});

export type OrderInput = z.infer<typeof orderSchema>;
