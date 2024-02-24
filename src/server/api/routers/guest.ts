import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Input } from "postcss";


export const guestRouter = createTRPCRouter({

  createGuest: publicProcedure
    .input(z.object({ activityId: z.string(), name: z.string(), sex: z.string(), age: z.number(), phoneNumber: z.string(), email: z.string(), subject: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createGuest = await ctx.db.guest.create({
        data: {
          name: input.name,
          sex: input.sex,
          age: input.age,
          phoneNumber: input.phoneNumber,
          email: input.email,
        },
      });

      const createActivityCall = await ctx.db.activityCall.create({
        data: {
          activityId: input.activityId,
          guestId: createGuest.id,
          subject: input.subject,
          body: input.body,
          status: 'PENDING',
          label: 'participant'
        }
      })

      return { createGuest, createActivityCall }
    }),

  getOne: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input: { email }, ctx }) => {
      const data = await ctx.db.guest.findUnique({
        where: {
          email
        },
        select: {
          name: true,
          sex: true,
          age: true,
          phoneNumber: true,
          email: true,
        }
      })


      return data;
    }),

  // ! TODO: NOT YET SURE
  getGuests: publicProcedure
    .input(z.object({ id: z.string().optional(), take: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const whereCondition = {
        id: input.id,
      }

      return ctx.db.organization.findMany({
        where: whereCondition,
        select: {
          id: true,
          orgName: true,
          phoneNumber: true,
          bio: true,
          userId: true,
          mission: true,
          vision: true,
          objectives: true,
          user: {
            select: {
              id: true,
              image: true,
              role: true,
              email: true
            }
          },
          event: {
            select: {
              name: true,
              id: true,
              organizedBy: true,
              details: true,
              location: true,
              date: true,
              partners: true,
            },
          }

        },
        take: input.take
      })


    }),

  updateVolunteer: protectedProcedure
    .input(z.object({ id: z.string(), phoneNumber: z.string(), bio: z.string(), sex: z.string(), age: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.volunteer.update({
        where: { id: input.id },
        data: {
          phoneNumber: input.phoneNumber,
          bio: input.bio,
          sex: input.sex,
          age: input.age
        },
      });
    }),
});
