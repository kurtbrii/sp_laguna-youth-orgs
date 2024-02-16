import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { triggerAsyncId } from "async_hooks";


export const orgSponsorOrgRouter = createTRPCRouter({
  createVolJoinOrg: publicProcedure
    .input(z.object({ orgId: z.string(), volId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.volJoinOrg.create({
        data: {
          organizationId: input.orgId,
          volunteerId: input.volId
        },
      });
    }),

  checkIfOrganizationExists: publicProcedure
    .input(z.object({ orgId: z.string(), volId: z.string(), }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.volJoinOrg.findMany({
        where: {
          AND: [
            { volunteerId: input.volId }, { organizationId: input.orgId }
          ]
        },
        select: {
          organizationId: true,
          status: true,
        }
      });

      return data;
    }),

  deleteVolJoinOrg: publicProcedure
    .input(z.object({ orgId: z.string(), volId: z.string(), }))
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.volJoinOrg.deleteMany({
        where: {
          volunteerId: input.volId, organizationId: input.orgId
        },

      });

      return data;
    }),
});
