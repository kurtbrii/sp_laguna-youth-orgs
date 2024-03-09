import { z } from 'zod';

// ! EVENTS
const createEventSchema = z.object({
  name: z.string().max(50, { message: "Event name must be at most 50 characters" }).min(5, { message: "Event name must be at least 5 characters" }),
  organizedBy: z.string(),
  details: z.string().max(500, { message: "Event details must be at most 500 characters" }).min(20, { message: "Event details must be at least 20 characters" }),
  location: z.string().min(5, { message: "Event must have a location" }),
  organizationId: z.string(),
  date: z.string().min(1, { message: "Event must have a date" }),
  partners: z.array(z.string()).optional(),
  images: z.array(z.string()).optional()
})

const updateEventSchema = z.object({
  id: z.string(),
  name: z.string().max(50, { message: "Event name must be at most 50 characters" }).min(5, { message: "Event name must be at least 5 characters" }),
  organizedBy: z.string(),
  details: z.string().max(500, { message: "Event details must be at most 500 characters" }).min(20, { message: "Event details must be at least 20 characters" }),
  location: z.string().min(5, { message: "Event must have a location" }),
  organizationId: z.string(),
  date: z.string().min(1, { message: "Event must have a date" }),
  partners: z.array(z.string()).optional(),
  images: z.array(z.string()).optional()
})

export { createEventSchema, updateEventSchema }