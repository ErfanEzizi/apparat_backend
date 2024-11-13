import { z } from 'zod';

// Schema for creating a new job
export const CreateJobSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  locationName: z.string().min(1, "Location name is required"),
  status: z.enum(["pending", "accepted", "completed", "cancelled"]).optional(),
  clientId: z.string().uuid(),
  creatorId: z.string().uuid(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Schema for updating an existing job
export const UpdateJobSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
  locationName: z.string().min(1).optional(),
  status: z.enum(["pending", "accepted", "completed", "cancelled"]).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type CreateJobType = z.infer<typeof CreateJobSchema>;
export type UpdateJobType = z.infer<typeof UpdateJobSchema>;
