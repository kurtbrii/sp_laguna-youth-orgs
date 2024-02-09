import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { triggerAsyncId } from "async_hooks";


export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(z.object({ name: z.string(), organizedBy: z.string(), details: z.string(), location: z.string(), organizationId: z.string(), date: z.string(), partners: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.event.create({
        data: {
          name: input.name,
          organizedBy: input.organizedBy,
          createdAt: new Date(),
          details: input.details,
          location: input.location,
          organizationId: input.organizationId,
          date: new Date(input.date),
          partners: input.partners
        },
      });
    }),

  getEvents: publicProcedure
    .input(z.object({ take: z.number().optional(), orgId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.event.findMany({
        where: {
          organizationId: input.orgId
        },
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
        },
        take: input.take
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
          createdAt: true,
        }
      });
      return data;
    }),

  updateEvent: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), organizedBy: z.string(), details: z.string(), location: z.string(), organizationId: z.string(), date: z.string(), partners: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.event.update({
        where: { id: input.id },
        data: {
          name: input.name,
          organizedBy: input.organizedBy,
          createdAt: new Date(),
          details: input.details,
          location: input.location,
          organizationId: input.organizationId,
          date: new Date(input.date),
          partners: input.partners
        },
      });
    }),

});
