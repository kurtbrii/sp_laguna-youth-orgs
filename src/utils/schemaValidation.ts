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

// ! ACTIVITIES
const createActivitySchema = z.object({
  name: z.string().max(50, { message: "Activity name must be at most 50 characters" }).min(5, { message: "Event name must be at least 5 characters" }),
  date: z.string().min(1, { message: "Activity must have a date" }),
  details: z.string().max(500, { message: "Activity details must be at most 500 characters" }).min(20, { message: "Event details must be at least 20 characters" }),
  hasOrganizations: z.boolean(),
  hasVolunteers: z.boolean(),
  hasParticipants: z.boolean(),
  location: z.string().min(5, { message: "Activity must have a location" }),
  organizationId: z.string(),
  images: z.array(z.string()).optional(),
})

export { createEventSchema, updateEventSchema, createActivitySchema }