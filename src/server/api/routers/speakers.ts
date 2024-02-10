import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const speakerRouter = createTRPCRouter({
  createSpeaker: protectedProcedure
    .input(z.object({ name: z.string(), bio: z.string(), age: z.number(), orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.speakers.create({
        data: {
          name: input.name,
          age: input.age,
          bio: input.bio,
          organizationId: input.orgId,
          createdAt: new Date(),
        }
      });
    }),

  updateSpeaker: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), bio: z.string(), age: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.speakers.update({
        where: { id: input.id },
        data: {
          name: input.name,
          age: input.age,
          bio: input.bio,
        }
      });
    }),


  getSpeaker: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {

      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.speakers.findUnique({
        where: { id },
        select: {
          name: true,
          age: true,
          bio: true,
          organizationId: true,
        },
      });
    }),

  getSpeakers: publicProcedure
    .input(z.object({ take: z.number().optional(), orgId: z.string().optional() }))
    .query(async ({ ctx, input }) => {

      // const whereCondition = input.id ? { id: input.id } : {};
      return ctx.db.speakers.findMany({
        where: {
          organizationId: input.orgId
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          organization: {
            select: {
              user: true
            }
          },
        },
        take: input.take
      });
    }),




});
