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
    .input(z.object({ name: z.string(), date: z.string(), details: z.string(), hasOrganizations: z.boolean(), hasVolunteers: z.boolean(), hasParticipants: z.boolean(), location: z.string() }))
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
        }
      });
    }),

  getEvents: publicProcedure
    .query(async ({ ctx, input }) => {
      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.event.findMany({
        orderBy: {
          createdAt: "desc",
        },
        // where: whereCondition,
        select: {
          id: true,
          name: true,
          location: true,
          organizedBy: true,
          details: true,
          createdAt: true,
          organizationId: true,
          date: true,
          partners: true,
          organization: {
            select: {
              user: true
            }
          }
        }
        // include: {
        //   organization: true,
        // }
      });
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const data = await ctx.db.event.findUnique({
        where: { id },
        select: {
          organization: {
            select: {
              user: {
                select: {
                  id: true,
                  image: true
                }
              },
            },
          },
          name: true,
          id: true,
          organizedBy: true,
          details: true,
          location: true,
          date: true,
          partners: true,
        }
      });
      return data;
    })


});
