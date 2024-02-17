import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import vol2 from "public/images/vol2.png";

import Navbar from "~/components/navbar";
import { useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteModal from "~/components/DeleteModal";
import { useState } from "react";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";

const ActivitiesPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  const [toggleModal, setToggleModal] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const activityQuery = api.activity?.getOne.useQuery({
    id: id as string,
  });

  const activity = activityQuery.data;

  const deleteActivity = api.activity.deleteActivity.useMutation();

  if (!id) {
    return <div>No organization ID provided</div>;
  }

  if (activityQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (activityQuery.error ?? !activityQuery.data) {
    return <div>Error loading organization data</div>;
  }

  const handleToggleButton = () => {
    setToggleModal(!toggleModal);
  };

  const handleEditButton = () => {
    void router.push({
      pathname: `/homepage/activities/[id]/edit`,
      query: {
        id: activity?.id,
      },
    });
  };

  const handleDeleteButton = () => {
    deleteActivity.mutate({
      id: id as string,
    });

    void router.push("/homepage/activities");
  };

  return (
    <div className="flex flex-col">
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

        <div
          className="flex w-4/5 flex-col"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            hyphens: "auto",
          }}
        >
          <div>
            {/* EVENT NAME */}
            <section className="flex items-center justify-between">
              <h1 className="text-gradient font-custom-epilogue text-4xl  font-extrabold ">
                {activity?.name}
              </h1>
              {sessionData?.user.id === activity?.organization.user.id && (
                <div className="flex gap-4">
                  <IconButton onClick={handleEditButton}>
                    <EditTwoToneIcon />
                  </IconButton>
                  <IconButton onClick={() => handleToggleButton()}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </section>

            <div>
              <div className="my-2 flex items-center gap-1 ">
                <EventIcon
                  className="h-4 w-4 opacity-75"
                  style={{ color: "var(--black100)" }}
                />

                <p className="text-md italic text-customBlack-50">
                  {activity?.date.toLocaleString()}
                </p>
              </div>

              <div className="flex items-stretch gap-1">
                <PlaceIcon
                  className="h-4 w-4 opacity-75"
                  style={{ color: "var(--black100)" }}
                />

                <p className="text-md mb-6 italic text-customBlack-50">
                  {activity?.location}
                </p>
              </div>
            </div>

            <p
              className="text-md text-customBlack-50"
              style={{ fontSize: "12px" }}
            >
              Organized By:
            </p>
            <p className="text-gradient text-sm">
              {activity?.organization?.orgName}
            </p>

            <p className="mb-20 mt-12 whitespace-pre-wrap">
              {activity?.details}
            </p>
          </div>

          <DeleteModal
            toggleModal={toggleModal}
            handleToggleButton={handleToggleButton}
            handleDeleteButton={handleDeleteButton}
            string={"activity"}
          />

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
    </div>
  );
};

export default ActivitiesPage;
