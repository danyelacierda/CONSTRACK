import { z } from "zod";
import { FUEL_TYPES } from "@/types/enums";

export const fuelRequestCreateSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  projectId: z.string().min(1, "Project is required"),
  fuelType: z.enum(FUEL_TYPES),
  requestedLiters: z.number().positive("Liters must be greater than zero").max(2000, "Exceeds plausible request size"),
  purpose: z.string().min(3, "Purpose description must be at least 3 characters"),
});

export type FuelRequestCreateInput = z.infer<typeof fuelRequestCreateSchema>;

export const fuelTransactionCreateSchema = z.object({
  fuelRequestId: z.string().min(1, "Fuel request reference is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  projectId: z.string().min(1, "Project is required"),
  fuelType: z.enum(FUEL_TYPES),
  liters: z.number().positive("Liters must be greater than zero"),
  pricePerLiterPhp: z.number().positive("Price per liter must be greater than zero"),
  station: z.string().min(2, "Station name is required"),
  receiptNumber: z.string().optional().nullable(),
  receiptImageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  odometerAtFillKm: z.number().nonnegative("Odometer reading must be non-negative"),
  transactionDate: z.string().min(1, "Transaction date is required"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  notes: z.string().default(""),
});

export type FuelTransactionCreateInput = z.infer<typeof fuelTransactionCreateSchema>;

export const receiptVerificationSchema = z.object({
  fuelTransactionId: z.string().min(1, "Transaction is required"),
  verifiedLiters: z.number().positive("Verified liters must be positive"),
  verifiedTotalCostPhp: z.number().positive("Verified total cost must be positive"),
  receiptNumber: z.string().min(1, "Receipt number is required"),
  notes: z.string().optional(),
});

export type ReceiptVerificationInput = z.infer<typeof receiptVerificationSchema>;
