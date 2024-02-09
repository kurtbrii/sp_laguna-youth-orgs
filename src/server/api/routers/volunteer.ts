import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// eslint-disable-next-line react-hooks/rules-of-hooks



export const volunteerRouter = createTRPCRouter({

  createVolunteer: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string(), middleInitial: z.string(), suffix: z.string(), phoneNumber: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.volunteer.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          middleInitial: input.middleInitial,
          suffix: input.suffix,
          phoneNumber: input.phoneNumber,
          userId: input.userId
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
    .input(z.object({ id: z.string().optional(), userId: z.string().optional() }))
    .query(async ({ input: { id, userId }, ctx }) => {
      const data = await ctx.db.volunteer.findUnique({
        where: {
          userId,
          id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleInitial: true,
          suffix: true,
          phoneNumber: true,
          bio: true,
          userId: true,
          user: {
            select: {
              id: true,
              image: true,
              role: true,
              email: true
            }
          },
        }
        // include: {
        // }
      })
      return data;
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
