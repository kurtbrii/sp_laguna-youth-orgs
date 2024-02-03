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

});
