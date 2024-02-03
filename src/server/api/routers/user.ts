import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

interface Organization {
  id: string;

}

export const userRouter = createTRPCRouter({

  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {

      const userWithOrganization = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          organization: {
            select: {
              orgName: true,
              phoneNumber: true,
            },
          },
        },
      });

      return userWithOrganization

    }),

});
