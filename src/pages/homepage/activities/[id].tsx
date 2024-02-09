import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import vol2 from "../../../../assets/vol2.png";

import {
  LinearTextGradient,
  RadialTextGradient,
  ConicTextGradient,
} from "react-text-gradients-and-animations";
import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

const EventPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const user = api.user.getUser.useQuery({
    userId: sessionData?.user.id ?? "",
  });

  const activityQuery = api.activity?.getOne.useQuery({
    id: id as string,
  });

  const activity = activityQuery.data;

  if (!id) {
    return <div>No organization ID provided</div>;
  }

  if (activityQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (activityQuery.error ?? !activityQuery.data) {
    return <div>Error loading organization data</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mx-16 my-10  flex  justify-center gap-2 font-custom-lexend   text-customBlack-100">
        {/* IMAGES OF EVENTS*/}
        <div className="mr-24 flex w-2/5 flex-col gap-1">
          <Image
            className="flex w-full rounded-md"
            src={activity?.organization?.user?.image ?? vol2}
            alt="Organization Image"
            height={300}
            width={300}
          />

          <div className="flex gap-1">
            <Image
              className="rounded-md"
              src={activity?.organization?.user?.image ?? vol2}
              alt="Organization Image"
              height={300}
              width={300}
            />
            <Image
              className="rounded-md"
              src={activity?.organization?.user?.image ?? vol2}
              alt="Organization Image"
              height={300}
              width={300}
            />
            <Image
              className="rounded-md"
              src={activity?.organization?.user?.image ?? vol2}
              alt="Organization Image"
              height={300}
              width={300}
            />
          </div>
        </div>

        <div className="flex w-4/5 flex-col justify-between ">
          <div>
            {/* EVENT NAME */}
            <section className="flex items-center justify-between">
              <h1 className="text-gradient font-custom-epilogue text-4xl  font-extrabold ">
                {activity?.name}
              </h1>
              {sessionData?.user.id === activity?.organization.user.id && (
                <div className="flex gap-4">
                  <IconButton>
                    <EditTwoToneIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </section>

            <p className="text-md mb-6 italic text-customBlack-50">
              {activity?.date.toLocaleString()}
            </p>

            <p
              className="text-md text-customBlack-50"
              style={{ fontSize: "12px" }}
            >
              Organized By:
            </p>
            <p className="text-gradient text-sm">
              {activity?.organization?.orgName}
            </p>

            <p className="mt-12 whitespace-pre-wrap">{activity?.details}</p>
          </div>

          {sessionStatus !== "authenticated" && activity?.hasParticipants && (
            <button className="btn-active w-1/2 self-center px-2 py-2">
              Join Activity?
            </button>
          )}

          {sessionData?.user.role === "VOLUNTEER" &&
            activity?.hasVolunteers && (
              <button className="btn-active w-1/2 self-center px-2 py-2">
                Volunteer Now
              </button>
            )}

          {sessionData?.user.id !== activity?.organization.user.id &&
            sessionData?.user.role === "ORGANIZATION" &&
            activity?.hasOrganizations && (
              <button className="btn-active w-1/2 self-center px-2 py-2">
                Partner with Us!
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default EventPage;
