import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { triggerAsyncId } from "async_hooks";
import { Input } from "postcss";


export const activityRouter = createTRPCRouter({
  createActivity: protectedProcedure
    .input(z.object({ name: z.string(), date: z.string(), details: z.string(), hasOrganizations: z.boolean(), hasVolunteers: z.boolean(), hasParticipants: z.boolean(), location: z.string(), organizationId: z.string(), images: z.array(z.string()) }))
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
          organizationId: input.organizationId
        }
      });
    }),

  getActivities: publicProcedure
    .input(z.object({ take: z.number().optional(), orgId: z.string().optional(), }))
    .query(async ({ ctx, input }) => {

      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.activity.findMany({
        where: {
          organizationId: input.orgId
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
        },

      });
      return data;
    }),

  updateActivity: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), date: z.string(), details: z.string(), hasOrganizations: z.boolean(), hasVolunteers: z.boolean(), hasParticipants: z.boolean(), location: z.string(), organizationId: z.string(), images: z.array(z.string()).optional() }))
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
          organizationId: input.organizationId
        }
      });
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
