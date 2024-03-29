import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const loremText = "(replace with your data...) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor urna. Fusce in ante at purus rhoncus auctor. In tincidunt ipsum vel tortor malesuada, et tincidunt tellus tempus. Vivamus a posuere ipsum. Sed convallis odio non sagittis lacinia. Nullam mattis tincidunt felis ac vehicula."

export const participationRouter = createTRPCRouter({
  createParticipation: protectedProcedure
    .input(z.object({
      health: z.string().optional(),
      education: z.string().optional(),
      economicEmpowerment: z.string().optional(),
      socialInclusion: z.string().optional(),
      peaceBuilding: z.string().optional(),
      governance: z.string().optional(),
      activeCitizenship: z.string().optional(),
      environment: z.string().optional(),
      globalMobility: z.string().optional(),
      agriculture: z.string().optional(),
      orgId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.centersOfParticipation.create({
        data: {
          health: loremText,
          education: loremText,
          economicEmpowerment: loremText,
          socialInclusion: loremText,
          peaceBuilding: loremText,
          governance: loremText,
          activeCitizenship: loremText,
          environment: loremText,
          globalMobility: loremText,
          agriculture: loremText,
          organizationId: input.orgId
        }
      });
    }),

  updateSpeaker: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), bio: z.string(), age: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.speakers.update({
        where: { id: input.id },
        data: {
          name: input.name,
          age: input.age,
          bio: input.bio,
        }
      });
    }),


  getSpeaker: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      return ctx.db.speakers.findUnique({
        where: { id },
        select: {
          name: true,
          age: true,
          bio: true,
          organizationId: true,
        },
      });
    }),




  getParticipations: publicProcedure
    .input(z.object({
      // health: z.boolean().optional(),
      // education: z.boolean().optional(),
      // economicEmpowerment: z.boolean().optional(),
      // socialInclusion: z.boolean().optional(),
      // peaceBuilding: z.boolean().optional(),
      // governance: z.boolean().optional(),
      // activeCitizenship: z.boolean().optional(),
      // environment: z.boolean().optional(),
      // globalMobility: z.boolean().optional(),
      // agriculture: z.boolean().optional(),
      orgId: z.string().optional(),
      search: z.string().optional()


    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.centersOfParticipation.findMany({
        where: {
          organizationId: input.orgId,
          OR: [
            {
              organization: {
                orgName: {
                  contains: input.search,
                  mode: 'insensitive',
                },
              }
            },
          ]
        },
        include: {
          organization: {
            select: {
              orgName: true,
              user: true
            }
          },
        },
      });
    }),




});
