// pages/homepage/organization/[id].js

import router, { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

import {
  LinearTextGradient,
  RadialTextGradient,
  ConicTextGradient,
} from "react-text-gradients-and-animations";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import OrgCard from "~/components/orgcard";
import { useEffect } from "react";
import EventCard from "~/components/eventCard";
import ActivitiesCard from "~/components/ActivitiesCard";

type OrganizationProps = {
  id: string;
  orgName: string;
  phoneNumber: string;
  mission: string;
  bio: string;
  vision: string;
  objectives: string;
  user: {
    id: string;
    role: string;
    image: string | null;
    email: string | null;
  };
  userId: string;
};

const OrganizationPage = () => {
  // const { id } = router.query;

  const { data: sessionData, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status when the component mounts
    if (sessionStatus === "unauthenticated") {
      // Redirect to /homepage if not authenticated
      void router.push("/homepage");
    }
  }, [router, sessionStatus]);

  // ! Organization Query
  const organizationsQuery = api.organization.getOne.useQuery({
    userId: sessionData?.user.id,
  });

  const organization = organizationsQuery.data;

  // ! Events Query
  const eventsQuery = api.event.getEvents.useQuery({
    take: 4,
    orgId: organization?.id,
  });

  const events = eventsQuery.data;

  // ! Activities Query
  const activitiesQuery = api.activity.getActivities.useQuery({
    take: 4,
    orgId: organization?.id,
  });

  const activities = activitiesQuery.data;

  // if (!id) {
  //   return <div>No organization ID provided</div>;
  // }

  if (organizationsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (organizationsQuery.error ?? !organizationsQuery.data) {
    return <div>Error loading organization data</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mx-16  my-10 flex  flex-col justify-evenly font-custom-lexend  text-customBlack-100">
        {/* CONTACT INFO AND DETAILS */}
        <div className="mb-16 grid grid-flow-col">
          <div className="flex-flex-col">
            <Image
              src={organization?.user.image ?? ""}
              alt="Organization Image"
              height={300}
              width={300}
            />
            <p className="text-xs">
              <span className="font-bold">Email Address:</span>{" "}
              {organization?.user?.email}
            </p>

            <p className=" text-xs">
              <span className="font-bold">Contact Number:</span>{" "}
              {organization?.phoneNumber}
            </p>
          </div>

          <div className="flex-start  ml-16 flex flex-col">
            <div className="flex">
              <h1 className="text-gradient mb-3  font-custom-epilogue text-4xl font-extrabold">
                {organization?.orgName}
              </h1>
            </div>

            <p className="mb-6 mr-20 text-sm">{organization?.bio}</p>

            <div className="flex gap-5  text-center">
              <button
                onClick={() => handleEditButton()}
                className="btn-outline w-1/2 border  px-8 py-2 font-normal"
              >
                Update Information
              </button>

              <button
                className="btn-outline w-1/2 border px-8 py-2 font-normal"
                style={{ color: "var(--red)", borderColor: "var(--red)" }}
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>

        {/* MISSION, VISION, OBJECTIVES */}
        <div className="mb-20 flex flex-col gap-6">
          {/* Mission Vision */}
          <div className="mb-6 flex gap-4">
            <div className="flex w-1/2 flex-col">
              <h1 className="text-gradient mb-2 flex font-custom-epilogue text-2xl font-semibold">
                Mission
              </h1>
              <p>{organization?.mission}</p>
            </div>

            <div className="flex w-1/2 flex-col">
              <h1 className="text-gradient mb-2 flex font-custom-epilogue text-2xl font-semibold">
                Vision
              </h1>
              <p>{organization?.vision}</p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mb-4 flex gap-4">
            <div className="flex w-1/2 flex-col">
              <h1 className="text-gradient mb-2 flex font-custom-epilogue text-2xl font-semibold">
                Objectives
              </h1>
              <p>{organization?.objectives}</p>
            </div>

            <div className="flex w-1/2 flex-col"></div>
          </div>
        </div>

        {/* EVENTS ORGANIZED */}

        <div className=" mb-24 flex flex-col gap-6">
          <h1 className="text-gradient flex  font-custom-epilogue text-4xl font-semibold">
            Events Organized
          </h1>
          <div className="flex gap-4 ">
            {events?.map((eventQuery) => (
              <EventCard
                key={eventQuery.id}
                event={eventQuery}
                searchText={""}
              />
            ))}
          </div>
        </div>

        {/* ALL ACTIVITIES */}
        <div className="mb-24 flex flex-col gap-6">
          <h1 className="text-gradient flex   font-custom-epilogue text-4xl font-semibold">
            All Activities
          </h1>
          <div className="flex gap-4">
            {activities?.map((activityQuery) => (
              <ActivitiesCard
                key={activityQuery.id}
                activity={activityQuery}
                searchText={""}
              />
            ))}
          </div>
        </div>

        {/* POOL OF SPEAKERS */}
        <div className="flex flex-col gap-6">
          <h1 className="text-gradient flex  font-custom-epilogue text-4xl font-semibold">
            Pool of Speakers
          </h1>
          <div className="flex gap-4"></div>
        </div>
      </div>
    </>
  );
};

const handleEditButton = () => {
  void router.push("/profile/organization/edit");
};

export default OrganizationPage;
