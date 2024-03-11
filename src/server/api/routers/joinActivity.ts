import { z } from "zod";
import { createJoinActivitySchema } from "~/utils/schemaValidation";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const activityCallRouter = createTRPCRouter({
  createJoinActivity: publicProcedure
    .input(createJoinActivitySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activityCall.create({
        data: {
          organizationId: input.orgId,
          volunteerId: input.volId,
          activityId: input.activityId,
          guestId: input.guestID,
          status: "PENDING",
          subject: input.subject,
          body: input.body,
          label: input.label
        },
      });
    }),


  getOrgOrVol: protectedProcedure
    .input(z.object({ activityId: z.string().optional(), orgId: z.string().optional(), volId: z.string().optional(), status: z.string().optional(), label: z.string().optional() }))
    .query(async ({ input, ctx }) => {

      const data = await ctx.db.activityCall.findMany({
        where: {
          AND: [
            { activityId: input.activityId },
            { volunteerId: input.volId },
            { organizationId: input.orgId },
            { status: input.status },
            { label: input.label }
          ]
        },
        select: {
          body: true,
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
          guestId: true,
          guest: {
            select: {
              id: true,
              name: true,
              age: true,
              email: true,
              phoneNumber: true,
              sex: true,
            }
          }
        }
      });

      return data;
    }),

  updateActivityCall: protectedProcedure
    .input(z.object({ activityId: z.string(), orgId: z.string().optional(), volId: z.string().optional(), guestId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activityCall.updateMany({
        where: { activityId: input.activityId, organizationId: input.orgId, volunteerId: input.volId, guestId: input.guestId },
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
