import { z } from "zod";
import { VEHICLE_STATUSES, VEHICLE_TYPES, FUEL_TYPES } from "@/types/enums";

/**
 * Pure helper function to check whether an odometer update represents an invalid decrease.
 * Returns true if the new odometer is below previous without a designated correction flag.
 */
export function isOdometerDecrease(
  previousKm: number,
  newKm: number,
  isCorrection = false
): boolean {
  if (isCorrection) return false;
  return newKm < previousKm;
}

export const odometerUpdateSchema = z
  .object({
    previousOdometerKm: z.number().nonnegative(),
    newOdometerKm: z.number().nonnegative("Odometer must be non-negative"),
    isCorrection: z.boolean().default(false),
    reason: z.string().optional(),
  })
  .refine(
    (data) => !isOdometerDecrease(data.previousOdometerKm, data.newOdometerKm, data.isCorrection),
    {
      message: "New odometer reading cannot be less than previous reading without flagging as a calibration/correction.",
      path: ["newOdometerKm"],
    }
  );

export type OdometerUpdateInput = z.infer<typeof odometerUpdateSchema>;

export const vehicleCreateSchema = z.object({
  plateNumber: z.string().min(3, "Plate number is required (min 3 chars)").max(12),
  name: z.string().min(2, "Name/identifier is required"),
  type: z.enum(VEHICLE_TYPES),
  status: z.enum(VEHICLE_STATUSES).default("Idle"),
  fuelType: z.enum(FUEL_TYPES),
  tankCapacityLiters: z.number().positive("Tank capacity must be greater than 0"),
  currentFuelLiters: z.number().nonnegative("Fuel liters must be non-negative"),
  odometerKm: z.number().nonnegative("Odometer must be non-negative"),
  engineHours: z.number().nonnegative().default(0),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1970).max(new Date().getFullYear() + 1),
  currentProjectId: z.string().nullable().optional(),
  currentDriverId: z.string().nullable().optional(),
});

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
