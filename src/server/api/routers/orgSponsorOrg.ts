import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const orgSponsorOrgRouter = createTRPCRouter({
  createOrgSponOrg: protectedProcedure
    .input(z.object({ orgRequesting: z.string(), orgAccepting: z.string(), body: z.string(), subject: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.orgSponsorOrg.create({
        data: {
          organizationIdRequesting: input.orgRequesting,
          organizationIdAccepting: input.orgAccepting,
          status: 'PENDING',
          subject: input.subject,
          body: input.body
        },
      });
    }),

  getBothOrganizations: protectedProcedure
    .input(z.object({ orgRequesting: z.string().optional(), orgAccepting: z.string().optional(), status: z.string().optional(), }))
    .query(async ({ input, ctx }) => {

      const data = await ctx.db.orgSponsorOrg.findMany({
        where: {
          AND: [
            { organizationIdRequesting: input.orgRequesting },
            { organizationIdAccepting: input.orgAccepting },
            { status: input.status }
          ]
        },
        select: {
          subject: true,
          body: true,
          status: true,
          organizationRequesting: {
            select: {
              id: true,
              orgName: true,
              phoneNumber: true,
              bio: true,
              user: true,
            }
          },
          organizationAccepting: {
            select: {
              id: true,
              orgName: true,
              phoneNumber: true,
              bio: true,
              user: true,
            }
          }
        }
      });

      return data;
    }),

  updateOrgSpon: protectedProcedure
    .input(z.object({ orgRequesting: z.string(), orgAccepting: z.string(), }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.orgSponsorOrg.updateMany({
        where: { organizationIdRequesting: input.orgRequesting, organizationIdAccepting: input.orgAccepting },
        data: {
          status: 'APPROVED',
        },
      });
    }),

  deleteOrgSpon: publicProcedure
    .input(z.object({ orgRequesting: z.string(), orgAccepting: z.string(), }))
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.orgSponsorOrg.deleteMany({
        where: {
          organizationIdAccepting: input.orgAccepting, organizationIdRequesting: input.orgRequesting
        },

      });

      return data;
    }),
});
