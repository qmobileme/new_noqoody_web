import { z } from "zod";
import type { OrderStatus } from "./order-status";

export const trackingInput = z.object({
  reference: z.string().trim().min(4).max(32),
  email: z.string().trim().email().max(255),
});

export type TrackedOrder = {
  reference: string;
  status: OrderStatus;
  businessName: string;
  contactName: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  items: { name: string; quantity: number }[];
};
