import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const guestRouter = createTRPCRouter({

  createGuest: publicProcedure
    .input(z.object({ name: z.string(), sex: z.string(), age: z.number(), phoneNumber: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.guest.create({
        data: {
          name: input.name,
          sex: input.sex,
          age: input.age,
          phoneNumber: input.phoneNumber,
          email: input.email

        },
      });
    }),

  // id            String @id @default(cuid())
  // firstName     String
  // lastName      String
  // middleInitial String
  // suffix        String
  // phoneNumber   String
  // bio           String

  // user   User?   @relation(fields: [userId], references: [id])
  // userId String? @unique

  getOne: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), sex: z.string(), age: z.number(), phoneNumber: z.string(), email: z.string() }))
    .query(async ({ input: { id, email }, ctx }) => {
      const data = await ctx.db.guest.findUnique({
        where: {
          id,
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
