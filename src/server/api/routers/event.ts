import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// eslint-disable-next-line react-hooks/rules-of-hooks

export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(z.object({ name: z.string(), organizedBy: z.string(), details: z.string(), location: z.string(), organizationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.event.create({
        data: {
          name: input.name,
          organizedBy: input.organizedBy,
          createdAt: new Date(),
          details: input.details,
          location: input.location,
          organizationId: input.organizationId,
        },
      });
    }),
});
