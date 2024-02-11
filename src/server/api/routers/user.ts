import { z } from "zod";
import { ROLE } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const userRouter = createTRPCRouter({

  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {

      const userWithOrganization = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          image: true,
          role: true,
          organization: {
            select: {
              id: true,
              phoneNumber: true,
              bio: true,
              mission: true,
              vision: true,
              objectives: true,
              orgName: true,
              centersOfParticipation: true,
            }
          },
          volunteer: true
        },
      });

      return userWithOrganization

    }),

  updateUserRole: publicProcedure
    .input(z.object({ userId: z.string(), role: z.nativeEnum(ROLE) }))
    .mutation(async ({ ctx, input }) => {
      const updateUserRole = await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          role: input.role
        }
      })

      return updateUserRole;
    })

});
