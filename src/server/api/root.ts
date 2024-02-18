import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

import { orgRouter } from "./routers/organization";
import { volunteerRouter } from "./routers/volunteer";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { activityRouter } from "./routers/activity";
import { speakerRouter } from "./routers/speakers";
import { participationRouter } from "./routers/participation";
import { volJoinOrgRouter } from "./routers/volJoinOrg";
import { orgSponsorOrgRouter } from "./routers/orgSponsorOrg";
import { activityCallRouter as activityCallRouter } from "./routers/joinActivity";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  volJoinOrg: volJoinOrgRouter,
  post: postRouter,
  user: userRouter,
  organization: orgRouter,
  event: eventRouter,
  volunteer: volunteerRouter,
  activity: activityRouter,
  speaker: speakerRouter,
  particpation: participationRouter,
  orgSponsorOrg: orgSponsorOrgRouter,
  activityCall: activityCallRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
