import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { updateVolunteerSchema, createVolSchema } from "~/utils/schemaValidation";

export const volunteerRouter = createTRPCRouter({

  createVolunteer: publicProcedure
    .input(createVolSchema)
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
          userId: input.userId,
          email: input.email
        },
      });
    }),

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
          customTags: true,
          centersTags: true,
          setTags: true,
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
    .input(updateVolunteerSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.volunteer.update({
        where: { id: input.id },
        data: {
          phoneNumber: input.phoneNumber,
          bio: input.bio,
          sex: input.sex,
          age: input.age,
          centersTags: input.centersTags,
          customTags: input.customTags,
          setTags: input.setTags
        },
      });
    }),
});
