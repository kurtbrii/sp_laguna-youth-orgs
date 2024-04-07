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
  centersTags: z.array(z.string()).optional(),
  customTags: z.array(z.string()).optional()
})

const updateActivitySchema = z.object({
  id: z.string(),
  name: z.string().max(50, { message: "Activity name must be at most 50 characters" }).min(5, { message: "Event name must be at least 5 characters" }),
  date: z.string().min(1, { message: "Activity must have a date" }),
  details: z.string().max(500, { message: "Activity details must be at most 500 characters" }).min(20, { message: "Event details must be at least 20 characters" }),
  hasOrganizations: z.boolean(),
  hasVolunteers: z.boolean(),
  hasParticipants: z.boolean(),
  location: z.string().min(5, { message: "Activity must have a location" }),
  organizationId: z.string(),
  images: z.array(z.string()).optional(),
  centersTags: z.string().array().optional(),
  customTags: z.string().array().optional()
})


// ! PROFILE
const updateOrganizationSchema = z.object({
  id: z.string(),
  phoneNumber: z.string().length(11, { message: "Phone number should be written in the prescribed format" }),
  bio: z.string().refine((data) => data.trim().length > 0, { message: 'Bio is required', }),
  mission: z.string().refine((data) => data.trim().length > 0, { message: 'Mission is required', }),
  vision: z.string().refine((data) => data.trim().length > 0, { message: 'Vision is required', }),
  objectives: z.string().refine((data) => data.trim().length > 0, { message: 'Objectives is required', }),
  health: z.string().refine((data) => data.trim().length > 0, { message: 'Health is required', }),
  education: z.string().refine((data) => data.trim().length > 0, { message: 'Education is required', }),
  economicEmpowerment: z.string().refine((data) => data.trim().length > 0, { message: 'Economic Empowerment is required', }),
  socialInclusion: z.string().refine((data) => data.trim().length > 0, { message: 'Social Inclusion is required', }),
  peaceBuilding: z.string().refine((data) => data.trim().length > 0, { message: 'Peace Building is required', }),
  governance: z.string().refine((data) => data.trim().length > 0, { message: 'Governance is required', }),
  activeCitizenship: z.string().refine((data) => data.trim().length > 0, { message: 'Active Citizenship is required', }),
  environment: z.string().refine((data) => data.trim().length > 0, { message: 'Environment is required', }),
  globalMobility: z.string().refine((data) => data.trim().length > 0, { message: 'Global Mobility is required', }),
  agriculture: z.string().refine((data) => data.trim().length > 0, { message: 'Agriculture is required', }),
})


const updateVolunteerSchema = z.object({
  id: z.string(),
  phoneNumber: z.string().length(11, { message: "Phone number should be written in the prescribed format" }),
  bio: z.string().refine((data) => data.trim().length > 0, { message: 'Bio is required', }),
  sex: z.string().refine((data) => data.trim().length > 0, { message: 'Sex is required', }),
  age: z.coerce.number().refine((data) => data > 0, { message: 'Age is required', }),
  centersTags: z.array(z.string()).optional(),
  customTags: z.array(z.string()).optional(),
  setTags: z.boolean().optional()
})


// ! JOIN ACTIVITY
const createJoinActivitySchema = z.object({
  activityId: z.string(),
  orgId: z.string().optional(),
  volId: z.string().optional(),
  guestID: z.string().optional(),
  subject: z.string().max(30, { message: "Subject must be at most 30 characters" }).min(5, { message: "Subject must be at least 5 characters" }),
  body: z.string().max(200, { message: "Body must be at most 200 characters" }).min(10, { message: "Body must be at least 10 characters" }),
  label: z.string()
})

const createGuestSchema = z.object({
  activityId: z.string(),
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  sex: z.string().refine((data) => data.trim().length > 0, { message: 'Sex is required', }),
  age: z.coerce.number().refine((data) => data > 0, { message: 'Age is required', }),
  phoneNumber: z.string().length(11, { message: "Phone number should be written in the prescribed format" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().max(30, { message: "Subject must be at most 30 characters" }).min(5, { message: "Subject must be at least 5 characters" }),
  body: z.string().max(200, { message: "Body must be at most 200 characters" }).min(10, { message: "Body must be at least 10 characters" }),
})


// ! JOIN ORGANIZATION/REQUEST SPONSORSHIP EMAIL
const formSchema = z.object({
  subject: z.string().max(30, { message: "Subject must be at most 30 characters" }).min(5, { message: "Subject must be at least 5 characters" }),
  body: z.string().max(200, { message: "Body must be at most 200 characters" }).min(10, { message: "Body must be at least 10 characters" }),
});

// ! SPEAKERS
const createSpeakerSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  bio: z.string().refine((data) => data.trim().length > 0, { message: 'Bio is required', }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z.coerce.number().refine((data) => data > 0, { message: 'Age is required', }),
  orgId: z.string()
})

const editSpeakerSchema = z.object({
  id: z.string(),
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),
  bio: z.string().refine((data) => data.trim().length > 0, { message: 'Bio is required', }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z.coerce.number().refine((data) => data > 0, { message: 'Age is required', }),
  orgId: z.string()
})


// ! SIGN UP
const createOrgSchema = z.object({
  orgName: z.string().refine((data) => data.trim().length > 0, { message: 'Organization name is required', }),
  phoneNumber: z.string().length(11, { message: "Phone number should be written in the prescribed format" }),
  userId: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
})

const createVolSchema = z.object({
  firstName: z.string().refine((data) => data.trim().length > 0, { message: 'First name is required', }),
  lastName: z.string().refine((data) => data.trim().length > 0, { message: 'Last name is required', }),
  middleInitial: z.string().optional(),
  suffix: z.string().optional(),
  phoneNumber: z.string().length(11, { message: "Phone number should be written in the prescribed format" }),
  userId: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
})

export { createEventSchema, updateEventSchema, createActivitySchema, updateActivitySchema, updateOrganizationSchema, updateVolunteerSchema, createJoinActivitySchema, createGuestSchema, formSchema, createSpeakerSchema, editSpeakerSchema, createOrgSchema, createVolSchema }