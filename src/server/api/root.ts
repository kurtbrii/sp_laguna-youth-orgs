import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { orgRouter } from "./routers/organization";
import { volunteerRouter } from "./routers/volunteer";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  organization: orgRouter,
  volunteer: volunteerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
