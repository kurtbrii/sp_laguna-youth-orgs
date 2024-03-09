import { z } from 'zod';

const createEventSchema = z.object({
  name: z.string().max(30).min(5, { message: "Event name must be at least 5 characters!" }),
  organizedBy: z.string(),
  details: z.string(),
  location: z.string(),
  organizationId: z.string(),
  date: z.string(),
  partners: z.array(z.string()).optional(),
  images: z.array(z.string()).optional()
})

export { createEventSchema }