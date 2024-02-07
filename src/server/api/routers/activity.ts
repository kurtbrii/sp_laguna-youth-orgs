import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { triggerAsyncId } from "async_hooks";


export const activityRouter = createTRPCRouter({
  createActivity: protectedProcedure
    .input(z.object({ name: z.string(), date: z.string(), details: z.string(), hasOrganizations: z.boolean(), hasVolunteers: z.boolean(), hasParticipants: z.boolean(), location: z.string(), organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.create({
        data: {
          name: input.name,
          createdAt: new Date(),
          date: new Date(input.date),
          details: input.details,
          location: input.location,

          hasOrganizations: input.hasOrganizations,
          hasVolunteers: input.hasVolunteers,
          hasParticipants: input.hasParticipants,
          organizationId: input.organizationId
        }
      });
    }),

  getActivities: publicProcedure
    .query(async ({ ctx, input }) => {

      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.activity.findMany({
        orderBy: {
          createdAt: "desc",
        },
        // where: whereCondition,
        select: {
          id: true,
          name: true,
          details: true,
          date: true,
          createdAt: true,
          location: true,
          hasOrganizations: true,
          hasVolunteers: true,
          hasParticipants: true,
          organizationId: true,
          organization: {
            select: {
              user: true
            }
          }
        }
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
              orgName: true,
              user: {
                select: {
                  id: true,
                  image: true
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

          hasOrganizations: true,
          hasVolunteers: true,
          hasParticipants: true,
          organizationId: true,
        }
      });
      return data;
    })


});
