/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { createEventSchema, updateEventSchema } from "~/utils/schemaValidation";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.create({
        data: {
          name: input.name,
          organizedBy: input.organizedBy,
          createdAt: new Date(),
          details: input.details,
          location: input.location,
          organizationId: input.organizationId,
          date: new Date(input.date),
          partners: input.partners,
          images: input.images,
          archived: false
        },
      })
    }),

  getEvents: publicProcedure
    .input(z.object({ take: z.number().optional(), orgId: z.string().optional(), search: z.string().optional(), archived: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.event.findMany({
        where: {
          organizationId: input.orgId,
          archived: input.archived,
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
              organizedBy: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
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
          images: true,
          archived: true,
          organization: {
            select: {
              orgName: true,
              user: true
            }
          }
        },
        take: input.take
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
              orgName: true,
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
          images: true,
          date: true,
          partners: true,
          createdAt: true,
          archived: true,
        }
      });
      return data;
    }),

  updateEvent: protectedProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input }) => {
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
          partners: input.partners,
          images: input.images
        },
      });
    }),

  archiveEvent: protectedProcedure
    .input(z.object({ id: z.string(), archived: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.update({
        where: { id: input.id },
        data: {
          archived: input.archived
        },
      });
    }),


  deleteEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.delete({
        where: {
          id: input.id
        }
      })
    }),

});
