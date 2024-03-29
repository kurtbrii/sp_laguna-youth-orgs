import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createActivitySchema, updateActivitySchema } from "~/utils/schemaValidation";

export const activityRouter = createTRPCRouter({
  createActivity: protectedProcedure
    .input(createActivitySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.create({
        data: {
          name: input.name,
          createdAt: new Date(),
          date: new Date(input.date),
          details: input.details,
          location: input.location,
          images: input.images,

          hasOrganizations: input.hasOrganizations,
          hasVolunteers: input.hasVolunteers,
          hasParticipants: input.hasParticipants,
          organizationId: input.organizationId,
          centersTags: input.centersTags,
          // customTags: input.customTags,
        }
      });
    }),

  updateActivity: protectedProcedure
    .input(updateActivitySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.update({
        where: { id: input.id },
        data: {
          name: input.name,
          createdAt: new Date(),
          date: new Date(input.date),
          details: input.details,
          location: input.location,
          images: input.images,

          hasOrganizations: input.hasOrganizations,
          hasVolunteers: input.hasVolunteers,
          hasParticipants: input.hasParticipants,
          organizationId: input.organizationId,
          centersTags: input.centersTags
        }
      });
    }),

  getActivities: publicProcedure
    .input(z.object({ take: z.number().optional(), orgId: z.string().optional(), search: z.string().optional() }))
    .query(async ({ ctx, input }) => {

      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.activity.findMany({
        where: {
          organizationId: input.orgId,
          OR: [
            {
              name: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
            {
              location: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
            {
              organization: {
                orgName: {
                  contains: input.search,
                  mode: 'insensitive',
                },
              }
            }
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          details: true,
          date: true,
          createdAt: true,
          location: true,
          images: true,
          hasOrganizations: true,
          hasVolunteers: true,
          hasParticipants: true,
          organizationId: true,
          centersTags: true,
          customTags: true,
          organization: {
            select: {
              orgName: true,
              user: {
                select: {
                  image: true,
                  id: true,
                }
              }
            }
          }
        },
        take: input.take
      });
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const data = await ctx.db.activity.findUnique({
        where: { id },
        select: {
          organization: {
            select: {
              id: true,
              orgName: true,
              user: {
                select: {
                  id: true,
                  image: true,
                  email: true,
                }
              },
            },
          },
          id: true,
          name: true,
          details: true,
          date: true,
          createdAt: true,
          location: true,
          images: true,

          hasOrganizations: true,
          hasVolunteers: true,
          hasParticipants: true,
          organizationId: true,
          centersTags: true,
        },

      });
      return data;
    }),



  deleteActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.delete({
        where: {
          id: input.id
        }
      })
    })



});
