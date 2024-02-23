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
    .input(z.object({ activityId: z.string(), orgId: z.string().optional(), volId: z.string().optional(), subject: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activityCall.create({
        data: {
          organizationId: input.orgId,
          volunteerId: input.volId,
          activityId: input.activityId,
          status: "PENDING",
          subject: input.subject,
          body: input.body,
        },
      });
    }),


  getOrgOrVol: protectedProcedure
    .input(z.object({ activityId: z.string().optional(), orgId: z.string().optional(), volId: z.string().optional(), status: z.string().optional(), }))
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
          activity: {
            select: {
              id: true,
              date: true,
              name: true,
              details: true,
              location: true,
              organization: {
                select: {
                  id: true,
                  orgName: true,
                  phoneNumber: true,
                  bio: true,
                  user: true,
                }
              },
            }
          },
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
              suffix: true,
              middleInitial: true,
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

  updateActivityCall: protectedProcedure
    .input(z.object({ activityId: z.string(), orgId: z.string().optional(), volId: z.string().optional(), }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activityCall.updateMany({
        where: { activityId: input.activityId, organizationId: input.orgId, volunteerId: input.volId },
        data: {
          status: 'APPROVED',
        },
      });
    }),

  deleteVolJoinOrg: protectedProcedure
    .input(z.object({ activityId: z.string(), orgId: z.string().optional(), volId: z.string().optional(), }))
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.activityCall.deleteMany({
        where: {
          activityId: input.activityId, volunteerId: input.volId, organizationId: input.orgId
        },

      });

      return data;
    }),
});
