import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { triggerAsyncId } from "async_hooks";


export const activityCallRouter = createTRPCRouter({
  createJoinActivity: publicProcedure
    .input(z.object({ activityId: z.string(), orgId: z.string().optional(), volId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activityCall.create({
        data: {
          organizationId: input.orgId,
          volunteerId: input.volId,
          activityId: input.activityId,
          status: "PENDING"
        },
      });
    }),


  getOrgOrVol: protectedProcedure
    .input(z.object({ activityId: z.string(), orgId: z.string().optional(), volId: z.string().optional(), status: z.string().optional(), }))
    .query(async ({ input, ctx }) => {

      const data = await ctx.db.activityCall.findMany({
        where: {
          AND: [
            { activityId: input.activityId },
            { volunteerId: input.volId },
            { organizationId: input.orgId },
            { status: input.status }
          ]
        },
        select: {
          organizationId: true,
          status: true,
          organization: {
            select: {
              id: true,
              orgName: true,
              phoneNumber: true,
              bio: true,
              user: true,
            }
          },
          volunteerId: true,
          volunteer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              bio: true,
              sex: true,
              age: true,
              user: true,
            }
          },
        }
      });

      return data;
    }),

  updateVolJoinOrg: protectedProcedure
    .input(z.object({ orgId: z.string(), volId: z.string(), }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.volJoinOrg.updateMany({
        where: { organizationId: input.orgId, volunteerId: input.volId },
        data: {
          status: 'APPROVED',
        },
      });
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
