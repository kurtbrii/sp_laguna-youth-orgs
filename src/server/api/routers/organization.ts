import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// eslint-disable-next-line react-hooks/rules-of-hooks



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
          userId: input.userId
        },
      });
    }),

});
