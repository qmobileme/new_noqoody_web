import { z } from "zod";

export const contactSchema = z.object({
  formType: z.literal("contact"),
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+()\-\s\d]{6,30}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(1000),
});

export const applySchema = z.object({
  formType: z.literal("apply"),
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\-\s\d]{6,30}$/, "Enter a valid phone number"),
  company: z.string().trim().min(2, "Enter your registered business name").max(120),
  industry: z.string().trim().min(1, "Select an industry").max(80),
  monthlyVolume: z.string().trim().min(1, "Select an expected volume").max(80),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  formType: z.literal("newsletter"),
  fullName: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(255),
});

export const leadSchema = z.discriminatedUnion("formType", [
  contactSchema,
  applySchema,
  newsletterSchema,
]);

export type ContactInput = z.infer<typeof contactSchema>;
export type ApplyInput = z.infer<typeof applySchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type LeadInput = z.infer<typeof leadSchema>;

export const INDUSTRIES = [
  "E-commerce",
  "Retail / storefront",
  "Food & beverage",
  "Travel & hospitality",
  "Education",
  "Healthcare",
  "Digital content",
  "Other",
];

export const VOLUMES = [
  "Under QAR 50,000",
  "QAR 50,000 – 250,000",
  "QAR 250,000 – 1M",
  "Over QAR 1M",
];