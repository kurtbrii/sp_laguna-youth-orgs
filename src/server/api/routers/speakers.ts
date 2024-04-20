import { z } from "zod";
import { createSpeakerSchema, editSpeakerSchema } from "~/utils/schemaValidation";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const speakerRouter = createTRPCRouter({
  createSpeaker: protectedProcedure
    .input(createSpeakerSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.speakers.create({
        data: {
          name: input.name,
          age: input.age,
          email: input.email,
          bio: input.bio,
          organizationId: input.orgId,
          createdAt: new Date(),
        }
      });
    }),

  updateSpeaker: protectedProcedure
    .input(editSpeakerSchema)
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
      return ctx.db.speakers.findUnique({
        where: { id },
        select: {
          name: true,
          age: true,
          bio: true,
          organizationId: true,
          email: true
        },
      });
    }),

  getSpeakers: publicProcedure
    .input(z.object({ take: z.number().optional(), orgId: z.string().optional(), search: z.string().optional() }))
    .query(async ({ ctx, input }) => {

      return ctx.db.speakers.findMany({
        where: {
          organizationId: input.orgId,
          OR: [
            {
              name: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          ]
        },
        // orderBy: {
        //   createdAt: "desc",
        // },
        include: {
          organization: {
            select: {
              orgName: true,
              user: true,
              email: true
            }
          },
        },
        take: input.take
      });
    }),

  deleteSpeaker: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.speakers.delete({
        where: {
          id: input.id
        }
      })
    })



});
