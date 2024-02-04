import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// eslint-disable-next-line react-hooks/rules-of-hooks

const loremText = "(replace with your data...) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in tortor urna. Fusce in ante at purus rhoncus auctor. In tincidunt ipsum vel tortor malesuada, et tincidunt tellus tempus. Vivamus a posuere ipsum. Sed convallis odio non sagittis lacinia. Nullam mattis tincidunt felis ac vehicula."

export const orgRouter = createTRPCRouter({

  createOrganization: publicProcedure
    .input(z.object({ orgName: z.string(), phoneNumber: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.organization.create({
        data: {
          orgName: input.orgName,
          phoneNumber: input.phoneNumber,
          userId: input.userId,
          mission: loremText,
          vision: loremText,
          objectives: loremText,

        },
      });
    }),

  getOrganizations: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const whereCondition = input.id ? { id: input.id } : {};

      return ctx.db.organization.findMany({
        where: whereCondition,
        include: {
          user: true,
        }
      });
    }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const data = await ctx.db.organization.findUnique({
        where: { id },
        include: {
          user: true,
          event: true,
        }
      })
      return data;
    })
});
